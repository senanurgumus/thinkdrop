import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts${category ? `?category=${category}` : ""}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, [category]);

  const categories = ["technology", "health", "education", "travel"];

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📚 All Blog Posts</h2>

      {/* Kategori Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <label htmlFor="category">Filter by category: </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginLeft: "10px",
            fontSize: "16px"
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Post Kartları */}
      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "25px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              cursor: "pointer"
            }}
          >
            <Link to={`/posts/${post._id}`} style={{ textDecoration: "none", color: "#333" }}>
              <h3 style={{ marginBottom: "10px" }}>{post.title}</h3>
            </Link>
            <p style={{ margin: "6px 0" }}><strong>Category:</strong> {post.category}</p>
            <p style={{ margin: "6px 0" }}><strong>Author:</strong> {post.author}</p>
            <p style={{ marginTop: "12px", color: "#555" }}>{post.content.slice(0, 150)}...</p>
            <Link to={`/posts/${post._id}`}>
              <button style={{
                marginTop: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}>
                Read More
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default AllPosts;
