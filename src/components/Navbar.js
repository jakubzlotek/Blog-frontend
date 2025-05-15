import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav>
      <a href="/">Home</a>
      {user ? (
        <>
          <a href="/profile">Profile</a>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </>
      )}
    </nav>
  );
}

export default Navbar;