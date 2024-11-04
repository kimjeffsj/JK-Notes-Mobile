const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";

// Middleware
const isAuth = require("../middleware/authHandler");

// Controllers
const {
  login,
  loginUser,
  getRegister,
  registerUser,
  home,
  getProfile,
  updateProfile,
  logout,
} = require("../controllers/userController");
const {
  getAllNotes,
  getNote,
  getCreateNote,
  createNote,
  getEditNote,
  editNote,
  deleteNote,
} = require("../controllers/noteController");

// Routes
router.get("/", (req, res) => {
  res.render("index", { layout: mainLayout });
});

router.get("/login", login);
router.post("/login", loginUser);

router.get("/register", getRegister);
router.post("/register", registerUser);

router.get("/home", isAuth, home);

router.get("/notes", isAuth, getAllNotes);
router.get("/notes/:_id", isAuth, getNote);

router.get("/create", isAuth, getCreateNote);
router.post("/create", isAuth, createNote);

router.get("/notes/:_id/edit", isAuth, getEditNote);
router.post("/notes/:_id/edit", isAuth, editNote);

router.delete("/notes/:_id", isAuth, deleteNote);

router.get("/profile/:_id", isAuth, getProfile);
router.post("/profile/:_id", isAuth, updateProfile);

router.get("/logout", logout);

module.exports = router;
