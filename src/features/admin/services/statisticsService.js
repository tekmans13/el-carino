import { supabase } from '../../../services/supabase';
import { getPaymentsOverview } from './paymentsOverviewService';

const STATISTICS_FIELDS = `
  id,
  age_category,
  practice_type,
  gender,
  status,
  created_at,
  planned_payment_main_method,
  planned_payment_aids
`;

function normalizeGender(gender) {
  const value = String(gender ?? '')
    .trim()
    .toLowerCase();

  if (
    value === 'homme'
    || value === 'masculin'
    || value === 'm'
  ) {
    return 'male';
  }

  if (
    value === 'femme'
    || value === 'féminin'
    || value === 'feminin'
    || value === 'f'
  ) {
    return 'female';
  }

  return 'other';
}

function increment(object, key) {
  object[key] = (object[key] ?? 0) + 1;
}

function buildDailyRegistrations(registrations) {
  const validDates = registrations
    .map((registration) => {
      if (!registration.created_at) {
        return null;
      }

      const date = new Date(registration.created_at);

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return date;
    })
    .filter(Boolean);

  if (validDates.length === 0) {
    return [];
  }

  const firstDate = new Date(
    Math.min(...validDates.map((date) => date.getTime())),
  );

  const lastDate = new Date(
    Math.max(...validDates.map((date) => date.getTime())),
  );

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  const counts = new Map();

  for (const date of validDates) {
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    counts.set(
      key,
      (counts.get(key) ?? 0) + 1,
    );
  }

  const result = [];
  let cumulative = 0;

  const currentDate = new Date(firstDate);

  while (currentDate <= lastDate) {
    const key = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, '0'),
      String(currentDate.getDate()).padStart(2, '0'),
    ].join('-');

    const count = counts.get(key) ?? 0;

    cumulative += count;

    result.push({
      key,

      label: new Intl.DateTimeFormat(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit',
        },
      ).format(currentDate),

      fullLabel: new Intl.DateTimeFormat(
        'fr-FR',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
      ).format(currentDate),

      count,
      cumulative,
    });

    currentDate.setDate(
      currentDate.getDate() + 1,
    );
  }

  return result;
}

function buildPaymentStatistics(paymentsOverview, payments) {
  const result = {
    expectedCents: 0,
    receivedCents: 0,
    cashedCents: 0,
    remainingCents: 0,

    statuses: {
      paid: 0,
      partial: 0,
      unpaid: 0,
      pending: 0,
      undefined: 0,
    },

    byMethod: {
      cash: { receivedCents: 0, cashedCents: 0 },
      check: { receivedCents: 0, cashedCents: 0 },
      caf: { receivedCents: 0, cashedCents: 0 },
      cjeune: { receivedCents: 0, cashedCents: 0 },
      pass_sport: { receivedCents: 0, cashedCents: 0 },
    },
  };

  for (const registration of paymentsOverview) {
    const amountDue =
      registration.payment_amount_cents;

    if (
      amountDue !== null
      && amountDue !== undefined
    ) {
      result.expectedCents += Number(amountDue);
    }

    result.receivedCents += Number(
      registration.amount_received_cents ?? 0,
    );

    result.cashedCents += Number(
      registration.amount_cashed_cents ?? 0,
    );

    if (
      registration.remaining_amount_cents
      !== null
      && registration.remaining_amount_cents
      !== undefined
    ) {
      result.remainingCents += Number(
        registration.remaining_amount_cents,
      );
    }

    increment(
      result.statuses,
      registration.computed_payment_status
        ?? 'undefined',
    );
  }

  for (const payment of payments ?? []) {
    const method = payment.payment_method;

    if (
      Object.prototype.hasOwnProperty.call(
        result.byMethod,
        method,
      )
    ) {
      const amount = Number(payment.amount_cents ?? 0);

      result.byMethod[method].receivedCents += amount;

      if (payment.cashed_at) {
        result.byMethod[method].cashedCents += amount;
      }
    }
  }

  return result;
}

export async function getAdminStatistics() {
  const [
    registrationsResult,
    paymentsOverview,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from('inscriptions')
      .select(STATISTICS_FIELDS)
      .order('created_at', {
        ascending: true,
      }),

    getPaymentsOverview(),

    supabase
      .from('payments')
      .select('amount_cents, payment_method, cashed_at'),
  ]);

  if (registrationsResult.error) {
    throw new Error(
      `Impossible de charger les statistiques : ${
        registrationsResult.error.message
      }`,
    );
  }

  if (paymentsResult.error) {
    throw new Error(
      `Impossible de charger les paiements : ${
        paymentsResult.error.message
      }`,
    );
  }

  const registrations =
    registrationsResult.data ?? [];

  const payments =
    paymentsResult.data ?? [];

  const statistics = {
    total: registrations.length,

    age: {
      enfant: 0,
      adulte: 0,
    },

    gender: {
      male: 0,
      female: 0,
      other: 0,
    },

    practice: {
      enfant: {
        loisir: 0,
        competition: 0,
      },

      adulte: {
        loisir: 0,
        competition: 0,
      },
    },

    statuses: {},

    plannedPayments: {
      cash: 0,
      check_1: 0,
      check_2: 0,
      check_3: 0,
      undefined: 0,
    },

    aids: {
      caf: 0,
      cjeune: 0,
      pass_sport: 0,
    },

    dailyRegistrations: [],

    payments:
      buildPaymentStatistics(paymentsOverview, payments),
  };

  for (const registration of registrations) {
    if (
      registration.age_category === 'enfant'
      || registration.age_category === 'adulte'
    ) {
      statistics.age[
        registration.age_category
      ] += 1;
    }

    statistics.gender[
      normalizeGender(registration.gender)
    ] += 1;

    if (
      (
        registration.age_category === 'enfant'
        || registration.age_category === 'adulte'
      )
      && (
        registration.practice_type === 'loisir'
        || registration.practice_type
          === 'competition'
      )
    ) {
      statistics.practice[
        registration.age_category
      ][registration.practice_type] += 1;
    }

    increment(
      statistics.statuses,
      registration.status ?? 'inconnu',
    );

    const plannedMethod =
      registration.planned_payment_main_method;

    if (
      plannedMethod
      && Object.prototype.hasOwnProperty.call(
        statistics.plannedPayments,
        plannedMethod,
      )
    ) {
      statistics.plannedPayments[
        plannedMethod
      ] += 1;
    } else {
      statistics.plannedPayments.undefined += 1;
    }

    for (
      const aid
      of registration.planned_payment_aids ?? []
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          statistics.aids,
          aid,
        )
      ) {
        statistics.aids[aid] += 1;
      }
    }
  }

  statistics.dailyRegistrations =
  buildDailyRegistrations(registrations);
  return statistics;
}
