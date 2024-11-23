const express = require("express");
const router = express.Router();

// Middleware
const { isAuth } = require("../middleware/authHandler");

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
  deleteAllNotes,
} = require("../controllers/noteController");

// Auth
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Notes
router.get("/notes", isAuth, getAllNotes);
router.get("/notes/view/:_id", isAuth, getNote);
router.post("/notes/create", isAuth, createNote);
router.post("/notes/edit/:_id", isAuth, editNote);
router.delete("/notes/deleteAll", isAuth, deleteAllNotes);
router.delete("/notes/:_id", isAuth, deleteNote);

// Profile
router.get("/profile", isAuth, (req, res) => {
  res.json({ user: req.user });
});
router.post("/profile/:_id", isAuth, updateProfile);

module.exports = router;
