import { HomePage } from "./pages/HomePage";
import { BookPage } from "./pages/BookPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { LoanFromReservationPage } from "./pages/admin/LoanFromReservationPage";
import { LoansPage } from "./pages/admin/LoansPage";
import { DirectLoanPage } from "./pages/admin/DirectLoanPage";
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
    path: "/admin/loans",
    element: (
      <AdminRoute>
        <LoansPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/loans/reservations",
    element: (
      <AdminRoute>
        <LoanFromReservationPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/loans/direct",
    element: (
      <AdminRoute>
        <DirectLoanPage />
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
