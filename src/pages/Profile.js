import React, { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p className="mb-2"><span className="font-semibold">Username:</span> {profile.username}</p>
      <p><span className="font-semibold">Email:</span> {profile.email}</p>
    </div>
  );
}

export default Profile;