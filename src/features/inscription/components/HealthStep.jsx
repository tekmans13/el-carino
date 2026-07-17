import { useMemo, useState } from 'react';

import './health-step.css';

const HEALTH_QUESTIONS = [
  {
    id: 'hospital',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'Es-tu allé(e) à l’hôpital pendant toute une journée ou plusieurs jours ?',
  },
  {
    id: 'operation',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label: 'As-tu été opéré(e) ?',
  },
  {
    id: 'growth',
    group: 'Depuis l’année dernière',
    audience: 'child',
    label: 'As-tu beaucoup plus grandi que les autres années ?',
  },
  {
    id: 'weight',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label: 'As-tu beaucoup maigri ou grossi ?',
  },
  {
    id: 'dizziness',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label: 'As-tu eu la tête qui tourne pendant un effort ?',
  },
  {
    id: 'lossOfConsciousness',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu perdu connaissance ou es-tu tombé sans te souvenir de ce qui s’était passé ?',
  },
  {
    id: 'violentShock',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu reçu un choc violent qui t’a obligé à interrompre une séance de sport ?',
  },
  {
    id: 'breathingDuringExercise',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu eu beaucoup de mal à respirer pendant un effort ?',
  },
  {
    id: 'breathingAfterExercise',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu eu beaucoup de mal à respirer après un effort ?',
  },
  {
    id: 'chestPain',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu eu mal dans la poitrine ou des palpitations ?',
  },
  {
    id: 'newMedication',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu commencé à prendre un nouveau médicament tous les jours et pour longtemps ?',
  },
  {
    id: 'sportStopped',
    group: 'Depuis l’année dernière',
    audience: 'all',
    label:
      'As-tu arrêté le sport à cause d’un problème de santé pendant un mois ou plus ?',
  },
  {
    id: 'tiredness',
    group: 'Depuis plus de deux semaines',
    audience: 'all',
    label: 'Te sens-tu très fatigué(e) ?',
  },
  {
    id: 'sleep',
    group: 'Depuis plus de deux semaines',
    audience: 'all',
    label:
      'As-tu du mal à t’endormir ou te réveilles-tu souvent la nuit ?',
  },
  {
    id: 'appetite',
    group: 'Depuis plus de deux semaines',
    audience: 'all',
    label: 'As-tu moins faim ou manges-tu moins ?',
  },
  {
    id: 'sadness',
    group: 'Depuis plus de deux semaines',
    audience: 'all',
    label: 'Te sens-tu triste ou inquiet ?',
  },
  {
    id: 'crying',
    group: 'Depuis plus de deux semaines',
    audience: 'child',
    label: 'Pleures-tu plus souvent ?',
  },
  {
    id: 'injury',
    group: 'Depuis plus de deux semaines',
    audience: 'all',
    label:
      'Ressens-tu une douleur ou un manque de force à cause d’une blessure ?',
  },
  {
    id: 'stopSport',
    group: 'Aujourd’hui',
    audience: 'all',
    label:
      'Penses-tu quelquefois à arrêter ou à changer de sport ?',
  },
  {
    id: 'seeDoctor',
    group: 'Aujourd’hui',
    audience: 'all',
    label:
      'Penses-tu avoir besoin de voir ton médecin pour continuer le sport ?',
  },
  {
    id: 'otherHealthConcern',
    group: 'Aujourd’hui',
    audience: 'all',
    label:
      'Souhaites-tu signaler autre chose concernant ta santé ?',
  },
  {
    id: 'familyHeartDisease',
    group: 'Questions destinées aux parents',
    audience: 'parent',
    label:
      'Un membre de la famille proche a-t-il eu une maladie grave du cœur ou est-il décédé subitement avant 50 ans ?',
  },
  {
    id: 'parentWeightConcern',
    group: 'Questions destinées aux parents',
    audience: 'parent',
    label:
      'Êtes-vous inquiet concernant son poids ou son alimentation ?',
  },
  {
    id: 'missedHealthExam',
    group: 'Questions destinées aux parents',
    audience: 'parent',
    label:
      'L’examen de santé prévu pour son âge a-t-il été manqué ?',
  },
];

function Question({ question, answer, onAnswer }) {
  return (
    <article className="health-question">
      <p className="health-question-label">
        {question.label}
      </p>

      <div className="health-answer-options">
        <label
          className={
            answer === 'non'
              ? 'health-answer-card selected'
              : 'health-answer-card'
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
              ? 'health-answer-card selected warning'
              : 'health-answer-card'
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
    </article>
  );
}

function MedicalCertificateUpload({
  file,
  error,
  onChange,
  mandatoryReason,
}) {
  return (
    <section className="health-panel health-panel-warning">
      <div className="health-panel-header">
        <span className="health-panel-icon" aria-hidden="true">
          !
        </span>

        <div>
          <h3>Certificat médical obligatoire</h3>
          <p>{mandatoryReason}</p>
        </div>
      </div>

      <label
        className="medical-upload"
        htmlFor="medicalCertificate"
      >
        <strong>Choisir le certificat médical</strong>

        <span>
          Formats acceptés : PDF, JPEG, PNG ou WebP
        </span>

        {file && (
          <span className="medical-upload-file">
            Fichier sélectionné : {file.name}
          </span>
        )}
      </label>

      <input
        id="medicalCertificate"
        name="medicalCertificate"
        className="medical-upload-input"
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={onChange}
      />

      {error && <p role="alert">{error}</p>}
    </section>
  );
}

export default function HealthStep({
  formData,
  updateField,
  updateHealthAnswer,
  medicalCertificate,
  onMedicalCertificateChange,
  onPrevious,
  onNext,
}) {
  const [errors, setErrors] = useState({});

  const isAdultCompetition =
    formData.ageCategory === 'adulte'
    && formData.practiceType === 'competition';

  const questionnaireRequired = !isAdultCompetition;

  const applicableQuestions = useMemo(
    () =>
      HEALTH_QUESTIONS.filter((question) => {
        if (formData.ageCategory === 'enfant') {
          return (
            question.audience === 'all'
            || question.audience === 'child'
            || question.audience === 'parent'
          );
        }

        return question.audience === 'all';
      }),
    [formData.ageCategory],
  );

  const answeredQuestions = applicableQuestions.filter(
    (question) => {
      const answer = formData.healthAnswers[question.id];

      return answer === 'oui' || answer === 'non';
    },
  ).length;

  const allQuestionsAnswered =
    answeredQuestions === applicableQuestions.length;

  const hasPositiveAnswer = useMemo(
    () =>
      applicableQuestions.some(
        (question) =>
          formData.healthAnswers[question.id] === 'oui',
      ),
    [applicableQuestions, formData.healthAnswers],
  );

  const certificateRequired =
    isAdultCompetition || hasPositiveAnswer;

  const groupedQuestions = useMemo(
    () =>
      applicableQuestions.reduce((groups, question) => {
        if (!groups[question.group]) {
          groups[question.group] = [];
        }

        groups[question.group].push(question);

        return groups;
      }, {}),
    [applicableQuestions],
  );

  function handleCertificateChange(event) {
    const file = event.target.files?.[0] ?? null;

    onMedicalCertificateChange(file);

    setErrors((currentErrors) => ({
      ...currentErrors,
      medicalCertificate: undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};

    if (questionnaireRequired && !allQuestionsAnswered) {
      validationErrors.questionnaire =
        'Répondez à toutes les questions du questionnaire.';
    }

    if (
      questionnaireRequired
      && !formData.healthAttestationAccepted
    ) {
      validationErrors.healthAttestationAccepted =
        'Vous devez valider l’attestation de santé.';
    }

    if (certificateRequired && !medicalCertificate) {
      validationErrors.medicalCertificate =
        'Le certificat médical est obligatoire pour poursuivre.';
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

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    updateField(
      'healthQuestionnaireCompleted',
      questionnaireRequired
        ? allQuestionsAnswered
        : false,
    );

    updateField(
      'healthQuestionnaireHasPositiveAnswer',
      questionnaireRequired
        ? hasPositiveAnswer
        : false,
    );

    onNext();
  }

  return (
    <form
      className="health-step"
      onSubmit={handleSubmit}
      noValidate
    >
      <header className="health-step-header">
        <h2>Santé et autorisations</h2>

        {isAdultCompetition ? (
          <p>
            Pour un adulte inscrit en compétition, le
            certificat médical est obligatoire.
          </p>
        ) : (
          <p>
            Complétez le questionnaire de santé. Une seule
            réponse positive rendra le certificat médical
            obligatoire.
          </p>
        )}
      </header>

      {isAdultCompetition && (
        <section className="health-panel health-panel-information">
          <div className="health-panel-header">
            <span
              className="health-panel-icon"
              aria-hidden="true"
            >
              i
            </span>

            <div>
              <h3>Questionnaire non requis</h3>

              <p>
                Votre profil est Adulte – Compétition.
                Passez directement au dépôt du certificat
                médical.
              </p>
            </div>
          </div>
        </section>
      )}

      {questionnaireRequired && (
        <>
          <div className="health-questionnaire-progress">
            <span>Questionnaire de santé</span>

            <strong>
              {answeredQuestions} / {applicableQuestions.length}
            </strong>
          </div>

          {errors.questionnaire && (
            <p role="alert">{errors.questionnaire}</p>
          )}

          {Object.entries(groupedQuestions).map(
            ([groupName, questions]) => (
              <section
                key={groupName}
                className="health-question-group"
              >
                <h3>{groupName}</h3>

                <div className="health-question-list">
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
                </div>
              </section>
            ),
          )}

          {allQuestionsAnswered && !hasPositiveAnswer && (
            <section className="health-panel health-panel-success">
              <div className="health-panel-header">
                <span
                  className="health-panel-icon"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <div>
                  <h3>Aucun certificat médical demandé</h3>

                  <p>
                    Toutes les réponses sont négatives.
                    L’attestation de santé suffit pour ce
                    profil.
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {certificateRequired && (
        <MedicalCertificateUpload
          file={medicalCertificate}
          error={errors.medicalCertificate}
          onChange={handleCertificateChange}
          mandatoryReason={
            isAdultCompetition
              ? 'Le questionnaire n’est pas requis pour ce profil. Fournissez un certificat médical de non-contre-indication à la pratique en compétition.'
              : 'Au moins une réponse au questionnaire est positive. Une consultation médicale est nécessaire.'
          }
        />
      )}

      {questionnaireRequired && (
        <fieldset className="health-authorization">
          <legend>Attestation de santé</legend>

          <label className="health-checkbox">
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

            <span>
              Je certifie que les réponses données au
              questionnaire sont exactes.
            </span>
          </label>

          {errors.healthAttestationAccepted && (
            <p role="alert">
              {errors.healthAttestationAccepted}
            </p>
          )}
        </fieldset>
      )}

      {formData.ageCategory === 'enfant' && (
        <fieldset className="health-authorization">
          <legend>Autorisation parentale</legend>

          <label className="health-checkbox">
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

            <span>
              En qualité de représentant légal, j’autorise
              la pratique sportive ainsi que les soins
              nécessaires en cas d’urgence.
            </span>
          </label>

          {errors.parentalAuthorization && (
            <p role="alert">
              {errors.parentalAuthorization}
            </p>
          )}
        </fieldset>
      )}

      <fieldset className="health-authorization">
        <legend>Droit à l’image</legend>

        <p>
          Autorisez-vous le club à utiliser des photos
          prises dans le cadre de ses activités ?
        </p>

        <div className="health-consent-options">
          <label
            className={
              formData.imageConsent === 'accepted'
                ? 'health-consent-card selected'
                : 'health-consent-card'
            }
          >
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

            <span>J’accepte</span>
          </label>

          <label
            className={
              formData.imageConsent === 'refused'
                ? 'health-consent-card selected'
                : 'health-consent-card'
            }
          >
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

            <span>Je refuse</span>
          </label>
        </div>

        {errors.imageConsent && (
          <p role="alert">{errors.imageConsent}</p>
        )}
      </fieldset>

      <div className="form-actions">
        <button type="button" onClick={onPrevious}>
          Retour
        </button>

        <button type="submit">
          Continuer vers le paiement
        </button>
      </div>
    </form>
  );
}
