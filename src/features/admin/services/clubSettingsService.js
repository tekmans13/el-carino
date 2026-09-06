import { supabase } from '../../../services/supabase';

export async function getClubSettings() {
  const { data, error } = await supabase
    .from('club_settings')
    .select(`
      id,
      adult_age_threshold,
      minor_annual_fee_cents,
      adult_annual_fee_cents,
      federal_license_fee_cents,
      created_at,
      updated_at
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

export async function updateClubSettings(settingsId, values) {
  const payload = {
    adult_age_threshold: values.adultAgeThreshold,
    minor_annual_fee_cents: Math.round(
      Number(values.minorAnnualFee) * 100,
    ),
    adult_annual_fee_cents: Math.round(
      Number(values.adultAnnualFee) * 100,
    ),
    federal_license_fee_cents: Math.round(
      Number(values.federalLicenseFee) * 100,
    ),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('club_settings')
    .update(payload)
    .eq('id', settingsId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Impossible d’enregistrer les paramètres du club : ${error.message}`,
    );
  }

  return data;
}
