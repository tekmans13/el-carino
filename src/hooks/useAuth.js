import {
  useEffect,
  useState,
} from 'react';

import {
  getProfile,
  getSession,
  onAuthStateChange,
} from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile(currentSession) {
      if (!currentSession?.user) {
        if (mounted) {
          setProfile(null);
        }

        return;
      }

      const {
        data,
        error,
      } = await getProfile(
        currentSession.user.id,
      );

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          'Impossible de charger le profil :',
          error,
        );

        setProfile(null);

        return;
      }

      setProfile(data);
    }

    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await getSession();

      if (!mounted) {
        return;
      }

      setSession(currentSession);

      await loadProfile(currentSession);

      if (mounted) {
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) {
          return;
        }

        setSession(currentSession);

        await loadProfile(currentSession);

        if (mounted) {
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    profile,
    loading,
  };
}
