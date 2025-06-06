import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { apiFetch } from "../api/apiClient"; // add this import

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    apiFetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post));
  }, [id]);

  if (!post) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Post post={post} />
    </div>
  );
}

export default PostDetail;