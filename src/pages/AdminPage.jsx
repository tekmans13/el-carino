import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/auth';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      console.error('Erreur de déconnexion :', error.message);
      return;
    }

    navigate('/admin/login', { replace: true });
  };

  return (
    <main>
      <h1>Administration</h1>

      <p>Utilisateur connecté : {user?.email}</p>

      <button type="button" onClick={handleSignOut}>
        Se déconnecter
      </button>
    </main>
  );
}
