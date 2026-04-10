const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const wordController = require("../controllers/wordController");

console.log("wordRoutes.js loading...");
console.log("messageController.sendMessage type:", typeof messageController.sendMessage);
console.log("messageController.sendMessage:", messageController.sendMessage);

// Middleware
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

// Auth routes
router.post("/auth/login", userController.login);
console.log("✓ /auth/login route added");

// Issues routes
router.get("/issues", wordController.getAll || ((req, res) => res.json([])));
console.log("✓ /issues route added");

router.get("/issues/categories", (req, res) => res.json(["bug", "feature", "support"]));
console.log("✓ /issues/categories route added");

// Messages routes
router.post("/messages", ...messageController.sendMessage);
console.log("✓ /messages POST route added");

router.get("/messages/unread", requireAuth, messageController.getMessages || ((req, res) => res.json([])));
console.log("✓ /messages/unread route added");

console.log("Router initialized with", router.stack.length, "routes");
module.exports = router;