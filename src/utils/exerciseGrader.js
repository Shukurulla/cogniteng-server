const normalize = (s) =>
  String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

const arraysEqual = (a, b) =>
  Array.isArray(a) && Array.isArray(b) && a.length === b.length &&
  a.every((v, i) => v === b[i]);

const grade = (exercise, answer) => {
  const { type, payload } = exercise;

  switch (type) {
    case 'multipleChoice': {
      // answer: { selectedIndex: Number }
      const idx = Number(answer?.selectedIndex);
      if (Number.isNaN(idx)) return { isCorrect: false, reason: 'selectedIndex missing' };
      const opt = payload.options?.[idx];
      return { isCorrect: !!opt?.isCorrect };
    }

    case 'trueFalse': {
      // answer: { value: Boolean }
      if (typeof answer?.value !== 'boolean') {
        return { isCorrect: false, reason: 'value must be boolean' };
      }
      return { isCorrect: answer.value === payload.correctAnswer };
    }

    case 'matching': {
      // payload.pairs: [{ left, right }, ...]
      // answer: { matches: [{ leftIndex, rightIndex }, ...] }
      const pairs = payload.pairs || [];
      const matches = answer?.matches || [];
      if (matches.length !== pairs.length) {
        return { isCorrect: false, reason: 'all pairs must be matched' };
      }
      const isCorrect = matches.every(
        (m) => Number(m.leftIndex) === Number(m.rightIndex)
      );
      return { isCorrect };
    }

    case 'gapFilling': {
      // payload: { text: "I ___ school", blanks: ["go to"] }
      // answer: { blanks: ["go to"] }
      const expected = (payload.blanks || []).map(normalize);
      const got = (answer?.blanks || []).map(normalize);
      return { isCorrect: arraysEqual(expected, got) };
    }

    default:
      return { isCorrect: false, reason: `unknown exercise type ${type}` };
  }
};

// Strip correct-answer info before sending exercise to student
const sanitizeForStudent = (exercise) => {
  const obj = exercise.toObject ? exercise.toObject() : { ...exercise };
  const { type, payload } = obj;

  if (type === 'multipleChoice') {
    obj.payload = {
      ...payload,
      options: (payload.options || []).map((o) => ({ text: o.text })),
    };
  } else if (type === 'trueFalse') {
    obj.payload = { statement: payload.statement };
  } else if (type === 'matching') {
    // Shuffle right column so order is not a giveaway
    const lefts = (payload.pairs || []).map((p, i) => ({ index: i, text: p.left }));
    const rights = (payload.pairs || []).map((p, i) => ({ index: i, text: p.right }))
      .sort(() => Math.random() - 0.5);
    obj.payload = { lefts, rights };
  } else if (type === 'gapFilling') {
    obj.payload = {
      text: payload.text,
      blankCount: (payload.blanks || []).length,
    };
  }

  return obj;
};

module.exports = { grade, sanitizeForStudent };
