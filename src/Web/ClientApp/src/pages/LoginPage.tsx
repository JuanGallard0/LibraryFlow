import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../components/api-authorization/AuthContext";
import { ErrorAlert } from "../components/ErrorAlert";
import { SuccessAlert } from "../components/SuccessAlert";
import logo from "../assets/logo.ico";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const locationState = state as {
    success?: string;
    returnUrl?: string;
  } | null;
  const success = locationState?.success;

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError("Correo o contraseña inválidos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center pt-8">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="LibraryFlow Logo" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Iniciar sesión
        </h2>
        {success && <SuccessAlert message={success} className="mb-4" />}
        {error && <ErrorAlert message={error} className="mb-4" />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
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
            disabled={submitting}
            className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          <p className="text-center text-sm text-stone-500 mt-4">
            ¿Sin cuenta?{" "}
            <Link
              className="text-amber-700 hover:underline font-medium"
              to="/register"
            >
              Registrarse
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
