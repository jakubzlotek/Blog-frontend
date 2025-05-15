import React, { useEffect, useState } from 'react';
import PostList from '../components/PostList';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Home</h1>
      <PostList posts={posts} />
    </div>
  );
}

export default Home;