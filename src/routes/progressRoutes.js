const express = require('express');
const router = express.Router();

const {
  myProgress,
  markTheoryComplete,
  myStudents,
  studentDetails,
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me', protect, authorize('student'), myProgress);
router.post(
  '/topic/:topicId/theory-complete',
  protect,
  authorize('student'),
  markTheoryComplete
);

router.get('/students', protect, authorize('teacher'), myStudents);
router.get('/students/:studentId', protect, authorize('teacher'), studentDetails);

module.exports = router;
