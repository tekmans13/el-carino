import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import ScrollToTop from '../components/ScrollToTop';
import ProtectedRoute from '../components/ProtectedRoute';

import HomePage from '../pages/HomePage';
import ClubPage from '../pages/ClubPage';
import InscriptionPage from '../pages/InscriptionPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminPage from '../pages/AdminPage';
import AdminRegistrationPage from '../pages/AdminRegistrationPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
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
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
