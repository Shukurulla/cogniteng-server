const Exercise = require('../models/Exercise');
const Topic = require('../models/Topic');
const Progress = require('../models/Progress');
const asyncHandler = require('../utils/asyncHandler');
const { grade, sanitizeForStudent } = require('../utils/exerciseGrader');

// GET /api/topics/:topicId/exercises
const listByTopic = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({ topic: req.params.topicId }).sort({ order: 1 });

  const data =
    req.user?.role === 'teacher'
      ? exercises
      : exercises.map(sanitizeForStudent);

  res.json({ success: true, count: data.length, exercises: data });
});

// GET /api/exercises/:id
const getExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  const data = req.user?.role === 'teacher' ? exercise : sanitizeForStudent(exercise);
  res.json({ success: true, exercise: data });
});

// POST /api/topics/:topicId/exercises (teacher)
const createExercise = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.topicId);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  const { type, order, prompt, payload, explanation } = req.body;

  if (!Exercise.TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${Exercise.TYPES.join(', ')}`);
  }

  const exercise = await Exercise.create({
    topic: topic._id,
    type,
    order: order ?? 0,
    prompt,
    payload,
    explanation: explanation || '',
  });

  res.status(201).json({ success: true, exercise });
});

// PUT /api/exercises/:id (teacher)
const updateExercise = asyncHandler(async (req, res) => {
  const allowed = ['order', 'prompt', 'payload', 'explanation'];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  const exercise = await Exercise.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  res.json({ success: true, exercise });
});

// DELETE /api/exercises/:id (teacher)
const deleteExercise = asyncHandler(async (req, res) => {
  const ex = await Exercise.findByIdAndDelete(req.params.id);
  if (!ex) {
    res.status(404);
    throw new Error('Exercise not found');
  }
  res.json({ success: true, message: 'Exercise deleted' });
});

// POST /api/exercises/:id/attempt (student)
const submitAttempt = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  const result = grade(exercise, req.body.answer);

  // Save attempt to Progress (one document per user+topic)
  await Progress.findOneAndUpdate(
    { user: req.user._id, topic: exercise.topic },
    {
      $setOnInsert: { user: req.user._id, topic: exercise.topic },
      $push: {
        exerciseAttempts: {
          exercise: exercise._id,
          isCorrect: result.isCorrect,
          answer: req.body.answer,
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({
    success: true,
    isCorrect: result.isCorrect,
    reason: result.reason,
    explanation: result.isCorrect ? undefined : exercise.explanation || undefined,
  });
});

module.exports = {
  listByTopic,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  submitAttempt,
};
