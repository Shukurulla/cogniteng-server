const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  listByTopic,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  submitAttempt,
} = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createExerciseRules,
  updateExerciseRules,
  attemptRules,
} = require('../validators/exerciseValidators');

// Mounted at /api/topics/:topicId/exercises
router.get('/topics/:topicId/exercises', protect, listByTopic);
router.post(
  '/topics/:topicId/exercises',
  protect,
  authorize('teacher'),
  createExerciseRules,
  validate,
  createExercise
);

// Mounted at /api/exercises
router.get('/exercises/:id', protect, getExercise);
router.put(
  '/exercises/:id',
  protect,
  authorize('teacher'),
  updateExerciseRules,
  validate,
  updateExercise
);
router.delete('/exercises/:id', protect, authorize('teacher'), deleteExercise);
router.post(
  '/exercises/:id/attempt',
  protect,
  authorize('student'),
  attemptRules,
  validate,
  submitAttempt
);

module.exports = router;
