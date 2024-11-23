/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Note ID
 *         title:
 *           type: string
 *           description: Note title
 *         content:
 *           type: string
 *           description: Note content
 *         creator:
 *           type: string
 *           description: Note creator Id
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const Note = require("../models/noteSchema");

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch notes
 */
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

/**
 * @swagger
 * /notes/view/{_id}:
 *   get:
 *     summary: Get a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *       500:
 *         description: Failed to fetch note
 */
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

/**
 * @swagger
 * /notes/create:
 *   post:
 *     summary: Create a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Note title
 *               content:
 *                 type: string
 *                 description: Note content
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Please fill in all fields
 *       500:
 *         description: Failed to create note
 */
const createNote = async (req, res) => {
  try {
    const { title, content, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
        missingFields: {
          title: !title,
          content: !content,
        },
      });
    }

    // 이미지 데이터 검증
    let validatedImages = [];
    if (images && Array.isArray(images)) {
      validatedImages = images.map((image) => ({
        url: image.url,
        thumbnail: image.thumbnail,
        createdAt: new Date(image.createdAt),
      }));
    }

    const newNote = await Note.create({
      title,
      content,
      images: validatedImages,
      creator: req.user._id,
    });

    console.log("Created note:", newNote);

    res.status(201).json({
      message: "Note successfully created",
      note: newNote,
    });
  } catch (error) {
    console.error("Note creation error:", error);
    res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /notes/edit/{_id}:
 *   post:
 *     summary: Edit a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated note title
 *               content:
 *                 type: string
 *                 description: Updated note content
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note updated successfully
 *                 updatedNote:
 *                   $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found or not authorized to edit
 *       500:
 *         description: Failed to update note
 */
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

/**
 * @swagger
 * /notes/{_id}:
 *   delete:
 *     summary: Delete a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note deleted successfully
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found
 *       500:
 *         description: Failed to delete note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete note
 */
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

/**
 * @swagger
 * /notes/deleteAll:
 *   delete:
 *     summary: Delete all notes of authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notes deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All notes deleted successfully
 *                 deletedCount:
 *                   type: number
 *                   description: Number of notes deleted
 *                   example: 5
 *       500:
 *         description: Failed to delete all notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete all notes
 *                 error:
 *                   type: string
 */
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

// Upload Images
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("Uploaded files:", req.files); // 디버깅용

    const imageUrls = req.files.map((file) => ({
      url: `uploads/${file.filename}`, // 경로 수정
      thumbnail: `uploads/thumbnails/thumb-${file.filename}`, // 경로 수정
      createdAt: new Date(),
    }));

    console.log("Generated image URLs:", imageUrls); // 디버깅용

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { noteId, imageId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      creator: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const image = note.images.id(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete original file and thumbnail
    const filePaths = [
      path.join(__dirname, "..", image.url),
      path.join(__dirname, "..", image.thumbnail),
    ];

    filePaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Remove from note
    note.images.pull(imageId);
    await note.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  editNote,
  deleteNote,
  deleteAllNotes,
  uploadImages,
  deleteImage,
};
