import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signIn } from '../services/auth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p>Vérification de la session...</p>;
  }

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage('');

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <main>
      <h1>Connexion administration</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {errorMessage && (
          <p role="alert">{errorMessage}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p>
        <Link to="/">Retour à l’accueil</Link>
      </p>
    </main>
  );
}
