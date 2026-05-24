const Test = require('../models/Test');
const Topic = require('../models/Topic');
const Progress = require('../models/Progress');
const asyncHandler = require('../utils/asyncHandler');
const { gradeTest, sanitizeQuestions } = require('../utils/testGrader');

// GET /api/topics/:topicId/test  (student & teacher)
const getTestByTopic = asyncHandler(async (req, res) => {
  const test = await Test.findOne({ topic: req.params.topicId });
  if (!test) {
    res.status(404);
    throw new Error('Test not found for this topic');
  }

  const questions =
    req.user?.role === 'teacher' ? test.questions : sanitizeQuestions(test.questions);

  res.json({
    success: true,
    test: {
      id: test._id,
      topic: test.topic,
      title: test.title,
      passingScore: test.passingScore,
      questions,
    },
  });
});

// POST /api/topics/:topicId/test  (teacher) — upsert
const upsertTest = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  const { title, questions, passingScore } = req.body;

  const test = await Test.findOneAndUpdate(
    { topic: topic._id },
    {
      topic: topic._id,
      title: title || 'Yakuniy test',
      questions,
      passingScore: passingScore ?? 60,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, test });
});

// DELETE /api/topics/:topicId/test (teacher)
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findOneAndDelete({ topic: req.params.topicId });
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  res.json({ success: true, message: 'Test deleted' });
});

// POST /api/topics/:topicId/test/submit (student)
const submitTest = asyncHandler(async (req, res) => {
  const test = await Test.findOne({ topic: req.params.topicId });
  if (!test) {
    res.status(404);
    throw new Error('Test not found for this topic');
  }

  const { correct, total, percentage } = gradeTest(test.questions, req.body.answers);
  const isPassed = percentage >= test.passingScore;

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, topic: test.topic },
    {
      $setOnInsert: { user: req.user._id, topic: test.topic },
      $push: {
        testAttempts: {
          score: correct,
          percentage,
          totalQuestions: total,
          correctAnswers: correct,
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (percentage > progress.bestScore) {
    progress.bestScore = percentage;
  }
  if (isPassed && !progress.isCompleted) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
  }
  await progress.save();

  res.json({
    success: true,
    score: correct,
    totalQuestions: total,
    percentage,
    isPassed,
    bestScore: progress.bestScore,
  });
});

module.exports = { getTestByTopic, upsertTest, deleteTest, submitTest };
