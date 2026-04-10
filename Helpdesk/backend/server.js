const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("⚡ Starting server...");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/helpdesk")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Import controllers
const userController = require("./controllers/userController");
const messageController = require("./controllers/messageController");
const wordController = require("./controllers/wordController");

// Auth middleware
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  next();
};

// Routes
app.post("/api/auth/login", userController.login);

// Issues routes
app.get("/api/issues", wordController.getAll);
app.get("/api/issues/search", wordController.search);
app.get("/api/issues/categories", wordController.getCategories);
app.get("/api/issues/:id", wordController.getOne);
app.post("/api/issues", ...wordController.create);
app.put("/api/issues/:id", ...wordController.update);
app.delete("/api/issues/:id", ...wordController.remove);

// Messages routes
app.post("/api/messages", ...messageController.sendMessage);
app.get("/api/messages", ...messageController.getMessages);
app.put("/api/messages/:id/reply", ...messageController.replyMessage);
app.put("/api/messages/:id/read", ...messageController.markAsRead);
app.get("/api/messages/unread", ...messageController.getUnreadCount);

// Users routes (admin only)
app.get("/api/users", userController.getAll);
app.post("/api/users", userController.create);
app.put("/api/users/:id", userController.update);
app.delete("/api/users/:id", userController.remove);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`\n✅ Server on http://localhost:${PORT}\n`));