import React from 'react';
import Post from './Post';

function PostList({ posts, lastPostRef }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-2">
      {safePosts.length > 0 ? (
        safePosts.map((post, idx) => (
          <div
            key={post.id}
            ref={idx === safePosts.length - 1 ? lastPostRef : null}
            className={idx !== safePosts.length - 1 ? 'mb-4' : ''}
          >
            <Post post={post} />
          </div>
        ))
      ) : (
        <p className="text-gray-500 p-4 text-center">No posts found.</p>
      )}
    </div>
  );
}

export default PostList;