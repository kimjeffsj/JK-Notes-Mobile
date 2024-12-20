const Note = require("../models/noteSchema");
const path = require("path");
const fs = require("fs");

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Image ID
 *         url:
 *           type: string
 *           description: Image URL path
 *         thumbnail:
 *           type: string
 *           description: Thumbnail URL path
 *         createdAt:
 *           type: string
 *           format: date-time
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
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Image'
 *           description: Array of attached images
 *         creator:
 *           type: string
 *           description: Note creator ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

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

    let validatedImages = [];
    if (images && Array.isArray(images)) {
      validatedImages = images.map((image) => ({
        url: image.url,
        thumbnail: image.thumbnail,
        createdAt: new Date(image.createdAt),
      }));
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: _id, creator: req.user._id },
      {
        title,
        content,
        images: validatedImages,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or you're not authorized to edit it",
      });
    }

    res.status(200).json({
      message: "Note updated successfully",
      updatedNote,
    });
  } catch (error) {
    console.error("Edit note error:", error);
    res.status(500).json({
      message: "Failed to update note",
      error: error.message,
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

/**
 * @swagger
 * /notes/upload-images:
 *   post:
 *     summary: Upload images for a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple image files
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Images uploaded successfully
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Failed to upload images
 */
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => ({
      url: `uploads/${file.filename}`,
      thumbnail: `uploads/thumbnails/thumb-${file.filename}`,
      createdAt: new Date(),
    }));

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

/**
 *  @swagger
 * /notes/{noteId}/images/{imageId}:
 *   delete:
 *     summary: Delete an image from a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note containing the image
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the image to delete
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *                 noteId:
 *                   type: string
 *                   description: ID of the note
 *                 imageId:
 *                   type: string
 *                   description: ID of the deleted image
 *       404:
 *         description: Note or image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note not found or Image not found
 *       500:
 *         description: Failed to delete image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete image
 *                 error:
 *                   type: string
 */
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

    const imageToDelete = note.images.find(
      (img) => img._id.toString() === imageId
    );
    if (!imageToDelete) {
      console.log("Image not found:", imageId);
      return res.status(404).json({ message: "Image not found" });
    }

    try {
      // Delete original image
      const originalPath = path.join(__dirname, "..", imageToDelete.url);

      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      // Delete thumbnail image
      const thumbnailPath = path.join(__dirname, "..", imageToDelete.thumbnail);

      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    } catch (error) {
      console.error("File deletion error:", error);
    }

    note.images = note.images.filter((img) => img._id.toString() !== imageId);
    await note.save();

    res.status(200).json({
      message: "Image deleted successfully",
      noteId,
      imageId,
    });
  } catch (error) {
    console.error("Delete image error:", error);
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
