// src/components/PostSkeleton.js
import React from "react";
import "./PostSkeleton.css";

const PostSkeleton = () => {
  return (
    <div className="post-card skeleton-card">
      <div className="skeleton-img shimmer"></div>
      <div className="skeleton-text shimmer" style={{ width: "80%" }}></div>
      <div className="skeleton-text shimmer" style={{ width: "60%" }}></div>
      <div className="skeleton-text shimmer" style={{ width: "90%" }}></div>
      <div className="skeleton-btn shimmer"></div>
    </div>
  );
};

export default PostSkeleton;
