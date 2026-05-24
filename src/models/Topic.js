const mongoose = require('mongoose');

const theorySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    youtubeUrl: { type: String, default: '' },
    images: [{ url: String, caption: String }],
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    order: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    goal: { type: String, default: '' },
    keyTerms: [{ type: String }],
    theory: theorySchema,
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
