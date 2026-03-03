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
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    res.json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
