import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './pages/UserProfile';
import './App.css';
import TemperatureWidget from './components/TemperatureWidget';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Not authenticated');
          return res.json();
        })
        .then(profile => {
          setUser(profile.user);
          localStorage.setItem('user', JSON.stringify(profile.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        });
    }
  }, []);

  const handleLogin = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${data.token}` }
      })
        .then(res => res.json())
        .then(profile => {
          setUser(profile.user);
          localStorage.setItem('user', JSON.stringify(profile.user));
        });
    } else {
      alert('Login failed');
    }
  };

  const handleRegister = async (username, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (res.ok) {
      alert('Registration successful! Please log in.');
    } else {
      alert('Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

   return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

     {/* tu widget */}
      <div className="mx-auto max-w-4xl p-4">
        <TemperatureWidget />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
      </Routes>
    </Router>
  );
}

export default App;