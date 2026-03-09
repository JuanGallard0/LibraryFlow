import { HomePage } from "./pages/HomePage";
import { BookPage } from "./pages/BookPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { MyLoansPage } from "./pages/MyLoansPage";
import { LoansPage } from "./pages/admin/LoansPage";
import { ReservationsPage as AdminReservationsPage } from "./pages/admin/ReservationsPage";
import { CreateLoanPage } from "./pages/admin/CreateLoanPage";
import { CreateBookPage } from "./pages/admin/CreateBookPage";
import { AddBookCopyPage } from "./pages/admin/AddBookCopyPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/api-authorization/ProtectedRoute";
import { AdminRoute } from "./components/api-authorization/AdminRoute";

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
    path: "/loans",
    element: (
      <ProtectedRoute>
        <MyLoansPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/loans",
    element: (
      <AdminRoute>
        <LoansPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/reservations",
    element: (
      <AdminRoute>
        <AdminReservationsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/loans/new",
    element: (
      <AdminRoute>
        <CreateLoanPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/books/new",
    element: (
      <AdminRoute>
        <CreateBookPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/books/:id/copies/new",
    element: (
      <AdminRoute>
        <AddBookCopyPage />
      </AdminRoute>
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
