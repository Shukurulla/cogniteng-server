const mongoose = require('mongoose');

const directionScoreSchema = new mongoose.Schema(
  {
    direction: {
      type: String,
      enum: ['attention', 'memory', 'logic', 'criticalThinking'],
      required: true,
    },
    total: { type: Number, required: true },
    correct: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { _id: false }
);

const diagnosticResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiagnosticTest',
      required: true,
    },
    kind: {
      type: String,
      enum: ['entry', 'final'],
      required: true,
    },
    totalScore: { type: Number, required: true },
    totalPercentage: { type: Number, required: true },
    byDirection: [directionScoreSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiagnosticResult', diagnosticResultSchema);
