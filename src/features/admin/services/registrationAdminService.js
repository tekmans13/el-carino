import { supabase } from '../../../services/supabase';

export async function listRegistrations() {
  const { data, error } = await supabase
    .from('inscriptions')
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      age_category,
      practice_type,
      status,
      payment_status,
      created_at
    `)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Impossible de charger les inscriptions : ${error.message}`,
    );
  }

  return data ?? [];
}
