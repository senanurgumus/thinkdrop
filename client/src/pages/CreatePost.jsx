import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);         
  const [previewUrl, setPreviewUrl] = useState("");  // Önizleme için

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
      console.log("UPLOAD response:", res.data); // ✅
      imagePath = new URL(res.data.imageUrl).pathname;
    } catch (err) {
      console.error("Image upload failed:", err);
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

  console.log("NEW POST:", newPost); // ✅

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
    console.error("Error creating post:", err);
    alert("Failed to create post.");
  }
};


  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>📝 Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
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
          style={{ marginBottom: "10px" }}
        />

        {previewUrl && (
          <div style={{ marginBottom: "10px" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}

        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ ...inputStyle, height: "150px" }}
        />

        <button type="submit" style={buttonStyle}>
          ➕ Publish
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px"
};

export default CreatePost;
