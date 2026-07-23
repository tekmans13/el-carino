import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

type EmailType =
  | 'registration_summary'
  | 'complement_request';

type EmailRequest = {
  registrationId?: string;
  type?: EmailType;
};

type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age_category: string;
  practice_type: string;
  status: string;

  summary_email_sent_at: string | null;

  complement_message: string | null;
  complement_requested_at: string | null;
  complement_email_sent_at: string | null;
};

type EmailContent = {
  subject: string;
  text: string;
  html: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_EMAIL_TYPES: EmailType[] = [
  'registration_summary',
  'complement_request',
];

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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildRegistrationSummaryEmail(
  registration: Registration,
): EmailContent {
  const fullName =
    `${registration.first_name} ${registration.last_name}`;

  const escapedFullName = escapeHtml(fullName);

  const ageCategory = escapeHtml(
    getAgeCategoryLabel(registration.age_category),
  );

  const practiceType = escapeHtml(
    getPracticeTypeLabel(registration.practice_type),
  );

  const registrationId = escapeHtml(registration.id);

  return {
    subject:
      'Votre inscription El Carino a bien été reçue',

    text: `Bonjour,

Nous avons bien reçu la demande d'inscription de ${fullName}.

Informations du dossier :
- Profil : ${getAgeCategoryLabel(registration.age_category)}
- Pratique : ${getPracticeTypeLabel(registration.practice_type)}
- Référence : ${registration.id}

Le dossier est maintenant en cours de vérification.

Vous recevrez un nouvel e-mail lorsque le dossier sera validé ou si des informations complémentaires sont nécessaires.

Sportivement,

Le club El Carino`,

    html: `
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <title>Inscription reçue</title>
        </head>

        <body>
          <p>Bonjour,</p>

          <p>
            Nous avons bien reçu la demande d'inscription de
            <strong>${escapedFullName}</strong>.
          </p>

          <p>Informations du dossier :</p>

          <ul>
            <li>Profil : ${ageCategory}</li>
            <li>Pratique : ${practiceType}</li>
            <li>Référence : ${registrationId}</li>
          </ul>

          <p>
            Le dossier est maintenant en cours de vérification.
          </p>

          <p>
            Vous recevrez un nouvel e-mail lorsque le dossier sera
            validé ou si des informations complémentaires sont
            nécessaires.
          </p>

          <p>
            Sportivement,<br>
            Le club El Carino
          </p>
        </body>
      </html>
    `,
  };
}

function buildComplementRequestEmail(
  registration: Registration,
): EmailContent {
  const fullName =
    `${registration.first_name} ${registration.last_name}`;

  const complementMessage =
    registration.complement_message?.trim();

  if (!complementMessage) {
    throw new Error(
      'Aucun message de demande de complément n’est enregistré.',
    );
  }

  const escapedFullName = escapeHtml(fullName);
  const escapedMessage = escapeHtml(complementMessage)
    .replaceAll('\n', '<br>');

  const registrationId = escapeHtml(registration.id);

  return {
    subject:
      'Informations complémentaires nécessaires pour votre inscription El Carino',

    text: `Bonjour,

Après vérification de la demande d'inscription de ${fullName}, nous avons besoin d'informations complémentaires.

Message du club :

${complementMessage}

Référence du dossier : ${registration.id}

Merci de prendre contact avec le club afin de compléter votre dossier.

Sportivement,

Le club El Carino`,

    html: `
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <title>Complément nécessaire</title>
        </head>

        <body>
          <p>Bonjour,</p>

          <p>
            Après vérification de la demande d'inscription de
            <strong>${escapedFullName}</strong>, nous avons besoin
            d'informations complémentaires.
          </p>

          <p><strong>Message du club :</strong></p>

          <blockquote>
            ${escapedMessage}
          </blockquote>

          <p>
            Référence du dossier :
            <strong>${registrationId}</strong>
          </p>

          <p>
            Merci de prendre contact avec le club afin de compléter
            votre dossier.
          </p>

          <p>
            Sportivement,<br>
            Le club El Carino
          </p>
        </body>
      </html>
    `,
  };
}

function buildEmailContent(
  registration: Registration,
  type: EmailType,
): EmailContent {
  if (type === 'complement_request') {
    return buildComplementRequestEmail(registration);
  }

  return buildRegistrationSummaryEmail(registration);
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return Response.json(
      {
        success: false,
        error: 'Méthode non autorisée.',
      },
      {
        status: 405,
      },
    );
  }

  try {
    const body = await request.json() as EmailRequest;

    const registrationId = body.registrationId;

    const type: EmailType =
      body.type ?? 'registration_summary';

    if (
      !registrationId
      || !UUID_PATTERN.test(registrationId)
    ) {
      return Response.json(
        {
          success: false,
          error: 'La référence du dossier est invalide.',
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_EMAIL_TYPES.includes(type)) {
      return Response.json(
        {
          success: false,
          error: 'Le type d’e-mail demandé est invalide.',
        },
        {
          status: 400,
        },
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
        summary_email_sent_at,
        complement_message,
        complement_requested_at,
        complement_email_sent_at
      `)
      .eq('id', registrationId)
      .maybeSingle<Registration>();

    if (registrationError) {
      throw new Error(
        `Impossible de lire l'inscription : ${registrationError.message}`,
      );
    }

    if (!registration) {
      return Response.json(
        {
          success: false,
          error: 'Dossier introuvable.',
        },
        {
          status: 404,
        },
      );
    }

    if (
      type === 'registration_summary'
      && registration.status !== 'soumis'
    ) {
      return Response.json(
        {
          success: false,
          error:
            'Le dossier ne possède pas le statut soumis.',
        },
        {
          status: 409,
        },
      );
    }

    if (
      type === 'complement_request'
      && registration.status !== 'complement_demande'
    ) {
      return Response.json(
        {
          success: false,
          error:
            'Le dossier ne possède pas le statut complément demandé.',
        },
        {
          status: 409,
        },
      );
    }

    if (
      type === 'registration_summary'
      && registration.summary_email_sent_at
    ) {
      return Response.json({
        success: true,
        alreadySent: true,
        message:
          'L’e-mail de confirmation avait déjà été envoyé.',
      });
    }

    if (
      type === 'complement_request'
      && registration.complement_email_sent_at
    ) {
      return Response.json({
        success: true,
        alreadySent: true,
        message:
          'L’e-mail de demande de complément avait déjà été envoyé.',
      });
    }

    const emailContent = buildEmailContent(
      registration,
      type,
    );

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
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    const sentAt = new Date().toISOString();

    const sentAtColumn =
      type === 'complement_request'
        ? 'complement_email_sent_at'
        : 'summary_email_sent_at';

    const { error: updateError } = await supabaseAdmin
      .from('inscriptions')
      .update({
        [sentAtColumn]: sentAt,
        updated_at: sentAt,
      })
      .eq('id', registration.id)
      .is(sentAtColumn, null);

    if (updateError) {
      console.error(
        'E-mail envoyé, mais date non enregistrée :',
        updateError,
      );
    }

    return Response.json({
      success: true,
      alreadySent: false,
      type,
      message:
        type === 'complement_request'
          ? 'E-mail de demande de complément envoyé.'
          : 'E-mail de confirmation envoyé.',
    });
  } catch (error) {
    console.error(
      'Erreur pendant l’envoi de l’e-mail :',
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur inconnue pendant l’envoi.',
      },
      {
        status: 500,
      },
    );
  }
});
