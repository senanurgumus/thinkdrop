const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// ✅ Yeni yorum veya cevap ekleme
router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Belirli post'un yorumlarını getir (thread dahil)
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ Yorum beğen / beğeni kaldır
router.put("/:id/like", async (req, res) => {
  const { username } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found");

    if (comment.likedUsers.includes(username)) {
      comment.likedUsers = comment.likedUsers.filter((u) => u !== username);
      comment.likes = Math.max(comment.likes - 1, 0); // minimum 0
    } else {
      comment.likedUsers.push(username);
      comment.likes += 1;
    }

    await comment.save();
    res.status(200).json({
      likes: comment.likes,
      likedUsers: comment.likedUsers,
      _id: comment._id,
    });
  } catch (err) {
    console.error("Comment like error:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
