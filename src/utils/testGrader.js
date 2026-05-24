// Grades a single-choice test (Test or DiagnosticTest)
// answers: [{ questionId, selectedIndex }]
const gradeTest = (questions, answers) => {
  const answerMap = new Map(
    (answers || []).map((a) => [String(a.questionId), Number(a.selectedIndex)])
  );

  let correct = 0;
  const detailed = questions.map((q) => {
    const selectedIdx = answerMap.get(String(q._id));
    const isCorrect = q.options[selectedIdx]?.isCorrect === true;
    if (isCorrect) correct += 1;
    return {
      questionId: q._id,
      direction: q.direction,
      selectedIndex: Number.isNaN(selectedIdx) ? null : selectedIdx,
      isCorrect,
    };
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percentage, detailed };
};

// Sanitize questions: hide isCorrect
const sanitizeQuestions = (questions) =>
  questions.map((q) => {
    const obj = q.toObject ? q.toObject() : q;
    return {
      _id: obj._id,
      text: obj.text,
      direction: obj.direction,
      options: (obj.options || []).map((o) => ({ text: o.text })),
    };
  });

module.exports = { gradeTest, sanitizeQuestions };
