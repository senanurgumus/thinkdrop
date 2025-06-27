import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedByUser, setLikedByUser] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
        setLikedByUser(res.data.likedUsers?.includes(user?.username));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id, user?.username]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      alert("Post deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred while deleting the post.");
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${id}/like`, {
        username: user?.username
      });
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes,
        likedUsers: res.data.likedUsers
      }));
      setLikedByUser(res.data.likedUsers.includes(user?.username));
    } catch (err) {
      console.error("Error liking/unliking post:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/comments", {
        postId: id,
        username: user?.username || "anonymous",
        text: newComment,
      });

      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const isAuthor = user?.username === post.author;

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ marginBottom: "10px" }}>{post.title}</h2>
      <p><strong>📂 Category:</strong> {post.category}</p>
      <p><strong>✍️ Author:</strong> {post.author}</p>
      <hr style={{ margin: "20px 0" }} />
      <p style={{ fontSize: "1.1em", lineHeight: "1.6" }}>{post.content}</p>

      {/* Like Bölümü */}
      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        <button
          onClick={handleLike}
          style={{
            padding: "10px 20px",
            backgroundColor: likedByUser ? "#f44336" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {likedByUser ? "💔 Unlike" : "❤️ Like"}
        </button>
        <span style={{ marginLeft: "15px", fontWeight: "bold" }}>
          {post.likes || 0} likes
        </span>
      </div>

      {/* Edit/Delete - Author'a özel */}
      {isAuthor && (
        <div style={{ marginBottom: "30px" }}>
          <Link to={`/edit/${post._id}`}>
            <button style={editBtnStyle}>✏️ Edit Post</button>
          </Link>
          <button onClick={handleDelete} style={deleteBtnStyle}>
            🗑️ Delete Post
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ marginTop: "40px" }}>
        <h3>💬 Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              style={{
                background: "#f2f2f2",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px"
              }}
            >
              <strong>{c.username}</strong>
              <p>{c.text}</p>
            </div>
          ))
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

const editBtnStyle = {
  backgroundColor: "#FFA500",
  color: "white",
  padding: "10px 20px",
  marginRight: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteBtnStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default PostDetail;
