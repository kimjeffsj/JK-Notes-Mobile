const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    notes: { type: Number, default: 0, min: 0 },
    refreshToken: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.isRefreshTokenExpired = function () {
  return !this.refreshTokenExpiresAt || this.refreshTokenExpiresAt < new Date();
};

module.exports = model("User", userSchema);
