const User = require("../models/User");
const bcrypt = require("bcrypt");

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check (in production, use bcrypt)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ALL USERS (admin only)
exports.getAll = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE USER (admin only)
exports.create = async (req, res) => {
  try {
    const { username, password, email, name, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newUser = new User({
      username,
      password, // In production, hash this
      email,
      name,
      role: role || 'employee'
    });

    await newUser.save();
    const userResponse = await User.findById(newUser._id, '-password');
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE USER (admin only)
exports.update = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = password; // In production, hash this
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE USER (admin only)
exports.remove = async (req, res) => {
  try {
    const deleted = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};