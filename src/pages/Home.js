import { useCallback, useEffect, useRef, useState } from "react";
import Ads from "../components/Ads";
import NewPostForm from "../components/NewPostForm";
import PostList from "../components/PostList";
import TemperatureWidget from "../components/TemperatureWidget";

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const [reloadFlag, setReloadFlag] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Relatywny URL – dzięki "proxy" trafi na http://localhost:3000/api/posts
      const res = await fetch(`/api/posts?page=${page}&limit=10`, {
        credentials: "omit",
      });
      if (!res.ok) throw new Error("fetch error");
      const data = await res.json();
      const postsArray = Array.isArray(data.posts) ? data.posts : [];
      setPosts((prev) => (page === 1 ? postsArray : [...prev, ...postsArray]));
      setHasMore(postsArray.length === 10);
    } catch (error) {
      setHasMore(false);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, reloadFlag]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handlePostCreated = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setReloadFlag((prev) => !prev);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar with ads on the left */}
      <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
        <Ads />
      </aside>
      {/* Main content */}
      <div className="flex-1 min-w-0 order-1 lg:order-2">
        <TemperatureWidget />
        {localStorage.getItem("token") && (
          <NewPostForm onPostCreated={handlePostCreated} />
        )}
        <PostList
          posts={posts}
          lastPostRef={lastPostRef}
          onDelete={handlePostDeleted}
        />
        {loading && <div className="text-center my-4">Loading...</div>}
        {!hasMore && !loading && (
          <div className="text-center my-4 text-gray-400">No more posts</div>
        )}
      </div>
    </div>
  );
}

export default Home;