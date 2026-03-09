import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../components/api-authorization/AuthContext";
import { ErrorAlert } from "../components/ErrorAlert";
import { SuccessAlert } from "../components/SuccessAlert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const success = (state as { success?: string })?.success;

  const handleSubmit = async () => {
    setError("");
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError("Correo o contraseña inválidos.");
    }
  };

  return (
    <div className="flex justify-center pt-8">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 2h11A1.5 1.5 0 0 1 19 3.5v17a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5v-17A1.5 1.5 0 0 1 6.5 2zM7 4v16h10V4H7zm2 2h6v2H9V6zm0 4h6v2H9v-2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Iniciar sesión</h2>
        {success && <SuccessAlert message={success} className="mb-4" />}
        {error && <ErrorAlert message={error} className="mb-4" />}
        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full border border-stone-300 rounded-md px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-400 hover:text-stone-600"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 font-medium transition-colors"
          >
            Iniciar sesión
          </button>
          <p className="text-center text-sm text-stone-500 mt-4">
            ¿Sin cuenta?{" "}
            <Link className="text-amber-700 hover:underline font-medium" to="/register">
              Registrarse
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
