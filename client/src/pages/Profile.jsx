import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css"; // CSS dosyasını eklemeyi unutma 🪄

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
    <div className="profile-container">
      <h2 className="profile-title">👤 {user.username}'s Profile</h2>
      <h3 className="profile-subtitle">📝 My Blog Posts</h3>

      {posts.length === 0 ? (
        <p className="profile-empty">You haven't written any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div className="profile-post-card" key={post._id}>
            <h4 className="profile-post-title">{post.title}</h4>
            <p><strong>Category:</strong> {post.category}</p>
            <p><strong>Created:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
            <div className="profile-buttons">
              <Link to={`/posts/${post._id}`}>
                <button className="profile-btn view">👁️ View</button>
              </Link>
              <Link to={`/edit/${post._id}`}>
                <button className="profile-btn edit">✏️ Edit</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
