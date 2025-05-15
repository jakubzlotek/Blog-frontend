import React from 'react';

function Post({ post }) {
  if (!post) return null;
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}

export default Post;