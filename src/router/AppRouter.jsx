import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import ScrollToTop from '../components/ScrollToTop';

import HomePage from '../pages/HomePage';
import ClubPage from '../pages/ClubPage';
import InscriptionPage from '../pages/InscriptionPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

import ProtectedRoute from '../components/ProtectedRoute';

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
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
