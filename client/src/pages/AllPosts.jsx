import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PostSkeleton from "../components/PostSkeleton"; // ✅ yol doğruysa
import "./AllPosts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = ["technology", "health", "education", "travel"];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts?limit=100${
            category ? `&category=${category}` : ""
          }${searchTerm ? `&search=${searchTerm}` : ""}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, searchTerm]);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📚 All Blog Posts</h2>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginLeft: "10px",
            }}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="grid">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <PostSkeleton key={i} />
            ))}
        </div>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No posts found.</p>
      ) : (
        <div className="grid">
          {posts.map((post, i) => (
            <div
              key={post._id}
              className="post-card fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {post.image && (
                <img
                  src={`http://localhost:5000${post.image}`}
                  alt={post.title}
                  className="post-img"
                />
              )}
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-meta">
                  {post.author} | {post.category}
                </p>
                <p>{post.content.slice(0, 100)}...</p>
                <Link to={`/posts/${post._id}`}>
                  <button className="read-btn">📖 Read More</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
