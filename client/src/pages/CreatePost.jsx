import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css"; // 🎨 Yeni stil dosyası

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    let imagePath = "";

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const res = await axios.post("http://localhost:5000/api/upload", formData);
        imagePath = new URL(res.data.imageUrl).pathname;
      } catch (err) {
        alert("Image upload failed.");
        return;
      }
    }

    const newPost = {
      title,
      category,
      content,
      author: user.username,
      image: imagePath,
    };

    try {
      await axios.post("http://localhost:5000/api/posts", newPost);
      alert("Post created successfully!");
      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);
      setPreviewUrl("");
      navigate("/");
    } catch (err) {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="create-post-container">
      <h2>📝 Create New Blog Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="travel">Travel</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            if (file) setPreviewUrl(URL.createObjectURL(file));
          }}
        />

        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">➕ Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
