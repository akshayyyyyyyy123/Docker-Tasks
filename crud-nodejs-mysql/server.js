const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// ------------------------------
// Health check
// ------------------------------
app.get('/health', (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// ------------------------------
// GET all users
// ------------------------------
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    console.log("📤 Users fetched:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// GET user by ID
// ------------------------------
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      console.log("⚠️ User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("📤 User found:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// POST create user
// ------------------------------
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    const insertedUser = { id: result.insertId, name, email };
    console.log("✅ User inserted:", insertedUser);
    res.json(insertedUser);
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// PUT update user
// ------------------------------
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const [result] = await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);
    if (result.affectedRows === 0) {
      console.log("⚠️ User not found for update");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ User updated:", { id: userId, name, email });
    res.json({ id: userId, name, email });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// DELETE user
// ------------------------------
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      console.log("⚠️ User not found for deletion");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("🗑️ User deleted:", userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// START SERVER
// ------------------------------
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
