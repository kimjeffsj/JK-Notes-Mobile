const Note = require("../models/noteSchema");

// Get all notes
// GET /notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ creator: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};

// Get a single note
// GET /notes/:_id
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params._id,
      creator: req.user._id,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

// Create note
// POST /create
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const newNote = await Note.create({
      title,
      content,
      creator: req.user._id,
    });
    res
      .status(201)
      .json({ message: "Note successfully created", note: newNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create note", error: error.message });
  }
};

// Edit note
// POST /notes/:_id/edit
const editNote = async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: _id, creator: req.user._id },
      { title, content, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or you're not authorized to edit it",
      });
    }

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

// Delete note
// DELETE /notes/:_id
const deleteNote = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: _id,
      creator: req.user._id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete note" });
  }
};

// Delete All Notes
// DELETE /notes/delete-all
const deleteAllNotes = async (req, res) => {
  try {
    const result = await Note.deleteMany({ creator: req.user._id });

    res.status(200).json({
      message: "All notes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete all notes", error: error.message });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  editNote,
  deleteNote,
  deleteAllNotes,
};
