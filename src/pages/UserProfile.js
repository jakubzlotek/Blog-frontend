import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import Post from '../components/Post';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Get current user id from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCurrentUser = currentUser && currentUser.id && String(currentUser.id) === id;

  useEffect(() => {
    async function fetchUserAndPosts() {
      setLoading(true);
      const userRes = await fetch(`/api/user/${id}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        setForm({ username: userData.user.username, email: userData.user.email, password: '' });
      }
      const postsRes = await fetch(`/api/posts?user_id=${id}`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        // postsData.posts already includes comments and likesCount
        setPosts(Array.isArray(postsData.posts) ? postsData.posts.filter(p => p.user_id === Number(id)) : []);
      }
      setLoading(false);
    }
    fetchUserAndPosts();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setForm({ username: user.username, email: user.email, password: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/user/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
    } else {
      alert('Could not update profile');
    }
    setEditLoading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/user/me/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setUser(prev => {
        const updatedUser = { ...prev, avatar_url: data.avatar_url };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } else {
      alert('Could not upload avatar');
    }
    setAvatarUploading(false);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded shadow p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-700 border border-gray-300">
              <FaUser />
            </div>
          )}
          {isCurrentUser && (
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer border border-gray-200">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                disabled={avatarUploading}
              />
            </label>
          )}
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          @{user.username}
        </h2>
      </div>
      {isCurrentUser && editing ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block font-semibold mb-1 flex items-center gap-1">
              <FaUser /> Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 flex items-center gap-1">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
              disabled={editLoading}
            >
              <FaSave /> {editLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition flex items-center gap-2"
              onClick={handleCancel}
              disabled={editLoading}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mb-2 flex items-center gap-2">
            <FaUser className="text-blue-700" />
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <p className="mb-4 flex items-center gap-2">
            <FaEnvelope className="text-blue-700" />
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          {isCurrentUser && (
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2 mb-6"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </>
      )}
      <h3 className="text-xl font-semibold mb-2">Posts by {user.username}:</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="mb-4">
            <Post post={post} />
          </div>
        ))
      )}
    </div>
  );
}

export default UserProfile;