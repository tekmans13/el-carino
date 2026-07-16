import { useEffect, useState } from 'react';

const STORAGE_KEY = 'el-carino-registration';

const initialFormData = {
  ageCategory: '',
  practiceType: '',

  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',

  email: '',
  phone: '',

  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',

  emergencyContactName: '',
  emergencyContactPhone: '',

  legalRepresentativeName: '',
  legalRepresentativeEmail: '',
  legalRepresentativePhone: '',
};

/**
 * Charge les données précédemment sauvegardées.
 */
function loadStoredData() {
  try {
    const storedValue = sessionStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return initialFormData;
    }

    return {
      ...initialFormData,
      ...JSON.parse(storedValue),
    };
  } catch (error) {
    console.error(
      'Impossible de restaurer le formulaire :',
      error,
    );

    return initialFormData;
  }
}

export function useRegistrationForm() {
  const [formData, setFormData] = useState(loadStoredData);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(formData),
    );
  }, [formData]);

  function updateField(name, value) {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function resetForm() {
    sessionStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
  }

  return {
    formData,
    updateField,
    resetForm,
  };
}
