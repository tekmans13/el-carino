import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type CreateUserRequest = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

function requireEnvironmentVariable(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`La variable ${name} est absente.`);
  }

  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildTextEmail({
  firstName,
  email,
  password,
  siteUrl,
}: {
  firstName: string;
  email: string;
  password: string;
  siteUrl: string;
}): string {
  return `Bonjour ${firstName},

Un accès au back-office El Carino vient de vous être créé.

Adresse de connexion :
${siteUrl}

Email :
${email}

Mot de passe initial :
${password}

Vous pouvez maintenant vous connecter au back-office.

Nous vous recommandons de modifier votre mot de passe après votre première connexion.

Sportivement,

Le club El Carino`;
}

function buildHtmlEmail({
  firstName,
  email,
  password,
  siteUrl,
}: {
  firstName: string;
  email: string;
  password: string;
  siteUrl: string;
}): string {
  const safeFirstName = escapeHtml(firstName);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(password);
  const safeSiteUrl = escapeHtml(siteUrl);

  return `
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Votre accès El Carino</title>
      </head>

      <body>
        <p>Bonjour ${safeFirstName},</p>

        <p>
          Un accès au back-office El Carino vient de vous être créé.
        </p>

        <p>
          <strong>Adresse de connexion :</strong><br>
          <a href="${safeSiteUrl}">
            ${safeSiteUrl}
          </a>
        </p>

        <p>
          <strong>Email :</strong><br>
          ${safeEmail}
        </p>

        <p>
          <strong>Mot de passe initial :</strong><br>
          ${safePassword}
        </p>

        <p>
          Vous pouvez maintenant vous connecter au back-office.
        </p>

        <p>
          Nous vous recommandons de modifier votre mot de passe
          après votre première connexion.
        </p>

        <p>
          Sportivement,<br>
          Le club El Carino
        </p>
      </body>
    </html>
  `;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Méthode non autorisée.',
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  let createdUserId: string | null = null;

  try {
    const {
      email,
      password,
      firstName,
      lastName,
    } = await req.json() as CreateUserRequest;

    if (
      !email
      || !password
      || !firstName
      || !lastName
    ) {
      return new Response(
        JSON.stringify({
          error:
            'Nom, prénom, email et mot de passe sont obligatoires.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
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

    const adminSiteUrl =
      requireEnvironmentVariable('ADMIN_SITE_URL');

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

    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      });

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (!data.user) {
      throw new Error(
        'Le compte utilisateur n’a pas pu être créé.',
      );
    }

    createdUserId = data.user.id;

    const loginUrl =
      `${adminSiteUrl.replace(/\/$/, '')}/admin/login`;

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
      to: email,
      subject: 'Votre accès au back-office El Carino',
      text: buildTextEmail({
        firstName,
        email,
        password,
        siteUrl: loginUrl,
      }),
      html: buildHtmlEmail({
        firstName,
        email,
        password,
        siteUrl: loginUrl,
      }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          first_name: firstName,
          last_name: lastName,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(
      'Erreur création utilisateur :',
      error,
    );

    if (createdUserId) {
      try {
        const supabaseUrl =
          requireEnvironmentVariable('SUPABASE_URL');

        const serviceRoleKey =
          requireEnvironmentVariable(
            'SUPABASE_SERVICE_ROLE_KEY',
          );

        const supabaseAdmin = createClient(
          supabaseUrl,
          serviceRoleKey,
        );

        await supabaseAdmin.auth.admin.deleteUser(
          createdUserId,
        );
      } catch (rollbackError) {
        console.error(
          'Impossible de supprimer l’utilisateur après échec :',
          rollbackError,
        );
      }
    }

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Erreur inconnue.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
