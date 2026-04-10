const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }, // Liên kết với issue nếu có
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  createdAt: { type: Date, default: Date.now },
  repliedAt: { type: Date },
  replyContent: { type: String }
});

module.exports = mongoose.model("Message", MessageSchema);