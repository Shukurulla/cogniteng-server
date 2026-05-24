const { body } = require('express-validator');

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('questions[] must be non-empty');
  }
  for (const [i, q] of questions.entries()) {
    if (!q.text || typeof q.text !== 'string') {
      throw new Error(`question[${i}].text is required`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`question[${i}].options must have at least 2 entries`);
    }
    if (!q.options.some((o) => o.isCorrect === true)) {
      throw new Error(`question[${i}] must have at least one isCorrect=true option`);
    }
  }
  return true;
};

const validateDiagnosticQuestions = (questions) => {
  validateQuestions(questions);
  const allowed = ['attention', 'memory', 'logic', 'criticalThinking'];
  for (const [i, q] of questions.entries()) {
    if (!allowed.includes(q.direction)) {
      throw new Error(`question[${i}].direction must be one of ${allowed.join(', ')}`);
    }
  }
  return true;
};

const testUpsertRules = [
  body('title').optional().isString(),
  body('passingScore').optional().isInt({ min: 0, max: 100 }),
  body('questions').custom(validateQuestions),
];

const diagnosticUpsertRules = [
  body('title').notEmpty().withMessage('title is required'),
  body('description').optional().isString(),
  body('questions').custom(validateDiagnosticQuestions),
];

const submitRules = [
  body('answers').isArray({ min: 1 }).withMessage('answers[] required'),
  body('answers.*.questionId').notEmpty(),
  body('answers.*.selectedIndex').isInt({ min: 0 }),
];

module.exports = { testUpsertRules, diagnosticUpsertRules, submitRules };
