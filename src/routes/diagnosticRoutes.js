const express = require('express');
const router = express.Router();

const {
  getDiagnostic,
  upsertDiagnostic,
  submitDiagnostic,
  myDiagnosticResults,
} = require('../controllers/diagnosticController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { diagnosticUpsertRules, submitRules } = require('../validators/testValidators');

router.get('/results/me', protect, myDiagnosticResults);
router.get('/:kind', protect, getDiagnostic);
router.post(
  '/:kind',
  protect,
  authorize('teacher'),
  diagnosticUpsertRules,
  validate,
  upsertDiagnostic
);
router.post(
  '/:kind/submit',
  protect,
  authorize('student'),
  submitRules,
  validate,
  submitDiagnostic
);

module.exports = router;
