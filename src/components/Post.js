import React from 'react';

function Post({ post }) {
  if (!post) return null;
  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}

export default Post;