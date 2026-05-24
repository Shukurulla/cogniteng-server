const mongoose = require('mongoose');

const exerciseAttemptSchema = new mongoose.Schema(
  {
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    isCorrect: { type: Boolean, required: true },
    answer: { type: mongoose.Schema.Types.Mixed },
    attemptedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const testAttemptSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    theoryCompleted: { type: Boolean, default: false },
    exerciseAttempts: [exerciseAttemptSchema],
    testAttempts: [testAttemptSchema],
    bestScore: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
