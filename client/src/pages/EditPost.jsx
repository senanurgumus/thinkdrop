import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditPost.css"; // Yeni CSS dosyasını eklemeyi unutma ✨

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    category: "",
    content: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost({
          title: res.data.title,
          category: res.data.category,
          content: res.data.content
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, post);
      alert("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;

  return (
    <div className="edit-container">
      <h2 className="edit-title">✏️ Edit Your Post</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
          placeholder="Post Title"
          className="edit-input"
        />
        <input
          type="text"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
          placeholder="Category (e.g., Technology)"
          className="edit-input"
        />
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          required
          placeholder="Edit your content here..."
          className="edit-textarea"
        />
        <button type="submit" className="edit-button">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
