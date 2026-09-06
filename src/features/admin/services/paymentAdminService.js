import { supabase } from '../../../services/supabase';

const PAYMENT_FIELDS = `
  id,
  inscription_id,
  amount_cents,
  payment_method,
  received_at,
  note,
  created_by,
  created_at
`;

const PAYMENT_METHODS = [
  'cash',
  'check',
  'caf',
  'cjeune',
  'pass_sport',
];

export async function listRegistrationPayments(
  registrationId,
) {
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

  const { data, error } = await supabase
    .from('payments')
    .select(PAYMENT_FIELDS)
    .eq('inscription_id', registrationId)
    .order('received_at', {
      ascending: false,
    })
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Impossible de charger les règlements : ${error.message}`,
    );
  }

  return data ?? [];
}

export async function createRegistrationPayment({
  registrationId,
  amountCents,
  paymentMethod,
  receivedDate,
  note,
}) {
  if (!registrationId) {
    throw new Error(
      'La référence du dossier est obligatoire.',
    );
  }

  if (
    !Number.isInteger(amountCents)
    || amountCents <= 0
  ) {
    throw new Error(
      'Le montant du règlement doit être supérieur à 0 €.',
    );
  }

  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    throw new Error(
      'Le moyen de règlement sélectionné est invalide.',
    );
  }

  if (!receivedDate) {
    throw new Error(
      'La date de réception du règlement est obligatoire.',
    );
  }

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Impossible d’identifier l’utilisateur connecté : ${authError.message}`,
    );
  }

  const normalizedNote =
    typeof note === 'string'
      ? note.trim()
      : '';

  const receivedAt =
    `${receivedDate}T12:00:00.000Z`;

  const { data, error } = await supabase
    .from('payments')
    .insert({
      inscription_id: registrationId,
      amount_cents: amountCents,
      payment_method: paymentMethod,
      received_at: receivedAt,
      note: normalizedNote || null,
      created_by: authData.user?.id ?? null,
    })
    .select(PAYMENT_FIELDS)
    .single();

  if (error) {
    throw new Error(
      `Impossible d’enregistrer le règlement : ${error.message}`,
    );
  }

  return data;
}

export async function deleteRegistrationPayment(
  paymentId,
) {
  if (!paymentId) {
    throw new Error(
      'La référence du règlement est obligatoire.',
    );
  }

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId);

  if (error) {
    throw new Error(
      `Impossible de supprimer le règlement : ${error.message}`,
    );
  }
}
