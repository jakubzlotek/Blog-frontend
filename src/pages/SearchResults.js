import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PostList from "../components/PostList";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get("query") || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/posts/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-700">{query}</span>
      </h2>
      {loading ? (
        <div className="text-center my-8">Loading...</div>
      ) : posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <div className="text-center text-gray-400">No posts found.</div>
      )}
    </div>
  );
}