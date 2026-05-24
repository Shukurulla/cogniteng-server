const express = require('express');
const router = express.Router();

const {
  getTestByTopic,
  upsertTest,
  deleteTest,
  submitTest,
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { testUpsertRules, submitRules } = require('../validators/testValidators');

// All under /api
router.get('/topics/:topicId/test', protect, getTestByTopic);
router.post(
  '/topics/:topicId/test',
  protect,
  authorize('teacher'),
  testUpsertRules,
  validate,
  upsertTest
);
router.delete('/topics/:topicId/test', protect, authorize('teacher'), deleteTest);
router.post(
  '/topics/:topicId/test/submit',
  protect,
  authorize('student'),
  submitRules,
  validate,
  submitTest
);

module.exports = router;
