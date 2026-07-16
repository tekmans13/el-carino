import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testDatabaseConnection } from '../services/testDatabase';

export default function HomePage() {
  const [databaseStatus, setDatabaseStatus] =
    useState('Test de la base...');

  useEffect(() => {
    const runTest = async () => {
      const result = await testDatabaseConnection();
      setDatabaseStatus(result.message);
    };

    runTest();
  }, []);

  return (
    <main>
      <h1>El Carino</h1>

      <p>{databaseStatus}</p>

      <nav>
        <ul>
          <li>
            <Link to="/inscription">Inscription</Link>
          </li>
          <li>
            <Link to="/club">Le club</Link>
          </li>
          <li>
            <Link to="/admin/login">Administration</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
