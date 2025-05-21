import React, { useState } from 'react';
import { FaUser, FaRegComment, FaThumbsUp, FaReply, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Post({ post }) {
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setLikesCount(likesCount + 1);
      setLiked(true);
    } else if (res.status === 409) {
      setLiked(true);
      alert('You have already liked this post.');
    } else if (res.status === 401) {
      alert('You must be logged in to like posts.');
    } else {
      alert('Could not like post.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setCommentLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: commentContent }),
    });
    if (res.ok) {
      const commentsRes = await fetch(`/api/posts/${post.id}/comments`);
      const newComments = await commentsRes.json();
      setComments(newComments.comments);
      setCommentContent('');
    } else if (res.status === 401) {
      alert('You must be logged in to comment.');
    } else {
      alert('Could not add comment.');
    }
    setCommentLoading(false);
  };

  if (!post) return null;
  return (
    <div className="p-4 transition">
      <div className="flex items-center gap-2 mb-1">
        {post.avatar_url ? (
          <img
            src={post.avatar_url}
            alt="avatar"
            className="w-7 h-7 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <FaUser className="text-blue-700 text-sm" />
        )}
        {post.user_id ? (
          <Link
            to={`/user/${post.user_id}`}
            className="font-semibold text-blue-700 text-sm hover:underline"
          >
            @{post.username || 'user'}
          </Link>
        ) : (
          <span className="font-semibold text-blue-700 text-sm">@{post.username || 'user'}</span>
        )}
        <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
      </div>
      <div className="text-base font-medium mb-1">{post.title}</div>
      <div className="text-sm text-gray-700 mb-2">{post.content}</div>
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${liked
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
        >
          <FaThumbsUp /> {likesCount} {liked ? 'Liked' : 'Like'}
        </button>
      </div>
      <div>
        {comments && comments.length > 0 && (
          <ul className="space-y-1 mb-2">
            {comments.map((comment) => (
              <li key={comment.id} className="text-xs text-gray-600 flex items-center gap-1">
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
                  {comment.username ? comment.username : 'User'}:
                </span>{' '}
                {comment.content}
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2 items-end">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor={`comment-${post.id}`} className="text-sm font-semibold flex items-center gap-1">
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
              style={{ minHeight: '38px', height: '38px' }}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-green-600 transition flex items-center gap-1"
            disabled={commentLoading}
            style={{ height: '38px', minHeight: '38px' }}
          >
            <FaPaperPlane /> {commentLoading ? '...' : 'Reply'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;