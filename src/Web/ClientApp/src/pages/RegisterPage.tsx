import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/api-authorization/AuthContext";
import { ErrorAlert } from "../components/ErrorAlert";
import logo from "../assets/logo.ico";

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await register(firstName, lastName, email, password);
      navigate("/login", {
        state: { success: "Cuenta creada. Por favor inicia sesión." },
      });
    } catch (err) {
      console.error("Failed to register:", err);
      setError("Error al registrarse. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="flex justify-center pt-8">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="LibraryFlow Logo" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Registrarse
        </h2>
        {error && <ErrorAlert message={error} className="mb-4" />}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
            Registrarse
          </button>
          <p className="text-center text-sm text-stone-500 mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link
              className="text-amber-700 hover:underline font-medium"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
