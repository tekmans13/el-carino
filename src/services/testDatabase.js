import { supabase } from './supabase';

/**
 * Vérifie que la table inscriptions est accessible.
 */
export async function testDatabaseConnection() {
  const { error } = await supabase
    .from('inscriptions')
    .select('id')
    .limit(1);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Table inscriptions accessible',
  };
}
