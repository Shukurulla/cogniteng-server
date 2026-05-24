const Progress = require('../models/Progress');
const Topic = require('../models/Topic');
const User = require('../models/User');
const DiagnosticResult = require('../models/DiagnosticResult');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/progress/me  (student) — own progress across all topics
const myProgress = asyncHandler(async (req, res) => {
  const [progress, topics, diagnostics] = await Promise.all([
    Progress.find({ user: req.user._id }).populate('topic', 'code order title'),
    Topic.find().select('code order title').sort({ order: 1 }),
    DiagnosticResult.find({ user: req.user._id }).sort({ createdAt: 1 }),
  ]);

  const byTopic = new Map(progress.map((p) => [String(p.topic?._id), p]));

  const topicsProgress = topics.map((t) => {
    const p = byTopic.get(String(t._id));
    return {
      topic: { id: t._id, code: t.code, order: t.order, title: t.title },
      theoryCompleted: p?.theoryCompleted || false,
      exerciseAttempts: p?.exerciseAttempts.length || 0,
      correctExercises: p?.exerciseAttempts.filter((a) => a.isCorrect).length || 0,
      testAttempts: p?.testAttempts.length || 0,
      bestScore: p?.bestScore || 0,
      isCompleted: p?.isCompleted || false,
    };
  });

  const completed = topicsProgress.filter((tp) => tp.isCompleted).length;
  const sumBest = topicsProgress.reduce((s, tp) => s + tp.bestScore, 0);
  const averageScore =
    topicsProgress.length > 0 ? Math.round(sumBest / topicsProgress.length) : 0;

  res.json({
    success: true,
    summary: {
      totalTopics: topics.length,
      completedTopics: completed,
      averageScore,
    },
    topics: topicsProgress,
    diagnostics,
  });
});

// POST /api/progress/topic/:topicId/theory-complete (student)
const markTheoryComplete = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, topic: topic._id },
    {
      $setOnInsert: { user: req.user._id, topic: topic._id },
      $set: { theoryCompleted: true },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, progress });
});

// GET /api/progress/students (teacher) — list of own students with summary
const myStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student', teacher: req.user._id })
    .select('fullName email language createdAt');

  const studentIds = students.map((s) => s._id);

  const [progressDocs, diagnostics, totalTopics] = await Promise.all([
    Progress.find({ user: { $in: studentIds } }),
    DiagnosticResult.find({ user: { $in: studentIds } }),
    Topic.countDocuments(),
  ]);

  const progressByUser = new Map();
  for (const p of progressDocs) {
    const key = String(p.user);
    if (!progressByUser.has(key)) progressByUser.set(key, []);
    progressByUser.get(key).push(p);
  }

  const diagByUser = new Map();
  for (const d of diagnostics) {
    const key = String(d.user);
    if (!diagByUser.has(key)) diagByUser.set(key, []);
    diagByUser.get(key).push(d);
  }

  const data = students.map((s) => {
    const ps = progressByUser.get(String(s._id)) || [];
    const completed = ps.filter((p) => p.isCompleted).length;
    const sumBest = ps.reduce((sum, p) => sum + (p.bestScore || 0), 0);
    const avgScore = totalTopics > 0 ? Math.round(sumBest / totalTopics) : 0;
    const ds = diagByUser.get(String(s._id)) || [];
    const lastDiagnostic = ds[ds.length - 1] || null;

    return {
      id: s._id,
      fullName: s.fullName,
      email: s.email,
      language: s.language,
      registeredAt: s.createdAt,
      summary: {
        totalTopics,
        completedTopics: completed,
        averageScore: avgScore,
        diagnosticsCount: ds.length,
        lastDiagnosticPercentage: lastDiagnostic?.totalPercentage ?? null,
      },
    };
  });

  res.json({ success: true, count: data.length, students: data });
});

// GET /api/progress/students/:studentId (teacher) — full progress of one student
const studentDetails = asyncHandler(async (req, res) => {
  const student = await User.findOne({
    _id: req.params.studentId,
    role: 'student',
    teacher: req.user._id,
  }).select('fullName email language createdAt');

  if (!student) {
    res.status(404);
    throw new Error('Student not found or not assigned to you');
  }

  const [progress, topics, diagnostics] = await Promise.all([
    Progress.find({ user: student._id }).populate('topic', 'code order title'),
    Topic.find().select('code order title').sort({ order: 1 }),
    DiagnosticResult.find({ user: student._id }).sort({ createdAt: 1 }),
  ]);

  const byTopic = new Map(progress.map((p) => [String(p.topic?._id), p]));

  const topicsProgress = topics.map((t) => {
    const p = byTopic.get(String(t._id));
    return {
      topic: { id: t._id, code: t.code, order: t.order, title: t.title },
      theoryCompleted: p?.theoryCompleted || false,
      exerciseAttempts: p?.exerciseAttempts.length || 0,
      correctExercises: p?.exerciseAttempts.filter((a) => a.isCorrect).length || 0,
      testAttempts: p?.testAttempts.length || 0,
      bestScore: p?.bestScore || 0,
      isCompleted: p?.isCompleted || false,
      lastTestAt: p?.testAttempts.slice(-1)[0]?.attemptedAt || null,
    };
  });

  res.json({
    success: true,
    student,
    topics: topicsProgress,
    diagnostics,
  });
});

module.exports = {
  myProgress,
  markTheoryComplete,
  myStudents,
  studentDetails,
};
