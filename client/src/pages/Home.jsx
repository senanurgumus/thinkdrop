// src/pages/Home.jsx
import React from "react";

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🏠 Home</h1>
        <p>You are logged in.</p>
        <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
