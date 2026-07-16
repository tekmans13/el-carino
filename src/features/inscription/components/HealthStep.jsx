import { useMemo, useState } from 'react';

const HEALTH_QUESTIONS = [
  {
    id: 'hospital',
    group: 'Depuis l’année dernière',
    label:
      'Es-tu allé(e) à l’hôpital pendant toute une journée ou plusieurs jours ?',
  },
  {
    id: 'operation',
    group: 'Depuis l’année dernière',
    label: 'As-tu été opéré(e) ?',
  },
  {
    id: 'growth',
    group: 'Depuis l’année dernière',
    label: 'As-tu beaucoup plus grandi que les autres années ?',
  },
  {
    id: 'weight',
    group: 'Depuis l’année dernière',
    label: 'As-tu beaucoup maigri ou grossi ?',
  },
  {
    id: 'dizziness',
    group: 'Depuis l’année dernière',
    label: 'As-tu eu la tête qui tourne pendant un effort ?',
  },
  {
    id: 'lossOfConsciousness',
    group: 'Depuis l’année dernière',
    label:
      'As-tu perdu connaissance ou es-tu tombé sans te souvenir de ce qui s’était passé ?',
  },
  {
    id: 'violentShock',
    group: 'Depuis l’année dernière',
    label:
      'As-tu reçu un ou plusieurs chocs violents qui t’ont obligé à interrompre un moment une séance de sport ?',
  },
  {
    id: 'breathingDuringExercise',
    group: 'Depuis l’année dernière',
    label:
      'As-tu eu beaucoup de mal à respirer pendant un effort par rapport à d’habitude ?',
  },
  {
    id: 'breathingAfterExercise',
    group: 'Depuis l’année dernière',
    label: 'As-tu eu beaucoup de mal à respirer après un effort ?',
  },
  {
    id: 'chestPain',
    group: 'Depuis l’année dernière',
    label:
      'As-tu eu mal dans la poitrine ou des palpitations, avec le cœur qui bat très vite ?',
  },
  {
    id: 'newMedication',
    group: 'Depuis l’année dernière',
    label:
      'As-tu commencé à prendre un nouveau médicament tous les jours et pour longtemps ?',
  },
  {
    id: 'sportStopped',
    group: 'Depuis l’année dernière',
    label:
      'As-tu arrêté le sport à cause d’un problème de santé pendant un mois ou plus ?',
  },
  {
    id: 'tiredness',
    group: 'Depuis plus de deux semaines',
    label: 'Te sens-tu très fatigué(e) ?',
  },
  {
    id: 'sleep',
    group: 'Depuis plus de deux semaines',
    label:
      'As-tu du mal à t’endormir ou te réveilles-tu souvent dans la nuit ?',
  },
  {
    id: 'appetite',
    group: 'Depuis plus de deux semaines',
    label: 'Sens-tu que tu as moins faim ou que tu manges moins ?',
  },
  {
    id: 'sadness',
    group: 'Depuis plus de deux semaines',
    label: 'Te sens-tu triste ou inquiet ?',
  },
  {
    id: 'crying',
    group: 'Depuis plus de deux semaines',
    label: 'Pleures-tu plus souvent ?',
  },
  {
    id: 'injury',
    group: 'Depuis plus de deux semaines',
    label:
      'Ressens-tu une douleur ou un manque de force à cause d’une blessure que tu t’es faite cette année ?',
  },
  {
    id: 'stopSport',
    group: 'Aujourd’hui',
    label:
      'Penses-tu quelquefois à arrêter de faire du sport ou à changer de sport ?',
  },
  {
    id: 'seeDoctor',
    group: 'Aujourd’hui',
    label:
      'Penses-tu avoir besoin de voir ton médecin pour continuer le sport ?',
  },
  {
    id: 'otherHealthConcern',
    group: 'Aujourd’hui',
    label:
      'Souhaites-tu signaler quelque chose de plus concernant ta santé ?',
  },
  {
    id: 'familyHeartDisease',
    group: 'Questions destinées aux parents',
    label:
      'Quelqu’un dans votre famille proche a-t-il eu une maladie grave du cœur ou du cerveau, ou est-il décédé subitement avant l’âge de 50 ans ?',
  },
  {
    id: 'parentWeightConcern',
    group: 'Questions destinées aux parents',
    label:
      'Êtes-vous inquiet pour son poids ? Trouvez-vous qu’il se nourrit trop ou pas assez ?',
  },
  {
    id: 'missedHealthExam',
    group: 'Questions destinées aux parents',
    label:
      'Avez-vous manqué l’examen de santé prévu à l’âge de votre enfant chez le médecin ?',
  },
];

function Question({
  question,
  answer,
  onAnswer,
}) {
  return (
    <fieldset className="health-question">
      <legend>{question.label}</legend>

      <div className="health-answer-options">
        <label
          className={
            answer === 'non'
              ? 'health-answer selected'
              : 'health-answer'
          }
        >
          <input
            type="radio"
            name={`health-${question.id}`}
            value="non"
            checked={answer === 'non'}
            onChange={() => onAnswer(question.id, 'non')}
          />

          <span>Non</span>
        </label>

        <label
          className={
            answer === 'oui'
              ? 'health-answer selected health-answer-warning'
              : 'health-answer'
          }
        >
          <input
            type="radio"
            name={`health-${question.id}`}
            value="oui"
            checked={answer === 'oui'}
            onChange={() => onAnswer(question.id, 'oui')}
          />

          <span>Oui</span>
        </label>
      </div>
    </fieldset>
  );
}

export default function HealthStep({
  formData,
  updateField,
  updateHealthAnswer,
  onPrevious,
  onNext,
}) {
  const [medicalCertificate, setMedicalCertificate] =
    useState(null);

  const [errors, setErrors] = useState({});

  const answeredQuestions = Object.keys(
    formData.healthAnswers,
  ).filter((questionId) => {
    const answer = formData.healthAnswers[questionId];

    return answer === 'oui' || answer === 'non';
  }).length;

  const allQuestionsAnswered =
    answeredQuestions === HEALTH_QUESTIONS.length;

  const requiresMedicalCertificate = useMemo(
    () =>
      Object.values(formData.healthAnswers).includes('oui'),
    [formData.healthAnswers],
  );

  const groupedQuestions = HEALTH_QUESTIONS.reduce(
    (groups, question) => {
      if (!groups[question.group]) {
        groups[question.group] = [];
      }

      groups[question.group].push(question);

      return groups;
    },
    {},
  );

  function handleCertificateChange(event) {
    const file = event.target.files?.[0] ?? null;

    setMedicalCertificate(file);

    setErrors((currentErrors) => ({
      ...currentErrors,
      medicalCertificate: undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};

    if (!allQuestionsAnswered) {
      validationErrors.questionnaire =
        'Répondez à toutes les questions du questionnaire.';
    }

    if (!formData.healthAttestationAccepted) {
      validationErrors.healthAttestationAccepted =
        'L’attestation du questionnaire doit être acceptée.';
    }

    if (
      requiresMedicalCertificate
      && !medicalCertificate
    ) {
      validationErrors.medicalCertificate =
        'Un certificat médical est obligatoire lorsqu’au moins une réponse est Oui.';
    }

    if (
      formData.ageCategory === 'enfant'
      && !formData.parentalAuthorization
    ) {
      validationErrors.parentalAuthorization =
        'L’autorisation parentale est obligatoire.';
    }

    if (!formData.imageConsent) {
      validationErrors.imageConsent =
        'Indiquez votre choix concernant le droit à l’image.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      updateField(
        'healthQuestionnaireCompleted',
        true,
      );

      updateField(
        'healthQuestionnaireHasPositiveAnswer',
        requiresMedicalCertificate,
      );

      onNext({
        medicalCertificate,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <header>
        <h2>Santé et autorisations</h2>

        <p>
          Ce questionnaire doit être complété avec
          l’enfant et sous la responsabilité de son
          représentant légal.
        </p>

        <p>
          Répondez par Oui ou Non. Il n’existe pas de
          bonne ou de mauvaise réponse.
        </p>
      </header>

      <div className="health-progress">
        <strong>
          {answeredQuestions} question
          {answeredQuestions > 1 ? 's' : ''} sur{' '}
          {HEALTH_QUESTIONS.length}
        </strong>
      </div>

      {errors.questionnaire && (
        <p role="alert">
          {errors.questionnaire}
        </p>
      )}

      {Object.entries(groupedQuestions).map(
        ([groupName, questions]) => (
          <section
            key={groupName}
            className="health-question-group"
          >
            <h3>{groupName}</h3>

            {questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                answer={
                  formData.healthAnswers[question.id]
                }
                onAnswer={updateHealthAnswer}
              />
            ))}
          </section>
        ),
      )}

      {requiresMedicalCertificate ? (
        <section className="medical-result medical-result-warning">
          <h3>Consultation médicale nécessaire</h3>

          <p>
            Au moins une réponse est positive. Vous devez
            consulter un médecin et fournir un certificat
            médical de non-contre-indication à la pratique
            concernée.
          </p>

          <label htmlFor="medicalCertificate">
            Certificat médical
          </label>

          <input
            id="medicalCertificate"
            name="medicalCertificate"
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={handleCertificateChange}
          />

          <p>
            Formats acceptés : PDF, JPEG, PNG ou WebP.
          </p>

          {medicalCertificate && (
            <p>
              Fichier sélectionné :{' '}
              <strong>
                {medicalCertificate.name}
              </strong>
            </p>
          )}

          {errors.medicalCertificate && (
            <p role="alert">
              {errors.medicalCertificate}
            </p>
          )}
        </section>
      ) : (
        allQuestionsAnswered && (
          <section className="medical-result medical-result-success">
            <h3>Aucun certificat médical demandé</h3>

            <p>
              Toutes les réponses sont négatives. Vous
              pourrez fournir l’attestation du questionnaire
              signée par le représentant légal.
            </p>
          </section>
        )
      )}

      <fieldset>
        <legend>Attestation de santé</legend>

        <label>
          <input
            type="checkbox"
            checked={
              formData.healthAttestationAccepted
            }
            onChange={(event) =>
              updateField(
                'healthAttestationAccepted',
                event.target.checked,
              )
            }
          />

          Je certifie que les réponses données au
          questionnaire sont exactes.
        </label>

        {errors.healthAttestationAccepted && (
          <p role="alert">
            {errors.healthAttestationAccepted}
          </p>
        )}
      </fieldset>

      {formData.ageCategory === 'enfant' && (
        <fieldset>
          <legend>Autorisation parentale</legend>

          <label>
            <input
              type="checkbox"
              checked={formData.parentalAuthorization}
              onChange={(event) =>
                updateField(
                  'parentalAuthorization',
                  event.target.checked,
                )
              }
            />

            En qualité de représentant légal, j’autorise
            la pratique sportive ainsi que les soins
            nécessaires en cas d’urgence.
          </label>

          {errors.parentalAuthorization && (
            <p role="alert">
              {errors.parentalAuthorization}
            </p>
          )}
        </fieldset>
      )}

      <fieldset>
        <legend>Droit à l’image</legend>

        <p>
          Autorisez-vous le club à utiliser des photos
          prises dans le cadre de ses activités ?
        </p>

        <label>
          <input
            type="radio"
            name="imageConsent"
            value="accepted"
            checked={
              formData.imageConsent === 'accepted'
            }
            onChange={(event) =>
              updateField(
                'imageConsent',
                event.target.value,
              )
            }
          />

          J’accepte
        </label>

        <label>
          <input
            type="radio"
            name="imageConsent"
            value="refused"
            checked={
              formData.imageConsent === 'refused'
            }
            onChange={(event) =>
              updateField(
                'imageConsent',
                event.target.value,
              )
            }
          />

          Je refuse
        </label>

        {errors.imageConsent && (
          <p role="alert">
            {errors.imageConsent}
          </p>
        )}
      </fieldset>

      <div className="form-actions">
        <button
          type="button"
          onClick={onPrevious}
        >
          Retour
        </button>

        <button type="submit">
          Continuer vers le paiement
        </button>
      </div>
    </form>
  );
}
