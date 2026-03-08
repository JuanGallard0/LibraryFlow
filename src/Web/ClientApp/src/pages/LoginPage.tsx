import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/api-authorization/AuthContext";
import { ErrorAlert } from "../components/ErrorAlert";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex justify-center">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
        {error && <ErrorAlert message={error} className="mb-4" />}
        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Iniciar sesión
            </button>
            <Link className="text-blue-600 hover:underline" to="/register">
              Registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
