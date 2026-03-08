import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./api-authorization/AuthContext";

function NavBarInner() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 block"
              to="/"
            >
              Books
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 block"
                  to="/admin/loans"
                >
                  Reservations
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 block"
                  to="/admin/loans/direct"
                >
                  Direct Loan
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              className="text-gray-700 hover:text-gray-900 bg-transparent border-0 cursor-pointer px-3 py-2"
              onClick={handleLogout}
            >
              Log out
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 block"
              to="/login"
            >
              Log in
            </Link>
          </li>
          <li>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 block"
              to="/register"
            >
              Register
            </Link>
          </li>
        </>
      )}
    </>
  );
}

export function Navbar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <header className="border-b shadow-sm mb-6">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          to="/"
          className="text-lg font-semibold text-gray-900 whitespace-nowrap"
        >
          LibraryFlow
        </Link>
        <button
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <ul
          className={`${collapsed ? "hidden" : "flex"} sm:flex flex-col sm:flex-row sm:items-center gap-1 absolute sm:static top-14 left-0 right-0 bg-white sm:bg-transparent p-4 sm:p-0 border-b sm:border-0 shadow-sm sm:shadow-none z-10`}
        >
          <NavBarInner />
        </ul>
      </nav>
    </header>
  );
}
