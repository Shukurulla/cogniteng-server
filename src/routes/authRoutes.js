const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
  me,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  refreshRules,
} = require('../validators/authValidators');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/refresh', refreshRules, validate, refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
