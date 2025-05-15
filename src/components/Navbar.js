import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-4">
        <a href="/" className="font-bold text-lg hover:underline">Home</a>
        {user && (
          <a href="/profile" className="hover:underline">Profile</a>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <button
            onClick={onLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <a href="/login" className="hover:underline">Login</a>
            <a href="/register" className="hover:underline">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;