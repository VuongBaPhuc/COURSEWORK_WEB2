const Message = require("../models/Message");
const User = require("../models/User");

// Middleware auth
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

// SEND MESSAGE (employees only)
exports.sendMessage = [requireAuth, async (req, res) => {
  try {
    console.log('sendMessage called, userId:', req.userId);
    console.log('Message body:', req.body);
    
    const user = await User.findById(req.userId);
    console.log('user found:', user ? user.username : 'null');
    
    if (!user || user.role !== 'employee') {
      console.log('not employee or not found');
      return res.status(403).json({ error: 'Only employees can send messages' });
    }

    // Find admin to send to
    const admin = await User.findOne({ role: 'admin', isActive: true });
    console.log('admin found:', admin ? admin.username : 'null');
    
    if (!admin) {
      return res.status(404).json({ error: 'No admin available' });
    }

    const newMessage = new Message({
      ...req.body,
      from: req.userId,
      to: admin._id
    });

    console.log('Saving message:', newMessage);
    await newMessage.save();
    
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('from', 'name username')
      .populate('to', 'name username')
      .populate('issueId', 'title issueCode');

    console.log('Message saved successfully:', populatedMessage._id);
    res.json(populatedMessage);
  } catch (error) {
    console.error('sendMessage error:', error.message);
    console.error('sendMessage error stack:', error.stack);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}];

// GET MESSAGES (for current user)
exports.getMessages = [requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { from: req.userId },
        { to: req.userId }
      ]
    })
    .populate('from', 'name username role')
    .populate('to', 'name username role')
    .populate('issueId', 'title issueCode')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// REPLY TO MESSAGE (admin only)
exports.replyMessage = [requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can reply' });
    }

    const { replyContent } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        replyContent,
        repliedAt: Date.now(),
        status: 'replied'
      },
      { new: true }
    )
    .populate('from', 'name username')
    .populate('to', 'name username')
    .populate('issueId', 'title issueCode');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// MARK AS READ
exports.markAsRead = [requireAuth, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, to: req.userId },
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// GET UNREAD COUNT
exports.getUnreadCount = [requireAuth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      to: req.userId,
      status: 'unread'
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];