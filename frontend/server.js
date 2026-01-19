import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB URI
const uri =
  "mongodb+srv://tabradys129_db_user:mongoDBpwBaby@busic.gfwrggz.mongodb.net/?appName=Busic";

// Schema + Model
const timmySchema = new mongoose.Schema({
  name: String,
});

const Timmy = mongoose.model("Timmy", timmySchema);

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();

// POST route (moved OUTSIDE connect())
app.post("/login", async (req, res) => {
  try {
    const { name } = req.body;

    const newTimmy = new Timmy({ name });
    await newTimmy.save();

    res.status(200).send({ message: "Saved to MongoDB!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// Start server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
