import { supabase } from '../../../services/supabase';

export async function getAdminUsers() {
  const { data, error } = await supabase.functions.invoke(
    'list-admin-users',
  );

  if (error) {
    throw new Error(
      `Impossible de charger les utilisateurs : ${error.message}`,
    );
  }

  return data?.users ?? [];
}

export async function createAdminUser({
  firstName,
  lastName,
  email,
  password,
}) {
  const { data, error } = await supabase.functions.invoke(
    'create-admin-user',
    {
      body: {
        firstName,
        lastName,
        email,
        password,
      },
    },
  );

  if (error) {
    throw new Error(
      `Impossible de créer l'utilisateur : ${error.message}`,
    );
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.user;
}
export async function deleteAdminUser(userId) {
  const { data, error } = await supabase.functions.invoke(
    'delete-admin-user',
    {
      body: {
        userId,
      },
    },
  );

  if (error) {
    throw new Error(
      `Impossible de supprimer l'utilisateur : ${error.message}`,
    );
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return true;
}
