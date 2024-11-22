const Note = require("../models/noteSchema");
const path = require("path");
const fs = require("fs").promises;

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: image ID
 *         url:
 *           type: string
 *           description: image URL
 *         caption:
 *           type: string
 *           description: image caption
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: image uploads time
 */

/**
 * @swagger
 * /notes/{noteId}/images:
 *   post:
 *     summary: Uploading image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID to upload image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageData
 *             properties:
 *               imageData:
 *                 type: string
 *                 description: Image Date encoded with Base64 (data:image/... format)
 *               caption:
 *                 type: string
 *                 description: Image Caption(optional)
 *     responses:
 *       200:
 *         description: Image upload success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 image:
 *                   $ref: '#/components/schemas/Image'
 *       400:
 *         description: Wrong Request
 *       401:
 *         description: Authentication Error
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server Error
 */
const uploadImage = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { imageData, caption } = req.body;

    // Checking note and authentication
    const note = await Note.findOne({
      _id: noteId,
      creator: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Base64 image validation
    if (!imageData || !imageData.startsWith("data:image")) {
      return res.status(400).json({ message: "Invalid image" });
    }

    // Extract image data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Checking upload dir and create
    const uploadDir = path.join(__dirname, "../uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Image data processing
    const timestamp = Date.now();
    const filename = `${noteId}_${timestamp}${path.extname(caption || ".jpg")}`;
    const imagePath = path.join(uploadDir, filename);

    // Saving Image file
    await fs.writeFile(imagePath, buffer);

    // Saving Image url to DB
    const imageUrl = `/uploads/${filename}`;

    // Adding image info
    note.images.push({
      url: imageUrl,
      caption: caption || "",
    });

    await note.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      image: note.images[note.images.length - 1],
    });
  } catch (error) {
    console.error("Image upload Error: ", error);
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /notes/{noteId}/images/{imageId}:
 *   delete:
 *     summary: Delete image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: string
 *         required: true
 *         description: Note ID has the image
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: Image ID to delete
 *     responses:
 *       200:
 *         description: Image delete success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       401:
 *         description: Authentication Error
 *       404:
 *         description: Note or Image not found
 *       500:
 *         description: Server Error
 */
const deleteImage = async (req, res) => {
  try {
    const { noteId, imageId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      creator: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Searching Image
    const imageIndex = note.images.findIndex(
      (img) => img._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Deleting Image logic
    const imageUrl = note.images[imageIndex].url;
    const imagePath = path.join(__dirname, "..", imageUrl);

    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.warn("File delete warning", err);
    }

    // Delete Image info from note
    note.images.splice(imageIndex, 1);
    await note.save();

    res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image delete error: ", error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
