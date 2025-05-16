import React from 'react';
import Post from './Post';

function PostList({ posts, lastPostRef }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-2">
      {posts && posts.length > 0 ? (
        posts.map((post, idx) => (
          <div
            key={post.id}
            ref={idx === posts.length - 1 ? lastPostRef : null}
            className={idx !== posts.length - 1 ? 'mb-4' : ''}
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