import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // 💅 CSS import edildi

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo-thinkdrop.png"
            alt="ThinkDrop"
            className="logo-image"
          />
        </Link>
      </div>
      <div className="nav-items">
        <Link to="/all" className="nav-link">All Posts</Link>
        <Link to="/gallery" className="nav-link">Gallery</Link> {/* 💖 Yeni eklendi */}
        <Link to="/create" className="nav-link">Create Post</Link>
        {user && <Link to="/profile" className="nav-link">My Profile</Link>}
        {user ? (
          <button onClick={handleLogout} className="nav-button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
