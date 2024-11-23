const notFound = (req, res, next) => {
  return res.status(404).json({ message: "API endpoint not found" });
};
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "JsonWEbTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  return res.status(500).json({ message: "Something went wrong" });
};

const handleImageUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      message: err.message,
    });
  }
  next(err);
};

module.exports = { notFound, globalErrorHandler, handleImageUploadError };
