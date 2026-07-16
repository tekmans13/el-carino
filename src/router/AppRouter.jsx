import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import InscriptionPage from '../pages/InscriptionPage';
import ClubPage from '../pages/ClubPage';
import AdminLoginPage from '../pages/AdminLoginPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/club" element={<ClubPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
