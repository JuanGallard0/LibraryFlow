import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./api-authorization/AuthContext";
import logo from "../assets/logo.ico";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-slate-700 text-white rounded-md px-3 py-2 block transition-colors"
    : "text-slate-200 hover:bg-slate-700 hover:text-white rounded-md px-3 py-2 block transition-colors";

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
            <NavLink className={navLinkClass} to="/" end>
              Libros
            </NavLink>
          </li>
          {!isAdmin && (
            <>
              <li>
                <NavLink className={navLinkClass} to="/loans">
                  Mis Préstamos
                </NavLink>
              </li>
              <li>
                <NavLink className={navLinkClass} to="/reservations">
                  Mis Reservaciones
                </NavLink>
              </li>
            </>
          )}
          {isAdmin && (
            <>
              <li>
                <NavLink className={navLinkClass} to="/admin/loans" end>
                  Préstamos
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={navLinkClass}
                  to="/admin/loans/reservations"
                >
                  Prestar Libro
                </NavLink>
              </li>
            </>
          )}
          <li>
            <button
              className="text-slate-200 hover:bg-slate-700 hover:text-white bg-transparent border-0 cursor-pointer rounded-md px-3 py-2 transition-colors"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink className={navLinkClass} to="/login">
              Iniciar sesión
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/register">
              Registrarse
            </NavLink>
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
          <img src={logo} alt="LibraryFlow Logo" className="w-5 h-5" />
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
