import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  if (!post) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
}

export default PostDetail;