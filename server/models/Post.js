const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, default: "" }, // ✅ EKLE
  likes: { type: Number, default: 0 },
  likedUsers: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
