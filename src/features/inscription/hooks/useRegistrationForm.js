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

  healthAnswers: {},
  healthQuestionnaireCompleted: false,
  healthQuestionnaireHasPositiveAnswer: false,
  healthAttestationAccepted: false,

  parentalAuthorization: false,
  imageConsent: '',
};

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

  function updateHealthAnswer(questionId, value) {
    setFormData((currentData) => {
      const healthAnswers = {
        ...currentData.healthAnswers,
        [questionId]: value,
      };

      const answers = Object.values(healthAnswers);

      return {
        ...currentData,
        healthAnswers,
        healthQuestionnaireCompleted:
          answers.length > 0
          && answers.every(
            (answer) => answer === 'oui' || answer === 'non',
          ),
        healthQuestionnaireHasPositiveAnswer:
          answers.includes('oui'),
      };
    });
  }

  function resetForm() {
    sessionStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
  }

  return {
    formData,
    updateField,
    updateHealthAnswer,
    resetForm,
  };
}
