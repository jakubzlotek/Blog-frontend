import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import BackendOffline from "./components/BackendOffline";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import SearchResults from "./pages/SearchResults"; // Add this import

function App() {
  const [user, setUser] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  const onRegister = async (username, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit", // ← bez ciasteczek
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Błąd rejestracji");
    }
    return await res.json();
  };

  const onLogin = async (identifier, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Błąd logowania");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // Przy odświeżeniu: przywracamy usera z localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Co 10s sprawdzamy /api/health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("/api/health", { credentials: "omit" });
        if (!res.ok) throw new Error("Backend offline");
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!backendOnline) {
    return <BackendOffline />;
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register onRegister={onRegister} />} />
        <Route path="/search" element={<SearchResults />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;