const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/token');

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  language: user.language,
  teacher: user.teacher,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, language, teacherEmail } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  let teacherId = null;
  if (teacherEmail) {
    const teacher = await User.findOne({ email: teacherEmail.toLowerCase(), role: 'teacher' });
    if (!teacher) {
      res.status(400);
      throw new Error('Teacher with provided email not found');
    }
    teacherId = teacher._id;
  }

  const user = await User.create({
    fullName,
    email,
    password,
    language: language || 'en',
    role: 'student',
    teacher: teacherId,
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [refreshToken];
  await user.save();

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res.json({
    success: true,
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  });
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (e) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    res.status(401);
    throw new Error('Refresh token not recognized');
  }

  const newAccess = signAccessToken(user._id);
  const newRefresh = signRefreshToken(user._id);

  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken).concat(newRefresh).slice(-5);
  await user.save();

  res.json({
    success: true,
    accessToken: newAccess,
    refreshToken: newRefresh,
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findById(req.user._id).select('+refreshTokens');
  if (user && refreshToken) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

module.exports = { register, login, refresh, logout, me };
