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
  summary_email_sent_at: string | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

function buildTextEmail(registration: Registration): string {
  const fullName =
    `${registration.first_name} ${registration.last_name}`;

  return `Bonjour,

Nous avons bien reçu la demande d'inscription de ${fullName}.

Informations du dossier :
- Profil : ${getAgeCategoryLabel(registration.age_category)}
- Pratique : ${getPracticeTypeLabel(registration.practice_type)}
- Référence : ${registration.id}

Le dossier est maintenant en cours de vérification.

Vous recevrez un nouvel e-mail lorsque le dossier sera validé ou si des informations complémentaires sont nécessaires.

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

  return `
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
          <strong>${fullName}</strong>.
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
  `;
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
    const { registrationId } =
      await request.json() as EmailRequest;

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

    if (registration.status !== 'soumis') {
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

    if (registration.summary_email_sent_at) {
      return Response.json({
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
      subject: 'Votre inscription El Carino a bien été reçue',
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

    return Response.json({
      success: true,
      alreadySent: false,
      message: 'E-mail de confirmation envoyé.',
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
