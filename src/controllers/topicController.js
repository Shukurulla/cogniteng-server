const Topic = require('../models/Topic');
const Exercise = require('../models/Exercise');
const Test = require('../models/Test');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/topics
const listTopics = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.user?.role === 'teacher') delete filter.isPublished;

  const topics = await Topic.find(filter)
    .select('code order title goal keyTerms isPublished')
    .sort({ order: 1 });

  res.json({ success: true, count: topics.length, topics });
});

// GET /api/topics/:id
const getTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  const [exerciseCount, test] = await Promise.all([
    Exercise.countDocuments({ topic: topic._id }),
    Test.findOne({ topic: topic._id }).select('_id title questions'),
  ]);

  res.json({
    success: true,
    topic,
    exerciseCount,
    test: test
      ? { id: test._id, title: test.title, questionCount: test.questions.length }
      : null,
  });
});

// GET /api/topics/by-code/:code
const getTopicByCode = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({ code: req.params.code.toUpperCase() });
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }
  res.json({ success: true, topic });
});

// POST /api/topics (teacher)
const createTopic = asyncHandler(async (req, res) => {
  const { code, order, title, goal, keyTerms, theory, isPublished } = req.body;

  const exists = await Topic.findOne({ $or: [{ code: code.toUpperCase() }, { order }] });
  if (exists) {
    res.status(409);
    throw new Error(`Topic with code "${code}" or order ${order} already exists`);
  }

  const topic = await Topic.create({
    code,
    order,
    title,
    goal,
    keyTerms,
    theory,
    isPublished,
  });

  res.status(201).json({ success: true, topic });
});

// PUT /api/topics/:id (teacher)
const updateTopic = asyncHandler(async (req, res) => {
  const allowed = ['title', 'goal', 'keyTerms', 'theory', 'isPublished', 'order'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const topic = await Topic.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  res.json({ success: true, topic });
});

// DELETE /api/topics/:id (teacher)
const deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findByIdAndDelete(req.params.id);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  await Promise.all([
    Exercise.deleteMany({ topic: topic._id }),
    Test.deleteMany({ topic: topic._id }),
  ]);

  res.json({ success: true, message: 'Topic and related exercises/tests deleted' });
});

module.exports = {
  listTopics,
  getTopic,
  getTopicByCode,
  createTopic,
  updateTopic,
  deleteTopic,
};
