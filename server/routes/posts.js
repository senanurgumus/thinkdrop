const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Yeni post oluşturma
router.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: req.body.author,
      image: req.body.image || "",
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Post oluşturulurken hata:", err);
    res.status(500).json(err);
  }
});

// Tüm postları getir - kategori ve başlık arama ile birlikte
router.get("/", async (req, res) => {
  const { category, search, limit = 100 } = req.query;

  const query = {};
  if (category) query.category = category.toLowerCase();
  if (search) query.title = { $regex: search, $options: "i" };

  try {
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.status(200).json(posts);
  } catch (err) {
    console.error("Postları getirirken hata:", err);
    res.status(500).json(err);
  }
});

// Tekil post getir
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found");
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post silme (sadece yazar silebilir)
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { username } = req.body;

    if (!post) return res.status(404).json("Post not found");
    if (post.author !== username)
      return res.status(403).json("Yetkisiz: Bu post'u sadece yazarı silebilir");

    await post.deleteOne();
    res.status(200).json("Post başarıyla silindi");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post güncelleme
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image || "",
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
});

// Like / Unlike
router.put("/:id/like", async (req, res) => {
  const { username } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likedUsers.includes(username)) {
      post.likes += 1;
      post.likedUsers.push(username);
    } else {
      post.likes -= 1;
      post.likedUsers = post.likedUsers.filter((u) => u !== username);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, likedUsers: post.likedUsers });
  } catch (err) {
    console.error("Like/unlike hatası:", err);
    res.status(500).json({ message: "Like/unlike error", error: err.message });
  }
});

// Belirli kullanıcının postları
router.get("/user/:username", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.username });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Kullanıcı postları alınamadı", error: err.message });
  }
});

module.exports = router;
