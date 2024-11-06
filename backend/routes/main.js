const express = require("express");
const router = express.Router();

// Middleware
const isAuth = require("../middleware/authHandler");

// Controllers
const {
  loginUser,
  registerUser,
  updateProfile,
  logout,
  refreshToken,
} = require("../controllers/userController");

const {
  getAllNotes,
  getNote,
  createNote,
  editNote,
  deleteNote,
} = require("../controllers/noteController");

// Auth
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Notes
router.get("notes", isAUth, getAllNotes);
router.get("/notes/:_id", isAuth, getNote);
router.get("/notes", isAuth, createNote);
router.post("/notes/:_id", isAuth, editNote);
router.delete("/notes/:_id", isAuth, deleteNote);

// Profile
router.get("/profile", isAuth, (req, res) => {
  res.json({ user: req.user });
});
router.post("/profiled/:_id", isAuth, updateProfile);

module.exports = router;
