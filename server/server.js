import dotenv from "dotenv";
dotenv.config();

import { createRequire } from "module";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const require = createRequire(import.meta.url);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

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

//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLINARY_CLOUD_NAME,
  api_key: process.env.CLINARY_KEY,
  api_secret: process.env.CLINARY_SECRET,
});

// Schema + Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  image: { type: String, required: false },
  notes: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    notes: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);
//sets the schema in the DB
const User = mongoose.model("User", userSchema);
const Song = mongoose.model("Song", songSchema);
const Recipe = mongoose.model("Recipe", recipeSchema);

//middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post(
  "/api/songs/upload-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { songId } = req.body;

    if (!req.file || !songId) {
      return res.status(400).json({ error: "Image and songId are required" });
    }

    try {
      // Upload buffer directly to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "song-covers" },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        stream.end(req.file.buffer);
      });

      // Save the Cloudinary URL to the song in MongoDB
      const song = await Song.findOneAndUpdate(
        { _id: songId, userId: req.user.userId },
        { image: result.secure_url },
        { new: true },
      );

      if (!song) return res.status(404).json({ error: "Song not found" });

      res.json({
        message: "Image uploaded",
        imageUrl: result.secure_url,
        song,
      });
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

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
      { expiresIn: "7d" },
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

//SET User's Songs:
app.post("/api/songs/add", authMiddleware, async (req, res) => {
  const { title, artist } = req.body;

  // Basic validation
  if (!title || !artist) {
    return res.status(400).json({ error: "Title and Artist are required" });
  }

  try {
    const song = await Song.create({ title, artist, userId: req.user.userId });

    res.json({ message: "Song created", song });
  } catch (err) {
    console.error("Add Song error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET User's Songs:
app.get("/api/songs/get", authMiddleware, async (req, res) => {
  try {
    const songs = await Song.find({ userId: req.user.userId });
    res.json({ songs });
  } catch (err) {
    console.error("Get Songs error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//Update Song #2
app.put("/api/songs/update/:id", authMiddleware, async (req, res) => {
  const { title, artist, notes } = req.body;
  try {
    const song = await Song.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, artist, notes },
      { new: true },
    );
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json({ song });
  } catch (err) {
    console.error("Update song error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
////////////////////////////////////////////RECIPES
// GET recipes
app.get("/api/recipes/get", authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.userId });
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new recipe
app.post("/api/recipes/add", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const recipe = new Recipe({ userId: req.user.userId, title, description });
    await recipe.save();
    res.json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update recipe
app.put("/api/recipes/update/:id", authMiddleware, async (req, res) => {
  const { title, description, notes } = req.body;
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, notes },
      { new: true },
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST upload image
app.post(
  "/api/recipes/upload-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { recipeId } = req.body;
    try {
      const imageUrl = `/uploads/${req.file.filename}`;
      const recipe = await Recipe.findOneAndUpdate(
        { _id: recipeId, userId: req.user.userId },
        { image: imageUrl },
        { new: true },
      );
      if (!recipe) return res.status(404).json({ error: "Recipe not found" });
      res.json({ recipe });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
