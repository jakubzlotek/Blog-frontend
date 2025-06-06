import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { getAvatarUrl } from '../api/apliClient';

function Navbar({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="font-bold text-2xl text-blue-700 hover:text-blue-900 transition flex items-center gap-2"
          >
           🦒 SuperBlog
          </a>
          {/* Desktop links */}
        </div>
        {/* Search bar - hidden on mobile */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-stretch mx-4 flex-1 max-w-xs"
        >
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-200 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </form>
        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <a
                href={`/user/${user.id}`}
                className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
              >
                {user.avatar_url ? (
                  <img
                    src={getAvatarUrl(user.avatar_url)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-blue-200"
                  />
                ) : (
                  <FaUser className="inline" />
                )}{" "}
                {user.username}
              </a>
            )}
          </div>
          {user ? (
            <button
              onClick={onLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
              >
                <FaSignInAlt /> Login
              </a>
              <a
                href="/register"
                className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
              >
                <FaUserPlus /> Register
              </a>
            </>
          )}
        </div>
        {/* Hamburger menu button on mobile */}
        <button
          className="md:hidden text-2xl text-blue-700 focus:outline-none ml-2"
          onClick={handleMenuToggle}
          aria-label="Open menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 pb-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-stretch my-2"
          >
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-blue-200 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700 transition"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
          <div className="flex flex-col space-y-2 mt-2">
            {user && (
              <a
                href={`/user/${user.id}`}
                className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
                onClick={() => setMenuOpen(false)}
              >
                {user.avatar_url ? (
                  <img
                    src={getAvatarUrl(user.avatar_url)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-blue-200"
                  />
                ) : (
                  <FaUser className="inline" />
                )}{" "}
                {user.username}
              </a>
            )}
            {user ? (
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaSignInAlt /> Login
                </a>
                <a
                  href="/register"
                  className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUserPlus /> Register
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;