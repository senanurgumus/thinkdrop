const mongoose = require("mongoose");

// models/Post.js

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    category: String,
    author: String,
    likes: {
      type: Number,
      default: 0
    },
    likedUsers: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

