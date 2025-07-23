import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PostDetail.css"; // ✨ CSS dosyasını dahil ettik

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [likedByUser, setLikedByUser] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthor = user?.username === post?.author;

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
        const all = res.data;
        const parents = all.filter((c) => !c.parentId);
        const children = {};
        const liked = {};

        all.forEach((c) => {
          liked[c._id] = c.likedUsers?.includes(user?.username);
          if (c.parentId) {
            if (!children[c.parentId]) children[c.parentId] = [];
            children[c.parentId].push(c);
          }
        });

        setComments(parents);
        setReplies(children);
        setLikedComments(liked);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id, user?.username]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
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
        username: user?.username,
      });
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes,
        likedUsers: res.data.likedUsers,
      }));
      setLikedByUser(res.data.likedUsers.includes(user?.username));
    } catch (err) {
      console.error("Error liking/unliking post:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/comments/${commentId}/like`, {
      username: user?.username,
    });

    // Güncellenen yorum bilgisiyle comments dizisini güncelle
    setComments((prevComments) =>
      prevComments.map((c) =>
        c._id === commentId ? { ...c, likes: res.data.likes, likedUsers: res.data.likedUsers } : c
      )
    );
  } catch (err) {
    console.error("Comment like error:", err);
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

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    const text = replyInputs[parentId];
    if (!text?.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/comments", {
        postId: id,
        username: user?.username || "anonymous",
        text,
        parentId,
      });

      setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
      const updatedComments = res.data;
      const updatedParents = updatedComments.filter((c) => !c.parentId);
      const updatedReplies = {};
      updatedComments.forEach((c) => {
        if (c.parentId) {
          if (!updatedReplies[c.parentId]) updatedReplies[c.parentId] = [];
          updatedReplies[c.parentId].push(c);
        }
      });
      setComments(updatedParents);
      setReplies(updatedReplies);
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2>{post.title}</h2>
      <p><strong>📂 Category:</strong> {post.category}</p>
      <p><strong>✍️ Author:</strong> {post.author}</p>
      

      {post.image && (
        <div style={{ margin: "20px 0" }}>
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />
      <p style={{ fontSize: "1.1em", lineHeight: "1.6" }}>{post.content}</p>

      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        <button
          onClick={handleLike}
          style={{
            padding: "10px 20px",
            backgroundColor: likedByUser ? "#f44336" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {likedByUser ? "💔 Unlike" : "❤️ Like"}
        </button>
        <span style={{ marginLeft: "15px", fontWeight: "bold" }}>
          {post.likes || 0} likes
        </span>
      </div>

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

      <div style={{ marginTop: "40px" }}>
        <h3>💬 Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} style={{ background: "#f2f2f2", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <strong>{c.username}</strong>
              <p>{c.text}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleLikeComment(c._id)} style={{ border: "none", background: "none" }}>
                {c.likedUsers?.includes(user?.username) ? "💔" : "💖"} {c.likes || 0}
              </button>
                <button onClick={() => setReplyInputs(prev => ({ ...prev, [c._id]: prev[c._id] === undefined ? "" : undefined }))} style={{ border: "none", background: "transparent", cursor: "pointer" }}>💬 Reply</button>
              </div>
              {replyInputs[c._id] !== undefined && (
                <form onSubmit={(e) => handleReplySubmit(e, c._id)} style={{ marginTop: "10px" }}>
                  <textarea
                    value={replyInputs[c._id]}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [c._id]: e.target.value }))}
                    placeholder="Write a reply..."
                    style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
                  />
                  <button type="submit" style={{ marginTop: "5px", padding: "6px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}>Send</button>
                </form>
              )}
              {replies[c._id] && replies[c._id].map((r) => (
                <div key={r._id} style={{ background: "#e6e6e6", padding: "8px", marginTop: "8px", marginLeft: "20px", borderRadius: "5px" }}>
                  <strong>{r.username}</strong>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          ))
        )}
        <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: "100%", height: "100px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <button type="submit" style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "5px" }}>
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
  cursor: "pointer",
};

const deleteBtnStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default PostDetail;
