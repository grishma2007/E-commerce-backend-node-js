const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// router.post("/register", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ message: "Email already exists" });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       phone,
//       password: hashed
//     });

//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Registration failed" });
//   }
// });
router.post("/register", async (req, res) => {
  console.log("1. Backend hit! /register route started.");

  try {
    // Moved inside the try block to catch any destructuring errors!
    const { name, email, phone, password } = req.body;
    console.log("2. Request body received:", { name, email, phone }); // Omit password for security

    if (!name || !email || !password) {
      console.log("Error: Missing required fields in req.body");
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("3. Checking for existing user in database...");
    // ⚠️ IF IT HANGS HERE, YOUR MONGODB CONNECTION IS FAILING
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log("4a. User already exists.");
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("4b. User does not exist, hashing password...");
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashed
    });

    console.log("5. Saving new user to database...");
    await user.save();
    
    console.log("6. Success! Sending response.");
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("❌ BACKEND ERROR:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Wrong password" });

    // ✅ VERY IMPORTANT
   
req.session.isLoggedIn = true;
req.session.userId = user._id;

console.log("SESSION AFTER LOGIN:", req.session);
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Find user by session ID, exclude the password field
    const user = await require('../models/User').findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
