const { body } = require('express-validator');

const EXERCISE_TYPES = ['multipleChoice', 'trueFalse', 'matching', 'gapFilling'];

const validatePayload = (value, { req }) => {
  const { type } = req.body;

  if (type === 'multipleChoice') {
    if (!Array.isArray(value?.options) || value.options.length < 2) {
      throw new Error('multipleChoice requires options[] with at least 2 entries');
    }
    if (!value.options.some((o) => o.isCorrect === true)) {
      throw new Error('multipleChoice requires at least one option with isCorrect=true');
    }
  } else if (type === 'trueFalse') {
    if (typeof value?.statement !== 'string' || !value.statement.trim()) {
      throw new Error('trueFalse requires statement string');
    }
    if (typeof value.correctAnswer !== 'boolean') {
      throw new Error('trueFalse requires correctAnswer boolean');
    }
  } else if (type === 'matching') {
    if (!Array.isArray(value?.pairs) || value.pairs.length < 2) {
      throw new Error('matching requires pairs[] with at least 2 entries');
    }
    if (value.pairs.some((p) => !p.left || !p.right)) {
      throw new Error('each matching pair needs left and right');
    }
  } else if (type === 'gapFilling') {
    if (typeof value?.text !== 'string' || !value.text.includes('___')) {
      throw new Error('gapFilling requires text containing ___ markers');
    }
    if (!Array.isArray(value.blanks) || value.blanks.length === 0) {
      throw new Error('gapFilling requires blanks[] array');
    }
  }
  return true;
};

const createExerciseRules = [
  body('type').isIn(EXERCISE_TYPES).withMessage(`type must be one of ${EXERCISE_TYPES.join(', ')}`),
  body('prompt').trim().notEmpty().withMessage('prompt is required'),
  body('order').optional().isInt({ min: 0 }),
  body('payload').custom(validatePayload),
  body('explanation').optional().isString(),
];

const updateExerciseRules = [
  body('prompt').optional().trim().notEmpty(),
  body('order').optional().isInt({ min: 0 }),
  body('payload').optional(),
  body('explanation').optional().isString(),
];

const attemptRules = [
  body('answer').exists().withMessage('answer is required').isObject(),
];

module.exports = { createExerciseRules, updateExerciseRules, attemptRules };
