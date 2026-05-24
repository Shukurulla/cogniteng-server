const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      unique: true,
    },
    title: { type: String, default: 'Yakuniy test' },
    questions: {
      type: [questionSchema],
      validate: [(v) => v.length > 0, 'Test must have at least one question'],
    },
    passingScore: { type: Number, default: 60 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);
