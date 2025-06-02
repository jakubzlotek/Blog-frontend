import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="font-bold text-2xl text-blue-700 hover:text-blue-900 transition flex items-center gap-2"
          >
            <FaHome className="inline" /> Blog
          </a>
          {user && (
            <a
              href={`/user/${user.id}`}
              className="text-gray-700 hover:text-blue-700 transition flex items-center gap-1"
            >
              <FaUser className="inline" /> {user.username}
            </a>
          )}
        </div>
        <div className="flex items-center space-x-4">
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
      </div>
    </nav>
  );
}

export default Navbar;