const express = require('express');
const router = express.Router();

const {
  listTopics,
  getTopic,
  getTopicByCode,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTopicRules,
  updateTopicRules,
} = require('../validators/topicValidators');

router.get('/', protect, listTopics);
router.get('/by-code/:code', protect, getTopicByCode);
router.get('/:id', protect, getTopic);

router.post('/', protect, authorize('teacher'), createTopicRules, validate, createTopic);
router.put('/:id', protect, authorize('teacher'), updateTopicRules, validate, updateTopic);
router.delete('/:id', protect, authorize('teacher'), deleteTopic);

module.exports = router;
