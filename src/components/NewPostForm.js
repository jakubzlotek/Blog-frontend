import { useState } from 'react';
import { FaPaperPlane, FaPen } from 'react-icons/fa';

function NewPostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      onPostCreated && onPostCreated();
    } else if (res.status === 401) {
      alert('You must be logged in to add posts.');
    } else {
      alert('Could not add post.');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-lg p-6 flex flex-col gap-4"
    >
      <div>
        <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
          <FaPen /> Create a New Post
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Share your thoughts with the community.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="post-title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-base bg-white"
        />
      </div>
      <div className="flex items-start gap-2">
        <textarea
          id="post-content"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-base bg-white resize-none"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="self-end bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <FaPaperPlane /> {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}

export default NewPostForm;