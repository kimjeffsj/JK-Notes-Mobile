const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  return { accessToken, refreshToken };
};

async function isAuth(req, res, next) {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = tokenHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = {
        _id: decoded.id,
      };

      next();
    } catch (error) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token Expired",
          code: "TOKEN_EXPIRED",
        });
      }
      throw err;
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
}

module.exports = { isAuth, generateTokens };
