const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// SIMPLEST test
app.get("/health", (req, res) => {
  console.log("✅ GET /health HIT");
  res.json({ ok: true });
});

app.post("/api/messages", (req, res) => {
  console.log("✅ POST /api/messages HIT");
  console.log("Body:", req.body);
  res.json({ success: true });
});

app.use((req, res) => {
  console.log("❌ 404:", req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

app.listen(3001, () => {
  console.log("🚀 Test server on port 3001");
  console.log("Try: curl http://localhost:3001/health");
  console.log("Or: curl -X POST http://localhost:3001/api/messages");
});
