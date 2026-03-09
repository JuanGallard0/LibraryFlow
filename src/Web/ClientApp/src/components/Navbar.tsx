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
              className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
              to="/"
            >
              Libros
            </Link>
          </li>
          {!isAdmin && (
            <>
              <li>
                <Link
                  className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
                  to="/loans"
                >
                  Mis Préstamos
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
                  to="/reservations"
                >
                  Mis Reservaciones
                </Link>
              </li>
            </>
          )}
          {isAdmin && (
            <>
              <li>
                <Link
                  className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
                  to="/admin/loans"
                >
                  Préstamos
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
                  to="/admin/loans/reservations"
                >
                  Reservaciones
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
                  to="/admin/loans/direct"
                >
                  Préstamo Directo
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              className="text-slate-200 hover:text-white bg-transparent border-0 cursor-pointer px-3 py-2 transition-colors"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </li>
          <li>
            <Link
              className="text-slate-200 hover:text-white px-3 py-2 block transition-colors"
              to="/register"
            >
              Registrarse
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
    <header className="bg-slate-800 shadow-md mb-0">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          to="/"
          className="text-lg font-bold text-amber-400 tracking-wide whitespace-nowrap flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6.5 2h11A1.5 1.5 0 0 1 19 3.5v17a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2zM7 4v16h10V4H7zm2 2h6v2H9V6zm0 4h6v2H9v-2z"/>
          </svg>
          LibraryFlow
        </Link>
        <button
          className="sm:hidden p-2 text-slate-300 hover:text-white"
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
          className={`${collapsed ? "hidden" : "flex"} sm:flex flex-col sm:flex-row sm:items-center gap-1 absolute sm:static top-14 left-0 right-0 bg-slate-800 sm:bg-transparent p-4 sm:p-0 border-b border-slate-700 sm:border-0 shadow-md sm:shadow-none z-10`}
        >
          <NavBarInner />
        </ul>
      </nav>
    </header>
  );
}
