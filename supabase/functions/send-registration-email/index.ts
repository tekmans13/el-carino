import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

type EmailRequest = {
  registrationId?: string;
};

type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age_category: string;
  practice_type: string;
  status: string;
  payment_amount_cents: number;
  payment_currency: string;
  planned_payment_main_method: string | null;
  planned_payment_aids: string[];
  summary_email_sent_at: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return Response.json(
    body,
    {
      status,
      headers: CORS_HEADERS,
    },
  );
}

function requireEnvironmentVariable(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`La variable ${name} est absente.`);
  }

  return value;
}

function getAgeCategoryLabel(ageCategory: string): string {
  return ageCategory === 'enfant'
    ? 'Enfant'
    : 'Adulte';
}

function getPracticeTypeLabel(practiceType: string): string {
  return practiceType === 'competition'
    ? 'Compétition'
    : 'Loisir';
}

function getMainPaymentMethodLabel(
  paymentMethod: string | null,
): string | null {
  const labels: Record<string, string> = {
    cash: 'Espèces',
    check_1: 'Chèque en 1 fois',
    check_2: 'Chèque en 2 fois',
    check_3: 'Chèque en 3 fois',
  };

  if (!paymentMethod) {
    return null;
  }

  return labels[paymentMethod] ?? paymentMethod;
}

function getPaymentAidLabel(
  paymentAid: string,
): string {
  const labels: Record<string, string> = {
    caf: 'Coupons CAF',
    cjeune: 'C-Jeune',
    pass_sport: 'Pass’Sport',
  };

  return labels[paymentAid] ?? paymentAid;
}

function getPaymentMethodLabels(
  registration: Registration,
): string[] {
  const labels: string[] = [];

  const mainPaymentMethod =
    getMainPaymentMethodLabel(
      registration.planned_payment_main_method,
    );

  if (mainPaymentMethod) {
    labels.push(mainPaymentMethod);
  }

  for (
    const paymentAid
    of registration.planned_payment_aids ?? []
  ) {
    labels.push(
      getPaymentAidLabel(paymentAid),
    );
  }

  return labels;
}

function formatAmount(
  amountCents: number,
  currency: string,
): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildTextEmail(registration: Registration): string {
  const fullName =
    `${registration.first_name} ${registration.last_name}`;

  const paymentMethods =
    getPaymentMethodLabels(registration);

  const paymentMethodsText =
    paymentMethods.length > 0
      ? paymentMethods
        .map((method) => `- ${method}`)
        .join('\n')
      : '- Non renseigné';

  const amount = formatAmount(
    registration.payment_amount_cents,
    registration.payment_currency,
  );

  return `Bonjour,

Votre inscription au club El Carino a bien été enregistrée.

Adhérent :
${fullName}

Informations du dossier :
- Profil : ${getAgeCategoryLabel(registration.age_category)}
- Pratique : ${getPracticeTypeLabel(registration.practice_type)}
- Montant à régler : ${amount}
- Référence : ${registration.id}

Mode(s) de règlement prévu(s) :
${paymentMethodsText}

Le règlement n’est pas effectué en ligne.

Les règlements, chèques et justificatifs liés aux aides ou coupons sont à remettre directement au club.
Les chèques sont à établir à l’ordre de « ASC EL CARINO ».

Les chèques vacances ne sont pas acceptés.

Le bureau du club enregistrera les règlements au fur et à mesure de leur réception.

Sportivement,

Le club El Carino`;
}

function buildHtmlEmail(registration: Registration): string {
  const fullName = escapeHtml(
    `${registration.first_name} ${registration.last_name}`,
  );

  const ageCategory = escapeHtml(
    getAgeCategoryLabel(registration.age_category),
  );

  const practiceType = escapeHtml(
    getPracticeTypeLabel(registration.practice_type),
  );

  const registrationId = escapeHtml(registration.id);

  const amount = escapeHtml(
    formatAmount(
      registration.payment_amount_cents,
      registration.payment_currency,
    ),
  );

  const paymentMethods =
    getPaymentMethodLabels(registration);

  const paymentMethodsHtml =
    paymentMethods.length > 0
      ? paymentMethods
        .map(
          (method) =>
            `<li>${escapeHtml(method)}</li>`,
        )
        .join('')
      : '<li>Non renseigné</li>';

  return `
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Inscription El Carino enregistrée</title>
      </head>

      <body>
        <p>Bonjour,</p>

        <p>
          Votre inscription au club El Carino a bien été
          enregistrée.
        </p>

        <p>
          Adhérent :
          <strong>${fullName}</strong>
        </p>

        <p>Informations du dossier :</p>

        <ul>
          <li>Profil : ${ageCategory}</li>
          <li>Pratique : ${practiceType}</li>
          <li>Montant à régler : <strong>${amount}</strong></li>
          <li>Référence : ${registrationId}</li>
        </ul>

        <p>
          <strong>Mode(s) de règlement prévu(s) :</strong>
        </p>

        <ul>
          ${paymentMethodsHtml}
        </ul>

        <p>
          Le règlement n’est pas effectué en ligne.
        </p>

        <p>
          Les règlements, chèques et justificatifs liés aux
          aides ou coupons sont à remettre directement au club.
          Les chèques sont à établir à l’ordre de
          « ASC EL CARINO ».
        </p>

        <p>
          Les chèques vacances ne sont pas acceptés.
        </p>

        <p>
          Le bureau du club enregistrera les règlements au fur
          et à mesure de leur réception.
        </p>

        <p>
          Sportivement,<br>
          Le club El Carino
        </p>
      </body>
    </html>
  `;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(
      'ok',
      {
        status: 200,
        headers: CORS_HEADERS,
      },
    );
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      {
        success: false,
        error: 'Méthode non autorisée.',
      },
      405,
    );
  }

  try {
    const { registrationId } =
      await request.json() as EmailRequest;

    if (
      !registrationId
      || !UUID_PATTERN.test(registrationId)
    ) {
      return jsonResponse(
        {
          success: false,
          error: 'La référence du dossier est invalide.',
        },
        400,
      );
    }

    const supabaseUrl =
      requireEnvironmentVariable('SUPABASE_URL');

    const serviceRoleKey =
      requireEnvironmentVariable(
        'SUPABASE_SERVICE_ROLE_KEY',
      );

    const smtpHost =
      requireEnvironmentVariable('SMTP_HOST');

    const smtpPort = Number(
      requireEnvironmentVariable('SMTP_PORT'),
    );

    const smtpUser =
      requireEnvironmentVariable('SMTP_USER');

    const smtpPassword =
      requireEnvironmentVariable('SMTP_PASSWORD');

    const smtpFrom =
      requireEnvironmentVariable('SMTP_FROM');

    if (!Number.isInteger(smtpPort)) {
      throw new Error(
        'La variable SMTP_PORT est invalide.',
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const {
      data: registration,
      error: registrationError,
    } = await supabaseAdmin
      .from('inscriptions')
      .select(`
        id,
        first_name,
        last_name,
        email,
        age_category,
        practice_type,
        status,
        payment_amount_cents,
        payment_currency,
        planned_payment_main_method,
        planned_payment_aids,
        summary_email_sent_at
      `)
      .eq('id', registrationId)
      .maybeSingle<Registration>();

    if (registrationError) {
      throw new Error(
        `Impossible de lire l'inscription : ${registrationError.message}`,
      );
    }

    if (!registration) {
      return jsonResponse(
        {
          success: false,
          error: 'Dossier introuvable.',
        },
        404,
      );
    }

    if (registration.status !== 'soumis') {
      return jsonResponse(
        {
          success: false,
          error:
            'Le dossier ne possède pas le statut soumis.',
        },
        409,
      );
    }

    const paymentMethods =
      getPaymentMethodLabels(registration);

    if (paymentMethods.length === 0) {
      return jsonResponse(
        {
          success: false,
          error:
            'Aucun mode de règlement n’a encore été renseigné.',
        },
        409,
      );
    }

    if (registration.summary_email_sent_at) {
      return jsonResponse({
        success: true,
        alreadySent: true,
        message:
          'L’e-mail de confirmation avait déjà été envoyé.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: registration.email,
      subject:
        'Confirmation de votre inscription El Carino',
      text: buildTextEmail(registration),
      html: buildHtmlEmail(registration),
    });

    const sentAt = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from('inscriptions')
      .update({
        summary_email_sent_at: sentAt,
      })
      .eq('id', registration.id)
      .is('summary_email_sent_at', null);

    if (updateError) {
      console.error(
        'E-mail envoyé, mais date non enregistrée :',
        updateError,
      );
    }

    return jsonResponse({
      success: true,
      alreadySent: false,
      message: 'E-mail de confirmation envoyé.',
    });
  } catch (error) {
    console.error(
      'Erreur pendant l’envoi de l’e-mail :',
      error,
    );

    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur inconnue pendant l’envoi.',
      },
      500,
    );
  }
});
