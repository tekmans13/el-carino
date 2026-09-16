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

Informations pratiques :

Lieu des entraînements :
Gymnase du Collège de l’Estaque
348 rue Rabelais
13016 Marseille

Horaires :
- Mardi : 17h30 – 19h30 — Adolescents / adultes
- Mercredi : 17h00 – 18h00 — Enfants
- Mercredi : 18h30 – 20h00 — Adultes (arrivée à 18h15)
- Samedi : 10h00 – 12h00 — Enfants / adolescents / adultes

Équipement obligatoire :
- Protège-dents
- Coquille
- Gants à velcro et bandes
- Protège-tibias
- Protège-pieds Full-Contact en mousse avec talon
- Pantalon Full-Contact ou short de Kick-Boxing
- T-shirt de sport, de préférence celui du club
- Casque et plastron pour les combats
- Bouteille d’eau et serviette

En cas de doute sur le matériel ou les tailles, renseignez-vous auprès du club avant votre achat.

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
          (method) => `
            <tr>
              <td style="
                padding: 5px 0;
                font-size: 15px;
                line-height: 22px;
                color: #263442;
              ">
                ✓ ${escapeHtml(method)}
              </td>
            </tr>
          `,
        )
        .join('')
      : `
        <tr>
          <td style="
            padding: 5px 0;
            font-size: 15px;
            color: #263442;
          ">
            Non renseigné
          </td>
        </tr>
      `;

  return `
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >
        <title>Inscription El Carino enregistrée</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background: #f5f7fa;
          font-family: Arial, Helvetica, sans-serif;
          color: #263442;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background: #f5f7fa;"
        >
          <tr>
            <td
              align="center"
              style="padding: 32px 12px;"
            >
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  width: 100%;
                  max-width: 640px;
                  background: #ffffff;
                  border-radius: 14px;
                  overflow: hidden;
                  border: 1px solid #dce3ec;
                "
              >
                <tr>
                  <td
                    style="
                      padding: 28px 32px;
                      background: #f1fbf5;
                      border-bottom: 4px solid #17834d;
                    "
                  >
                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                    >
                      <tr>
                        <td
                          valign="top"
                          style="padding-right: 16px;"
                        >
                          <div
                            style="
                              width: 42px;
                              height: 42px;
                              line-height: 42px;
                              text-align: center;
                              border-radius: 50%;
                              background: #17834d;
                              color: #ffffff;
                              font-size: 22px;
                              font-weight: bold;
                            "
                          >
                            ✓
                          </div>
                        </td>

                        <td>
                          <div
                            style="
                              font-size: 12px;
                              line-height: 18px;
                              font-weight: bold;
                              text-transform: uppercase;
                              letter-spacing: 1px;
                              color: #17834d;
                            "
                          >
                            ASC EL CARINO
                          </div>

                          <h1
                            style="
                              margin: 4px 0 6px;
                              font-size: 24px;
                              line-height: 30px;
                              color: #1d2a36;
                            "
                          >
                            Inscription enregistrée
                          </h1>

                          <p
                            style="
                              margin: 0;
                              font-size: 15px;
                              line-height: 22px;
                              color: #536273;
                            "
                          >
                            Votre inscription a bien été prise
                            en compte.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 28px 32px 8px;">
                    <p
                      style="
                        margin: 0 0 8px;
                        font-size: 16px;
                        line-height: 24px;
                      "
                    >
                      Bonjour,
                    </p>

                    <p
                      style="
                        margin: 0;
                        font-size: 16px;
                        line-height: 24px;
                      "
                    >
                      L'inscription de
                      <strong>${fullName}</strong>
                      au club El Carino est enregistrée.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 32px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background: #fff7f7;
                        border: 1px solid #f1d7d9;
                        border-radius: 12px;
                      "
                    >
                      <tr>
                        <td style="padding: 20px;">
                          <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                          >
                            <tr>
                              <td>
                                <div
                                  style="
                                    font-size: 13px;
                                    color: #6b7785;
                                  "
                                >
                                  Cotisation annuelle
                                </div>

                                <div
                                  style="
                                    margin-top: 4px;
                                    font-size: 15px;
                                    font-weight: bold;
                                    color: #263442;
                                  "
                                >
                                  El Carino
                                </div>
                              </td>

                              <td
                                align="right"
                                valign="middle"
                                style="
                                  font-size: 25px;
                                  font-weight: bold;
                                  color: #c91f26;
                                  white-space: nowrap;
                                "
                              >
                                ${amount}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 32px 16px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        border: 1px solid #dce3ec;
                        border-radius: 12px;
                        background: #ffffff;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 16px 20px;
                            background: #fbfcfe;
                            border-bottom: 1px solid #e4e9ef;
                          "
                        >
                          <strong
                            style="
                              font-size: 16px;
                              color: #1d2a36;
                            "
                          >
                            Dossier d'inscription
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 16px 20px;">
                          <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                          >
                            <tr>
                              <td style="padding: 5px 0;">
                                <strong>Profil :</strong>
                                ${ageCategory}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 5px 0;">
                                <strong>Pratique :</strong>
                                ${practiceType}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style="
                                  padding: 5px 0;
                                  font-size: 12px;
                                  color: #6b7785;
                                "
                              >
                                Référence : ${registrationId}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 32px 16px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        border: 1px solid #dce3ec;
                        border-radius: 12px;
                        background: #ffffff;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 16px 20px;
                            background: #fbfcfe;
                            border-bottom: 1px solid #e4e9ef;
                          "
                        >
                          <strong
                            style="
                              font-size: 16px;
                              color: #1d2a36;
                            "
                          >
                            Mode(s) de règlement prévu(s)
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 14px 20px;">
                          <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                          >
                            ${paymentMethodsHtml}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 32px 16px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background: #f2f7fc;
                        border: 1px solid #d8e5f1;
                        border-radius: 12px;
                      "
                    >
                      <tr>
                        <td
                          valign="top"
                          style="
                            width: 24px;
                            padding: 16px 0 16px 18px;
                            color: #315f91;
                            font-weight: bold;
                          "
                        >
                          i
                        </td>

                        <td
                          style="
                            padding: 16px 18px 16px 10px;
                            font-size: 14px;
                            line-height: 21px;
                            color: #3d5268;
                          "
                        >
                          Le règlement n'est pas effectué en
                          ligne. Les règlements, chèques et
                          justificatifs liés aux aides ou
                          coupons sont à remettre directement
                          au club.<br><br>

                          Les chèques sont à établir à l'ordre
                          de <strong>« ASC EL CARINO »</strong>.
                          Les chèques vacances ne sont pas
                          acceptés.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 8px 32px 16px;">
                    <h2
                      style="
                        margin: 0 0 14px;
                        font-size: 19px;
                        line-height: 25px;
                        color: #1d2a36;
                      "
                    >
                      Informations pratiques
                    </h2>

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        border: 1px solid #dce3ec;
                        border-radius: 12px;
                        background: #ffffff;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 18px 20px;
                            font-size: 14px;
                            line-height: 22px;
                          "
                        >
                          <strong>Lieu des entraînements</strong>
                          <br>
                          Gymnase du Collège de l'Estaque<br>
                          348 rue Rabelais<br>
                          13016 Marseille

                          <div
                            style="
                              height: 1px;
                              background: #e4e9ef;
                              margin: 16px 0;
                            "
                          ></div>

                          <strong>Horaires</strong>

                          <ul
                            style="
                              margin: 10px 0 0;
                              padding-left: 20px;
                            "
                          >
                            <li style="margin-bottom: 6px;">
                              Mardi : 17h30 – 19h30 —
                              Adolescents / adultes
                            </li>
                            <li style="margin-bottom: 6px;">
                              Mercredi : 17h00 – 18h00 —
                              Enfants
                            </li>
                            <li style="margin-bottom: 6px;">
                              Mercredi : 18h30 – 20h00 —
                              Adultes (arrivée à 18h15)
                            </li>
                            <li>
                              Samedi : 10h00 – 12h00 —
                              Enfants / adolescents / adultes
                            </li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 32px 28px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        border: 1px solid #dce3ec;
                        border-radius: 12px;
                        background: #ffffff;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 16px 20px;
                            background: #fbfcfe;
                            border-bottom: 1px solid #e4e9ef;
                          "
                        >
                          <strong
                            style="
                              font-size: 16px;
                              color: #1d2a36;
                            "
                          >
                            Équipement obligatoire
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 16px 20px;
                            font-size: 14px;
                            line-height: 21px;
                          "
                        >
                          <ul
                            style="
                              margin: 0;
                              padding-left: 20px;
                            "
                          >
                            <li>Protège-dents</li>
                            <li>Coquille</li>
                            <li>Gants à velcro et bandes</li>
                            <li>Protège-tibias</li>
                            <li>
                              Protège-pieds Full-Contact en
                              mousse avec talon
                            </li>
                            <li>
                              Pantalon Full-Contact ou short
                              de Kick-Boxing
                            </li>
                            <li>
                              T-shirt de sport, de préférence
                              celui du club
                            </li>
                            <li>
                              Casque et plastron pour les
                              combats
                            </li>
                            <li>
                              Bouteille d'eau et serviette
                            </li>
                          </ul>

                          <p
                            style="
                              margin: 14px 0 0;
                              padding: 12px;
                              background: #fff8e6;
                              border-radius: 8px;
                              font-size: 13px;
                              line-height: 19px;
                              color: #65511d;
                            "
                          >
                            En cas de doute sur le matériel ou
                            les tailles, renseignez-vous auprès
                            du club avant votre achat.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 22px 32px;
                      background: #fbfcfe;
                      border-top: 1px solid #e4e9ef;
                      font-size: 13px;
                      line-height: 20px;
                      color: #6b7785;
                    "
                  >
                    Sportivement,<br>
                    <strong style="color: #263442;">
                      Le club El Carino
                    </strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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
