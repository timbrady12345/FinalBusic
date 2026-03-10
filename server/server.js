import dotenv from "dotenv";
dotenv.config();

import { createRequire } from "module";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const require = createRequire(import.meta.url);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ensure required env vars exist
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in .env");
  process.exit(1);
}

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

connect();

// Schema + Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
//sets the schema in the DB
const User = mongoose.model("User", userSchema);

// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { email, username, password } = req.body;

  // Basic validation
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: "Email, Username, and password required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const existingUn = await User.findOne({ username });
    if (existingUn) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, username, passwordHash });

    res.json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1m" },
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET USER COUNT
app.get("/api/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
