const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Upload Dir
const uploadDir = "uploads";
const thumbnailDir = "uploads/thumbnails";

// Create upload dir
[uploadDir, thumbnailDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

// Create thumbnail
const generateThumbnail = async (file) => {
  const thumbnailPath = path.join(
    thumbnailDir,
    `thumb-${path.basename(file.filename)}`
  );

  await sharp(file.path)
    .resize(300, 300, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);

  return thumbnailPath;
};

// Processing image info
const processImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const processedImages = await Promise.all(
      req.files.map(async (file) => {
        const thumbnailPath = await generateThumbnail(file);
        return {
          url: `${uploadDir}/${file.filename}`,
          thumbnail: thumbnailPath.replace(/\\/g, "/"),
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          createdAt: new Date(),
        };
      })
    );

    req.processedImages = processedImages;
    next();
  } catch (error) {
    req.files?.forEach((file) => {
      fs.unlinkSync(file.path);
      const thumbPath = path.join(thumbnailDir, `thumb-${file.filename}`);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    });

    next(error);
  }
};

module.exports = { upload, processImages };
