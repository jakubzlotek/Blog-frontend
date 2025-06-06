import { useEffect, useState } from "react";
import {
  FaPaperPlane,
  FaRegComment,
  FaReply,
  FaThumbsUp,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Add this import at the top with other imports
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { authFetch } from '../api/authFetch';

function Post({ post, onDelete }) {
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [comments, setComments] = useState(
    Array.isArray(post.comments) ? post.comments : []
  );
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    setLikesCount(post.likesCount || 0);
    // Use likedUserIds if available
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const liked = Array.isArray(post.likedUserIds)
      ? post.likedUserIds.includes(currentUser.id)
      : post.likedByCurrentUser || false;
    setLiked(liked);
    setComments(Array.isArray(post.comments) ? post.comments : []);
  }, [post]);

  const handleLike = async () => {
    if (liked) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to like posts.");
      return;
    }
    try {
      const res = await authFetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
      });
      if (res.ok) {
        setLikesCount((prev) => prev + 1);
        setLiked(true);
        toast.success('Post liked!');
      } else if (res.status === 409) {
        setLiked(true);
      } else if (res.status === 401) {
        toast.error("You must be logged in to like posts.");
      } else {
        toast.error("Could not like post.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to comment.");
      return;
    }
    setCommentLoading(true);
    try {
      const res = await authFetch(`/api/posts/${post.id}/comments`, { // ← use authFetch
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
        body: JSON.stringify({ content: commentContent }),
      });
      if (res.ok) {
        const commentsRes = await fetch(`/api/posts/${post.id}/comments`, {
          credentials: "omit",
        });
        if (commentsRes.ok) {
          const newCommentsData = await commentsRes.json();
          setComments(
            Array.isArray(newCommentsData.comments)
              ? newCommentsData.comments
              : []
          );
        }
        setCommentContent("");
        toast.success("Comment added!");
      } else if (res.status === 401) {
        toast.error("You must be logged in to comment.");
      } else {
        toast.error("Could not add comment.");
      }
    } catch {
      toast.error("Network error.");
    }
    setCommentLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?"))
      return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete your post.");
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await authFetch(`/api/posts/${post.id}`, { // ← use authFetch
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "omit",
      });
      if (res.ok) {
        toast.success("Post deleted!");
        onDelete && onDelete(post.id);
      } else if (res.status === 403) {
        toast.error("You are not allowed to delete this post.");
      } else {
        toast.error("Could not delete post.");
      }
    } catch {
      toast.error("Network error.");
    }
    setDeleteLoading(false);
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwnPost = currentUser && currentUser.id && currentUser.id === post.user_id;

  if (!post) return null;
  return (
    <div className="p-4 transition border-b border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="avatar"
              className="w-7 h-7 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <FaUser className="text-blue-700 text-sm" />
          )}
          <Link
            to={`/user/${post.user_id}`}
            className="font-semibold text-blue-700 text-sm hover:underline"
          >
            {post.username || "user"}
          </Link>
          <span className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </div>
        {isOwnPost && (
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600 hover:text-red-800 transition text-sm"
            title="Delete post"
          >
            <FaTrashAlt />
          </button>
        )}
      </div>
      <Link
        to={`/posts/${post.id}`}
        className="block text-xl font-bold text-blue-800 hover:underline mb-1 transition"
        title={post.title}
      >
        {post.title}
      </Link>
      <div className="text-sm text-gray-700 mb-2">{post.content}</div>
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
            liked
              ? "bg-green-100 text-green-700 border border-green-400 cursor-not-allowed"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          <FaThumbsUp /> {likesCount} {liked ? "Liked" : "Like"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title + ' - ' + post.content)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gray-900 transition flex items-center gap-2"
        >
          <FaXTwitter className="text-lg" />
          Share on X
        </a>
      </div>
      <div>
        {comments && comments.length > 0 && (
          <ul className="space-y-1 mb-2">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="text-xs text-gray-600 flex items-center gap-1"
              >
                {comment.avatar_url ? (
                  <img
                    src={comment.avatar_url}
                    alt="avatar"
                    className="w-5 h-5 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <FaRegComment className="text-green-600" />
                )}
                <span className="font-semibold text-blue-700">
                  {comment.username || "User"}:
                </span>{" "}
                {comment.content}
              </li>
            ))}
          </ul>
        )}
                      <button
          onClick={() => setShowCommentBox((prev) => !prev)}
          className=" text-gray-700 py-1 px-1 rounded text-xs font-semibold hover:bg-gray-300 transition"
        >
          {showCommentBox ? "Click to abort reply" : "Click to post your reply"}
        </button>
        {showCommentBox && (
          <form
            onSubmit={handleCommentSubmit}
            className="flex gap-2 mt-2 items-end"
          >
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor={`comment-${post.id}`}
                className="text-sm font-semibold flex items-center gap-1"
              >
                <FaReply /> Add a comment
              </label>
              <input
                id={`comment-${post.id}`}
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition w-full"
                disabled={commentLoading}
                style={{ minHeight: "38px", height: "38px" }}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-green-600 transition flex items-center gap-1"
              disabled={commentLoading}
              style={{ height: "38px", minHeight: "38px" }}
            >
              <FaPaperPlane /> {commentLoading ? "..." : "Reply"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;