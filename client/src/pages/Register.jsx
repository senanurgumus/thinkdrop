import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Kayıt başarılı!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src="/logo-thinkdrop.png" alt="ThinkDrop Logo" className="logo" />
        <h2 className="register-title">Create your ThinkDrop account ✨</h2>
        <p className="register-subtext">Join our creative blogging world 💭</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span>👤</span>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span>📧</span>
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <span>🔒</span>
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p className="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
