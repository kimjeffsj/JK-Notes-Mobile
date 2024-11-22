const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    set: function (content) {
      this.plainContent = content.replace(/<[^>]+>/g, "");
      return content;
    },
  },
  plainContent: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    // Simple HTML to text conversion
    this.plainContent = this.content.replace(/<[^>]*>/g, "");
  }
  next();
});

module.exports = mongoose.model("Note", noteSchema);
