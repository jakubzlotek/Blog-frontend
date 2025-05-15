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
    <div>
      <h1>Blog Home</h1>
      <PostList posts={posts} />
    </div>
  );
}

export default Home;