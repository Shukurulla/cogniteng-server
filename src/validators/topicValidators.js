const { body } = require('express-validator');

const createTopicRules = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Code is required (e.g. A1)')
    .matches(/^A([1-9]|1[0-5])$/i)
    .withMessage('Code must be A1..A15'),
  body('order').isInt({ min: 1, max: 15 }).withMessage('Order must be 1..15'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('goal').optional().isString(),
  body('keyTerms').optional().isArray(),
  body('theory.text').optional().isString(),
  body('theory.youtubeUrl').optional().isString(),
  body('theory.images').optional().isArray(),
  body('isPublished').optional().isBoolean(),
];

const updateTopicRules = [
  body('title').optional().trim().notEmpty(),
  body('goal').optional().isString(),
  body('keyTerms').optional().isArray(),
  body('theory').optional().isObject(),
  body('isPublished').optional().isBoolean(),
  body('order').optional().isInt({ min: 1, max: 15 }),
];

module.exports = { createTopicRules, updateTopicRules };
