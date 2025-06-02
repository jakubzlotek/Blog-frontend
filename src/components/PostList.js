import Post from './Post';

function PostList({ posts, lastPostRef, onDelete }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-2">
      {safePosts.length > 0 ? (
        safePosts.map((post, idx) => {
          // Tworzymy key jako post.id-idx, by nigdy się nie powtórzył
          const uniqueKey = `${post.id}-${idx}`;
          return (
            <div
              key={uniqueKey}
              ref={idx === safePosts.length - 1 ? lastPostRef : null}
              className={idx !== safePosts.length - 1 ? 'mb-4' : ''}
            >
              <Post post={post} onDelete={onDelete} />
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 p-4 text-center">No posts found.</p>
      )}
    </div>
  );
}

export default PostList;