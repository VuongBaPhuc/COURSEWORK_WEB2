const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  issueCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  solution: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Issue", IssueSchema);