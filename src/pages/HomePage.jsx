import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <h1>El Carino</h1>

      <p>Site du club de boxe.</p>

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
