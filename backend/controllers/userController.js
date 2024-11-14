const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../middleware/authHandler");

// Register user
// POST /register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(422).json({ message: "Fill in required fields" });
    }

    const newEmail = email.toLowerCase().trim();

    const emailExists = await User.findOne({ email: newEmail });

    if (emailExists) {
      return res
        .status(409)
        .json({ message: "Email already exists, choose other email please" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(422).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: newEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: `New user ${newUser.email} registered successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", {
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "User registration failed", error: error.message });
  }
};

// Login user
// POST /login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update profile
// POST /profile/:_id
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    const userId = req.params._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current Password is invalid" });
    }

    // Name update
    if (name && name !== user.name) {
      user.name = name;
    }

    // Email update
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });

      if (emailExists) {
        return res.status(409).json({
          message: "Email is already in use. Please choose a different one.",
        });
      }
      user.email = email.toLowerCase();
    }

    // New password update
    if (newPassword) {
      if (newPassword.trim().length < 6) {
        return res
          .status(422)
          .json({ message: "Password must be at least 6 characters" });
      }
      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Save updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

// Logout user
// GET /logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        {
          $set: {
            refreshToken: null,
            refreshTokenExpiresAt: null,
          },
        }
      );
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// POST /refresh-token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const userId = await verifyRefreshToken(refreshToken);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(userId);

    const user = await User.findById(userId);
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Data(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "Invalid refresh token") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    res.status(500).json({ message: "Failed to refresh token" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  updateProfile,
  logout,
  refreshToken,
};
