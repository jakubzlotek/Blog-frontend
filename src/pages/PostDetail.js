import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data.post));
  }, [id]);


  if (!post) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.content}</p>
      <div className="mb-2 text-sm text-blue-700 font-semibold">Likes: {post.likesCount || 0}</div>
      <div>
        <h3 className="font-bold mb-1">Comments:</h3>
        {post.comments && post.comments.length > 0 ? (
          <ul className="space-y-1">
            {post.comments.map((comment) => (
              <li key={comment.id} className="text-xs text-gray-600 flex items-center gap-1">
                {comment.username ? <span className="font-semibold text-blue-700">{comment.username}:</span> : null} {comment.content}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-400">No comments yet.</div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;