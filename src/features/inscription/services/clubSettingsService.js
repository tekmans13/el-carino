import { supabase } from '../../../services/supabase';

export async function getClubSettings() {
  const { data, error } = await supabase
    .from('club_settings')
    .select(`
      id,
      adult_age_threshold,
      minor_annual_fee_cents,
      adult_annual_fee_cents,
      federal_license_fee_cents
    `)
    .limit(1)
    .single();

  if (error) {
    throw new Error(
      `Impossible de charger les paramètres du club : ${error.message}`,
    );
  }

  return data;
}
