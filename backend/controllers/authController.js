import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: "Please provide all required fields",
        fields: { username, email, password: password ? "provided" : "missing" }
      });
    }

    console.log("Attempting to create user:", { username, email });

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    
    if (user) {
      console.log("User created successfully:", user._id);
      res.status(201).json({
        message: "User created successfully",
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } else {
      console.log("Invalid user data");
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Server error during signup:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
};
// ... existing imports and code ...

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ... existing code ...
// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: { id: user._id, username: user.username, email: user.email },
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
