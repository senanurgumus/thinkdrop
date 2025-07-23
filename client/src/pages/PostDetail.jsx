import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PostDetail.css";

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

      setComments((prev) =>
        prev.map((c) =>
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
    <div className="post-detail">
      <h2>{post.title}</h2>
      <p><strong>📂 Category:</strong> {post.category}</p>
      <p><strong>✍️ Author:</strong> {post.author}</p>
      {post.image && <img className="post-image" src={`http://localhost:5000${post.image}`} alt="Post" />}
      <hr />
      <p className="post-content">{post.content}</p>

      <button className={`like-btn ${likedByUser ? "liked" : ""}`} onClick={handleLike}>
        {likedByUser ? "💔 Unlike" : "❤️ Like"} {post.likes || 0}
      </button>

      {isAuthor && (
        <div className="author-controls">
          <Link to={`/edit/${post._id}`} className="edit-btn">✏️ Edit Post</Link>
          <button onClick={handleDelete} className="delete-btn">🗑️ Delete</button>
        </div>
      )}

      <div className="comments-section">
        <h3>💬 Comments</h3>
        {comments.length === 0 ? <p>No comments yet.</p> : (
          comments.map((c) => (
            <div key={c._id} className="comment-box">
              <strong>{c.username}</strong>
              <p>{c.text}</p>
              <div className="comment-actions">
                <button onClick={() => handleLikeComment(c._id)}>
                  {c.likedUsers?.includes(user?.username) ? "💔" : "💖"} {c.likes || 0}
                </button>
                <button onClick={() => setReplyInputs(prev => ({ ...prev, [c._id]: prev[c._id] === undefined ? "" : undefined }))}>
                  💬 Reply
                </button>
              </div>
              {replyInputs[c._id] !== undefined && (
                <form onSubmit={(e) => handleReplySubmit(e, c._id)} className="reply-form">
                  <textarea
                    value={replyInputs[c._id]}
                    onChange={(e) => setReplyInputs(prev => ({ ...prev, [c._id]: e.target.value }))}
                    placeholder="Write a reply..."
                  />
                  <button type="submit">Send</button>
                </form>
              )}
              {replies[c._id] && replies[c._id].map((r) => (
                <div key={r._id} className="reply-box">
                  <strong>{r.username}</strong>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          ))
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
