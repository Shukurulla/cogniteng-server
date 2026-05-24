const mongoose = require('mongoose');

const DIRECTIONS = ['attention', 'memory', 'logic', 'criticalThinking'];

const diagnosticQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    direction: {
      type: String,
      enum: DIRECTIONS,
      required: true,
    },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
  },
  { _id: true }
);

const diagnosticTestSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['entry', 'final'],
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    questions: [diagnosticQuestionSchema],
  },
  { timestamps: true }
);

diagnosticTestSchema.statics.DIRECTIONS = DIRECTIONS;

module.exports = mongoose.model('DiagnosticTest', diagnosticTestSchema);
