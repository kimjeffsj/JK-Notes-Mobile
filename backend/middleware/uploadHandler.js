const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const uploadDir = "uploads";
const thumbnailDir = path.join(uploadDir, "thumbnails");

[uploadDir, thumbnailDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create Thumbnail
const generateThumbnail = async (file) => {
  try {
    const thumbnailFilename = `thumb-${path.basename(file.filename)}`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    // Check exist
    if (!fs.existsSync(file.path)) {
      throw new Error(`Original file not found: ${file.path}`);
    }

    // Check sharp data
    const metadata = await sharp(file.path).metadata();

    await sharp(file.path)
      .resize(300, 300, {
        fit: "cover",
        position: "centre",
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return path.relative(process.cwd(), thumbnailPath).replace(/\\/g, "/");
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    throw error;
  }
};

// Processing Images
const processImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const processedImages = await Promise.all(
      req.files.map(async (file) => {
        try {
          const thumbnailPath = await generateThumbnail(file);
          const relativePath = path
            .relative(process.cwd(), file.path)
            .replace(/\\/g, "/");

          return {
            url: relativePath,
            thumbnail: thumbnailPath,
            createdAt: new Date(),
          };
        } catch (error) {
          console.error(`Error processing file ${file.filename}:`, error);
          throw error;
        }
      })
    );

    req.processedImages = processedImages;

    next();
  } catch (error) {
    console.error("Image processing error:", error);

    if (req.files) {
      req.files.forEach((file) => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          const thumbPath = path.join(
            thumbnailDir,
            `thumb-${path.basename(file.filename)}`
          );
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
          }
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      });
    }

    next(error);
  }
};

const serveUploads = express.static(uploadDir);

module.exports = {
  upload,
  processImages,
  serveUploads,
};
