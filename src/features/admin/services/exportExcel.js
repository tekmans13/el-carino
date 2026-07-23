import * as XLSX from 'xlsx';

const STATUS_LABELS = {
  soumis: 'Soumis',
  incomplet: 'Incomplet',
  complement_demande: 'Complément demandé',
  valide: 'Validé',
  en_attente_paiement: 'En attente de paiement',
  paye: 'Payé',
  refuse: 'Refusé',
  annule: 'Annulé',
};

const PAYMENT_STATUS_LABELS = {
  non_requis: 'Non requis',
  en_attente: 'En attente',
  paye: 'Payé',
  echoue: 'Échoué',
  annule: 'Annulé',
};

function formatDate(value, withTime = false) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const options = withTime
    ? {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    : {
        dateStyle: 'short',
      };

  return new Intl.DateTimeFormat(
    'fr-FR',
    options,
  ).format(date);
}

function formatBoolean(value) {
  if (value === true) {
    return 'Oui';
  }

  if (value === false) {
    return 'Non';
  }

  return '';
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status ?? '';
}

function getPaymentStatusLabel(status) {
  return PAYMENT_STATUS_LABELS[status] ?? status ?? '';
}

function hasMedicalCertificate(registration) {
  return Boolean(
    registration.medical_certificate_storage_path
    || registration.medical_certificate_filename
    || registration.medical_certificate_uploaded_at,
  );
}

function createExportRows(registrations) {
  return registrations.map((registration) => ({
    'Date inscription': formatDate(
      registration.created_at,
      true,
    ),

    Statut: getStatusLabel(registration.status),

    Nom: registration.last_name ?? '',
    Prénom: registration.first_name ?? '',
    Sexe: registration.gender ?? '',
    'Date de naissance': formatDate(
      registration.birth_date,
    ),

    Profil: registration.age_category ?? '',
    Pratique: registration.practice_type ?? '',

    Email: registration.email ?? '',
    Téléphone: registration.phone ?? '',

    Adresse: registration.address_line1 ?? '',
    'Complément adresse':
      registration.address_line2 ?? '',
    'Code postal': registration.postal_code ?? '',
    Ville: registration.city ?? '',

    'Contact urgence':
      registration.emergency_contact_name ?? '',
    'Téléphone urgence':
      registration.emergency_contact_phone ?? '',

    'Représentant légal':
      registration.legal_representative_name ?? '',
    'Email représentant légal':
      registration.legal_representative_email ?? '',
    'Téléphone représentant légal':
      registration.legal_representative_phone ?? '',

    'Questionnaire santé complété':
      formatBoolean(
        registration.health_questionnaire_completed,
      ),

    'Réponse positive questionnaire':
      formatBoolean(
        registration
          .health_questionnaire_has_positive_answer,
      ),

    'Certificat requis':
      formatBoolean(
        registration.medical_certificate_required,
      ),

    'Certificat fourni':
      formatBoolean(
        hasMedicalCertificate(registration),
      ),

    'Nom du certificat':
      registration.medical_certificate_filename ?? '',

    'Autorisation parentale':
      formatBoolean(
        registration.parental_authorization,
      ),

    'Droit à l’image':
      formatBoolean(registration.image_consent),

    Paiement: getPaymentStatusLabel(
      registration.payment_status,
    ),
  }));
}

function createFilename() {
  const date = new Intl.DateTimeFormat('fr-CA').format(
    new Date(),
  );

  return `inscriptions-el-carino-${date}.xlsx`;
}

export function exportRegistrationsToExcel(
  registrations,
) {
  if (!Array.isArray(registrations)) {
    throw new Error(
      'La liste des inscriptions à exporter est invalide.',
    );
  }

  if (registrations.length === 0) {
    throw new Error(
      'Aucune inscription disponible pour l’export.',
    );
  }

  const rows = createExportRows(registrations);
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 22 },

    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 18 },

    { wch: 18 },
    { wch: 22 },

    { wch: 32 },
    { wch: 18 },

    { wch: 32 },
    { wch: 24 },
    { wch: 14 },
    { wch: 20 },

    { wch: 28 },
    { wch: 20 },

    { wch: 28 },
    { wch: 32 },
    { wch: 22 },

    { wch: 26 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 30 },
    { wch: 24 },
    { wch: 18 },
    { wch: 20 },
  ];

  worksheet['!autofilter'] = {
    ref: worksheet['!ref'],
  };

  worksheet['!freeze'] = {
    xSplit: 0,
    ySplit: 1,
  };

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Inscriptions',
  );

  XLSX.writeFile(workbook, createFilename());
}
