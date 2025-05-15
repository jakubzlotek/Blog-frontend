import React from 'react';

function PostList({ posts }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      {posts && posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-bold mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts found.</p>
      )}
    </div>
  );
}

export default PostList;