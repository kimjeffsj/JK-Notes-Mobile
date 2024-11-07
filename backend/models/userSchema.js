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
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
