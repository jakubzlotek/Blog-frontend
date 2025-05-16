import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const user = localStorage.getItem('token');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/posts?page=${page}&limit=10`);
    const data = await res.json();
    // Fetch comments and likes for new posts
    const postsWithExtras = await Promise.all(
      data.map(async post => {
        const [commentsRes, likesRes] = await Promise.all([
          fetch(`/api/posts/${post.id}/comments`),
          fetch(`/api/posts/${post.id}/like`)
        ]);
        const comments = await commentsRes.json();
        const likes = await likesRes.json();
        return { ...post, comments, likesCount: likes.length };
      })
    );
    setPosts(prev => [...prev, ...postsWithExtras]);
    setHasMore(postsWithExtras.length === 10);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Infinite scroll observer
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset posts when a new post is created
  const handlePostCreated = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Home</h1>
      {user && (
        <NewPostForm onPostCreated={handlePostCreated} />
      )}
      <PostList posts={posts} lastPostRef={lastPostRef} />
      {loading && <div className="text-center my-4">Loading...</div>}
      {!hasMore && <div className="text-center my-4 text-gray-400">No more posts</div>}
    </div>
  );
}

export default Home;