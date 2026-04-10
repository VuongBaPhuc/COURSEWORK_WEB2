const Issue = require("../models/Word");
const User = require("../models/User");
const Message = require("../models/Message");

// Middleware để check authentication
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

// Middleware để check role
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || user.role !== role) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
};

// GET ALL ISSUES (public for customers, all for employees/admin)
exports.getAll = async (req, res) => {
  try {
    console.log("getAll called, userId:", req.userId);
    const query = { isActive: true };

    // Nếu là customer, chỉ lấy issues public
    if (req.user && req.user.role === 'customer') {
      // Có thể thêm logic filter ở đây
    }

    const data = await Issue.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
    console.log("Found issues:", data.length);
    res.json(data);
  } catch (error) {
    console.error("Error in getAll:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// SEARCH ISSUES (public)
exports.search = async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = { isActive: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { solution: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const data = await Issue.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE ISSUE (admin only)
exports.create = [requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const newIssue = new Issue({
      ...req.body,
      createdBy: req.user._id
    });
    await newIssue.save();
    const populatedIssue = await Issue.findById(newIssue._id).populate('createdBy', 'name');
    res.json(populatedIssue);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// GET ONE ISSUE
exports.getOne = async (req, res) => {
  try {
    const data = await Issue.findById(req.params.id).populate('createdBy', 'name');
    if (!data) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE ISSUE (admin only)
exports.update = [requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('createdBy', 'name');

    if (!updated) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// DELETE ISSUE (admin only)
exports.remove = [requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Issue.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json({ message: "Issue deactivated" });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}];

// GET CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Issue.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};