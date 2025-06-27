import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      alert("Please login to access your profile.");
      navigate("/login");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/user/${user.username}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Kullanıcı postları alınamadı:", err);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ marginBottom: "10px" }}>👤 {user.username}'s Profile</h2>
      <h3 style={{ marginBottom: "30px" }}>📝 My Blog Posts</h3>

      {posts.length === 0 ? (
        <p>You haven't written any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              backgroundColor: "#f7f7f7",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <h4 style={{ marginBottom: "8px" }}>{post.title}</h4>
            <p><strong>Category:</strong> {post.category}</p>
            <p><strong>Created:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
            <div style={{ marginTop: "10px" }}>
              <Link to={`/posts/${post._id}`}>
                <button style={buttonStyle}>👁️ View</button>
              </Link>
              <Link to={`/edit/${post._id}`}>
                <button style={{ ...buttonStyle, marginLeft: "10px" }}>✏️ Edit</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Profile;
