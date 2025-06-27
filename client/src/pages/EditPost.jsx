import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>✏️ Edit Your Post</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
          placeholder="Post Title"
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
          placeholder="Category (e.g., Technology)"
          style={styles.input}
        />
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          required
          placeholder="Edit your content here..."
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px"
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default EditPost;
