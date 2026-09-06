import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import ScrollToTop from '../components/ScrollToTop';
import ProtectedRoute from '../components/ProtectedRoute';

import ClubPage from '../pages/ClubPage';
import InscriptionPage from '../pages/InscriptionPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminPage from '../pages/AdminPage';
import AdminRegistrationPage from '../pages/AdminRegistrationPage';
import AdminPaymentsPage from '../pages/AdminPaymentsPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<InscriptionPage />}
        />

        <Route
          path="/club"
          element={<ClubPage />}
        />

        <Route
          path="/inscription"
          element={<InscriptionPage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/inscriptions/:registrationId"
          element={
            <ProtectedRoute>
              <AdminRegistrationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/paiements"
          element={
            <ProtectedRoute>
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/parametres"
          element={
            <ProtectedRoute>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/utilisateurs"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
