import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-left">
  <h1>
    <span className="brand-name">ThinkDrop</span> ✍️
  </h1>

  <p className="tagline">
    A space where <span className="highlight">ideas bloom</span>, 
    <span className="highlight"> thoughts flow</span>, and 
    <span className="highlight"> you write freely</span> 🌿
  </p>

  <div className="feature-box">
    <p><span className="emoji">📝</span> Express yourself with blog posts</p>
    <p><span className="emoji">💡</span> Spark meaningful conversations</p>
    <p><span className="emoji">📚</span> Collect and revisit your favorites</p>
    <p><span className="emoji">🎨</span> Personalize your writing space</p>
  </div>

  <div className="home-buttons">
    <Link to="/register" className="start-btn">🚀 Get Started</Link>
    <Link to="/login" className="login-btn">🔑 Login</Link>
  </div>
</div>


      <div className="home-right">
<img src="/blog_hero.png" alt="ThinkDrop hero" />
      </div>
    </div>
  );
};

export default Home;