const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    parentId: { type: String, default: null }, // Nested reply desteği
    likes: { type: Number, default: 0 },
    likedUsers: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
