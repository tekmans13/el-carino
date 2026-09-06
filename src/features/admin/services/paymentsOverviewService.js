import { supabase } from '../../../services/supabase';

const REGISTRATION_PAYMENT_FIELDS = `
  id,
  first_name,
  last_name,
  email,
  phone,
  payment_amount_cents,
  payment_currency,
  created_at
`;

const PAYMENT_FIELDS = `
  id,
  inscription_id,
  amount_cents,
  payment_method,
  received_at,
  created_at
`;

function getComputedPaymentStatus(
  amountDueCents,
  amountReceivedCents,
) {
  if (
    amountDueCents === null
    || amountDueCents === undefined
  ) {
    return 'undefined';
  }

  if (amountReceivedCents <= 0) {
    return 'unpaid';
  }

  if (amountReceivedCents < amountDueCents) {
    return 'partial';
  }

  return 'paid';
}

export async function getPaymentsOverview() {
  const {
    data: registrations,
    error: registrationsError,
  } = await supabase
    .from('inscriptions')
    .select(REGISTRATION_PAYMENT_FIELDS)
    .order('last_name', {
      ascending: true,
    })
    .order('first_name', {
      ascending: true,
    });

  if (registrationsError) {
    throw new Error(
      `Impossible de charger les inscriptions : ${registrationsError.message}`,
    );
  }

  const {
    data: payments,
    error: paymentsError,
  } = await supabase
    .from('payments')
    .select(PAYMENT_FIELDS);

  if (paymentsError) {
    throw new Error(
      `Impossible de charger les règlements : ${paymentsError.message}`,
    );
  }

  const paymentsByRegistration =
    new Map();

  for (const payment of payments ?? []) {
    const current =
      paymentsByRegistration.get(
        payment.inscription_id,
      ) ?? {
        amountReceivedCents: 0,
        paymentCount: 0,
        lastPaymentAt: null,
      };

    current.amountReceivedCents +=
      Number(payment.amount_cents ?? 0);

    current.paymentCount += 1;

    if (
      payment.received_at
      && (
        !current.lastPaymentAt
        || new Date(payment.received_at)
          > new Date(current.lastPaymentAt)
      )
    ) {
      current.lastPaymentAt =
        payment.received_at;
    }

    paymentsByRegistration.set(
      payment.inscription_id,
      current,
    );
  }

  return (registrations ?? []).map(
    (registration) => {
      const paymentSummary =
        paymentsByRegistration.get(
          registration.id,
        ) ?? {
          amountReceivedCents: 0,
          paymentCount: 0,
          lastPaymentAt: null,
        };

      const amountDueCents =
        registration.payment_amount_cents;

      const amountReceivedCents =
        paymentSummary.amountReceivedCents;

      const remainingAmountCents =
        amountDueCents === null
        || amountDueCents === undefined
          ? null
          : Math.max(
            Number(amountDueCents)
            - amountReceivedCents,
            0,
          );

      return {
        ...registration,

        amount_received_cents:
          amountReceivedCents,

        remaining_amount_cents:
          remainingAmountCents,

        payment_count:
          paymentSummary.paymentCount,

        last_payment_at:
          paymentSummary.lastPaymentAt,

        computed_payment_status:
          getComputedPaymentStatus(
            amountDueCents,
            amountReceivedCents,
          ),
      };
    },
  );
}
