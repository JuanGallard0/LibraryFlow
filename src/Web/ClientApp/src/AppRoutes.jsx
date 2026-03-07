import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { HomePage } from "./pages/HomePage";
import { BookPage } from "./pages/BookPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/api-authorization/ProtectedRoute";

const AppRoutes = [
  {
    index: true,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/counter",
    element: (
      <ProtectedRoute>
        <Counter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/fetch-data",
    element: (
      <ProtectedRoute>
        <FetchData />
      </ProtectedRoute>
    ),
  },
  {
    path: "/books/:id",
    element: (
      <ProtectedRoute>
        <BookPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservations",
    element: (
      <ProtectedRoute>
        <ReservationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];

export default AppRoutes;
