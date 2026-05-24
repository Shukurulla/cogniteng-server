const mongoose = require('mongoose');

const EXERCISE_TYPES = ['multipleChoice', 'trueFalse', 'matching', 'gapFilling'];

const exerciseSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: EXERCISE_TYPES,
      required: true,
    },
    order: { type: Number, default: 0 },
    prompt: { type: String, required: true },

    // multipleChoice: { options: [{ text, isCorrect }] }
    // trueFalse: { statement, correctAnswer: Boolean }
    // matching: { pairs: [{ left, right }] }
    // gapFilling: { text: 'I ___ to school', blanks: ['go'] }
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    explanation: { type: String, default: '' },
  },
  { timestamps: true }
);

exerciseSchema.statics.TYPES = EXERCISE_TYPES;

module.exports = mongoose.model('Exercise', exerciseSchema);
