const DiagnosticTest = require('../models/DiagnosticTest');
const DiagnosticResult = require('../models/DiagnosticResult');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeQuestions } = require('../utils/testGrader');

// GET /api/diagnostics/:kind  (kind: entry | final)
const getDiagnostic = asyncHandler(async (req, res) => {
  const { kind } = req.params;
  if (!['entry', 'final'].includes(kind)) {
    res.status(400);
    throw new Error('kind must be entry or final');
  }

  const test = await DiagnosticTest.findOne({ kind });
  if (!test) {
    res.status(404);
    throw new Error(`${kind} diagnostic test not found`);
  }

  const questions =
    req.user?.role === 'teacher' ? test.questions : sanitizeQuestions(test.questions);

  res.json({
    success: true,
    test: {
      id: test._id,
      kind: test.kind,
      title: test.title,
      description: test.description,
      questions,
    },
  });
});

// POST /api/diagnostics/:kind (teacher) — upsert
const upsertDiagnostic = asyncHandler(async (req, res) => {
  const { kind } = req.params;
  if (!['entry', 'final'].includes(kind)) {
    res.status(400);
    throw new Error('kind must be entry or final');
  }

  const { title, description, questions } = req.body;
  const test = await DiagnosticTest.findOneAndUpdate(
    { kind },
    { kind, title, description: description || '', questions },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, test });
});

// POST /api/diagnostics/:kind/submit (student)
const submitDiagnostic = asyncHandler(async (req, res) => {
  const { kind } = req.params;
  const test = await DiagnosticTest.findOne({ kind });
  if (!test) {
    res.status(404);
    throw new Error(`${kind} diagnostic test not found`);
  }

  const answerMap = new Map(
    (req.body.answers || []).map((a) => [String(a.questionId), Number(a.selectedIndex)])
  );

  const byDir = {};
  for (const dir of DiagnosticTest.DIRECTIONS) {
    byDir[dir] = { total: 0, correct: 0 };
  }

  let totalCorrect = 0;
  for (const q of test.questions) {
    const selectedIdx = answerMap.get(String(q._id));
    const isCorrect = q.options[selectedIdx]?.isCorrect === true;
    byDir[q.direction].total += 1;
    if (isCorrect) {
      byDir[q.direction].correct += 1;
      totalCorrect += 1;
    }
  }

  const total = test.questions.length;
  const totalPercentage = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

  const byDirection = DiagnosticTest.DIRECTIONS.map((dir) => ({
    direction: dir,
    total: byDir[dir].total,
    correct: byDir[dir].correct,
    percentage:
      byDir[dir].total > 0 ? Math.round((byDir[dir].correct / byDir[dir].total) * 100) : 0,
  }));

  const result = await DiagnosticResult.create({
    user: req.user._id,
    test: test._id,
    kind: test.kind,
    totalScore: totalCorrect,
    totalPercentage,
    byDirection,
  });

  res.status(201).json({
    success: true,
    result: {
      id: result._id,
      kind: result.kind,
      totalScore: result.totalScore,
      totalPercentage: result.totalPercentage,
      byDirection: result.byDirection,
    },
  });
});

// GET /api/diagnostics/results/me (student)
const myDiagnosticResults = asyncHandler(async (req, res) => {
  const results = await DiagnosticResult.find({ user: req.user._id })
    .sort({ createdAt: 1 });
  res.json({ success: true, count: results.length, results });
});

module.exports = {
  getDiagnostic,
  upsertDiagnostic,
  submitDiagnostic,
  myDiagnosticResults,
};
