import { supabase } from './supabase';

/**
 * Connecte un utilisateur avec son adresse e-mail et son mot de passe.
 */
export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
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
