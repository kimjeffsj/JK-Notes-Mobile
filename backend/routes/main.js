const express = require("express");
const router = express.Router();

// Middleware
const { isAuth } = require("../middleware/authHandler");
const { upload, processImages } = require("../middleware/uploadHandler");

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
  uploadImages,
  deleteImage,
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

// Images
router.post(
  "/notes/upload-images",
  isAuth,
  upload.array("images", 10),
  processImages,
  uploadImages
);
router.delete("/notes/:noteId/images/:imageId", isAuth, deleteImage);

// Profile
router.get("/profile", isAuth, (req, res) => {
  res.json({ user: req.user });
});
router.post("/profile/:_id", isAuth, updateProfile);

module.exports = router;
