import { supabase } from './supabase';

/**
 * Connecte un utilisateur avec son identifiant
 * et son mot de passe.
 *
 * L'identifiant correspond au prénom enregistré
 * dans le profil back-office.
 */
export async function signIn(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  const { data: email, error: resolveError } =
    await supabase.rpc('resolve_admin_login', {
      login_username: normalizedUsername,
    });

  if (resolveError) {
    return {
      data: null,
      error: new Error(
        'Impossible de vérifier cet identifiant.',
      ),
    };
  }

  if (!email) {
    return {
      data: null,
      error: new Error(
        'Identifiant ou mot de passe incorrect.',
      ),
    };
  }

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (result.error) {
    return {
      ...result,
      error: new Error(
        'Identifiant ou mot de passe incorrect.',
      ),
    };
  }

  return result;
}

/**
 * Déconnecte l'utilisateur courant.
 */
export async function signOut() {
  return supabase.auth.signOut();
}

/**
 * Retourne la session stockée dans le navigateur.
 */
export async function getSession() {
  return supabase.auth.getSession();
}

/**
 * Écoute les changements de session.
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Retourne le profil back-office de l'utilisateur connecté.
 */
export async function getProfile(userId) {
  return supabase
    .from('profiles')
    .select(
      `
        id,
        email,
        display_name,
        username,
        role
      `,
    )
    .eq('id', userId)
    .single();
}
