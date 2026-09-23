import { supabase } from '../../../services/supabase';

const BUCKET_NAME = 'club-documents';

export const CLUB_DOCUMENTS = {
  statutes: {
    label: "Statuts de l'association",
    storagePath: 'statuts-el-carino.pdf',
  },
};

export function getClubDocumentPublicUrl(storagePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function uploadClubDocument(storagePath, file) {
  if (!file) {
    throw new Error('Aucun fichier sélectionné.');
  }

  if (
    file.type !== 'application/pdf'
    && !file.name.toLowerCase().endsWith('.pdf')
  ) {
    throw new Error('Le document doit être un fichier PDF.');
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      contentType: 'application/pdf',
      upsert: true,
      cacheControl: '0',
    });

  if (error) {
    throw new Error(
      `Impossible d’envoyer le document : ${error.message}`,
    );
  }

  return getClubDocumentPublicUrl(storagePath);
}
