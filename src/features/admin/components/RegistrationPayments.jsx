import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createRegistrationPayment,
  listRegistrationPayments,
} from '../services/paymentAdminService';

import '../admin-payments.css';

const PAYMENT_METHODS = [
  {
    value: 'cash',
    label: 'Espèces',
  },
  {
    value: 'check',
    label: 'Chèque',
  },
  {
    value: 'caf',
    label: 'Coupons CAF',
  },
  {
    value: 'cjeune',
    label: 'C-Jeune',
  },
  {
    value: 'pass_sport',
    label: 'Pass’Sport',
  },
];

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    now.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatAmount(
  amountCents,
  currency = 'eur',
) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(
    Number(amountCents ?? 0) / 100,
  );
}

function formatPaymentDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(date);
}

function getPaymentMethodLabel(value) {
  return (
    PAYMENT_METHODS.find(
      (method) => method.value === value,
    )?.label
    ?? value
    ?? '—'
  );
}

function getPaymentStatus(
  amountDueCents,
  amountReceivedCents,
) {
  if (amountReceivedCents <= 0) {
    return {
      value: 'unpaid',
      label: 'Non payé',
    };
  }

  if (
    amountReceivedCents < amountDueCents
  ) {
    return {
      value: 'partial',
      label: 'Partiellement payé',
    };
  }

  return {
    value: 'paid',
    label: 'Payé',
  };
}

export default function RegistrationPayments({
  registration,
}) {
  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [formError, setFormError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const [formVisible, setFormVisible] =
    useState(false);

  const [amount, setAmount] =
    useState('');

  const [paymentMethod, setPaymentMethod] =
    useState('cash');

  const [receivedDate, setReceivedDate] =
    useState(getTodayDate());

  const [note, setNote] =
    useState('');

  const amountDueCents =
    Number(
      registration?.payment_amount_cents
      ?? 0,
    );

  const currency =
    registration?.payment_currency
    ?? 'eur';

  const amountReceivedCents =
    useMemo(
      () =>
        payments.reduce(
          (total, payment) =>
            total
            + Number(
              payment.amount_cents
              ?? 0,
            ),
          0,
        ),
      [payments],
    );

  const remainingAmountCents =
    Math.max(
      amountDueCents
      - amountReceivedCents,
      0,
    );

  const paymentStatus =
    getPaymentStatus(
      amountDueCents,
      amountReceivedCents,
    );

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        setError('');

        const data =
          await listRegistrationPayments(
            registration.id,
          );

        if (active) {
          setPayments(data);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossible de charger les règlements.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, [registration.id]);

  function openPaymentForm() {
    setFormError('');
    setSuccessMessage('');

    if (
      remainingAmountCents > 0
    ) {
      setAmount(
        (
          remainingAmountCents / 100
        )
          .toFixed(2)
          .replace('.', ','),
      );
    } else {
      setAmount('');
    }

    setPaymentMethod('cash');
    setReceivedDate(getTodayDate());
    setNote('');
    setFormVisible(true);
  }

  function closePaymentForm() {
    if (saving) {
      return;
    }

    setFormVisible(false);
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError('');
      setSuccessMessage('');

      const normalizedAmount =
        amount
          .trim()
          .replace(',', '.');

      const amountNumber =
        Number(normalizedAmount);

      if (
        !Number.isFinite(amountNumber)
        || amountNumber <= 0
      ) {
        throw new Error(
          'Saisissez un montant valide supérieur à 0 €.',
        );
      }

      const amountCents =
        Math.round(
          amountNumber * 100,
        );

      const createdPayment =
        await createRegistrationPayment({
          registrationId:
            registration.id,
          amountCents,
          paymentMethod,
          receivedDate,
          note,
        });

      setPayments(
        (currentPayments) => [
          createdPayment,
          ...currentPayments,
        ],
      );

      setFormVisible(false);
      setAmount('');
      setNote('');

      setSuccessMessage(
        'Le règlement a bien été enregistré.',
      );
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : 'Impossible d’enregistrer le règlement.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-detail-card admin-detail-card-wide">
      <header>
        <span aria-hidden="true">
          8
        </span>

        <div>
          <h2>Paiement</h2>

          <p>
            Suivi des règlements reçus par le club.
          </p>
        </div>
      </header>

      <div className="admin-payment-content">
        <div className="admin-payment-summary">
          <article>
            <span>
              Montant à régler
            </span>

            <strong>
              {formatAmount(
                amountDueCents,
                currency,
              )}
            </strong>
          </article>

          <article>
            <span>
              Reçu
            </span>

            <strong>
              {formatAmount(
                amountReceivedCents,
                currency,
              )}
            </strong>
          </article>

          <article>
            <span>
              Reste à payer
            </span>

            <strong>
              {formatAmount(
                remainingAmountCents,
                currency,
              )}
            </strong>
          </article>

          <article>
            <span>
              État
            </span>

            <strong
              className={[
                'admin-payment-status',
                `is-${paymentStatus.value}`,
              ].join(' ')}
            >
              {paymentStatus.label}
            </strong>
          </article>
        </div>

        {successMessage && (
          <div
            className="admin-payment-message is-success"
            role="status"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="admin-payment-message is-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!formVisible && (
          <div className="admin-payment-actions">
            <button
              type="button"
              className="admin-payment-add-button"
              onClick={openPaymentForm}
            >
              + Ajouter un règlement
            </button>
          </div>
        )}

        {formVisible && (
          <form
            className="admin-payment-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-payment-form-header">
              <div>
                <h3>
                  Ajouter un règlement
                </h3>

                <p>
                  Enregistrez uniquement un règlement
                  réellement reçu par le club.
                </p>
              </div>
            </div>

            <div className="admin-payment-form-grid">
              <div className="admin-payment-field">
                <label htmlFor="payment-amount">
                  Montant reçu
                </label>

                <div className="admin-payment-amount-input">
                  <input
                    id="payment-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    placeholder="150,00"
                    onChange={(event) =>
                      setAmount(
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    required
                  />

                  <span>
                    €
                  </span>
                </div>
              </div>

              <div className="admin-payment-field">
                <label htmlFor="payment-method">
                  Moyen de règlement
                </label>

                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                >
                  {PAYMENT_METHODS.map(
                    (method) => (
                      <option
                        key={method.value}
                        value={method.value}
                      >
                        {method.label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="admin-payment-field">
                <label htmlFor="payment-date">
                  Date de réception
                </label>

                <input
                  id="payment-date"
                  type="date"
                  value={receivedDate}
                  onChange={(event) =>
                    setReceivedDate(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                  required
                />
              </div>

              <div className="admin-payment-field admin-payment-field-wide">
                <label htmlFor="payment-note">
                  Note
                  {' '}
                  <span>
                    facultative
                  </span>
                </label>

                <textarea
                  id="payment-note"
                  value={note}
                  rows="3"
                  placeholder="Ex. chèque n°123456, première échéance…"
                  onChange={(event) =>
                    setNote(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                />
              </div>
            </div>

            {formError && (
              <div
                className="admin-payment-message is-error"
                role="alert"
              >
                {formError}
              </div>
            )}

            <div className="admin-payment-form-actions">
              <button
                type="button"
                className="admin-payment-cancel-button"
                onClick={closePaymentForm}
                disabled={saving}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="admin-payment-save-button"
                disabled={saving}
              >
                {saving
                  ? 'Enregistrement…'
                  : 'Enregistrer le règlement'}
              </button>
            </div>
          </form>
        )}

        <section className="admin-payment-history">
          <div className="admin-payment-history-header">
            <div>
              <h3>
                Historique des règlements
              </h3>

              <p>
                {payments.length === 0
                  ? 'Aucun règlement enregistré.'
                  : `${payments.length} règlement${payments.length > 1 ? 's' : ''} enregistré${payments.length > 1 ? 's' : ''}.`}
              </p>
            </div>
          </div>

          {loading && (
            <div className="admin-payment-loading">
              <span className="admin-loader" />

              <p>
                Chargement des règlements…
              </p>
            </div>
          )}

          {!loading
            && !error
            && payments.length === 0 && (
              <div className="admin-payment-empty">
                Aucun règlement n’a encore été reçu.
              </div>
          )}

          {!loading
            && payments.length > 0 && (
              <div className="admin-payment-table-wrapper">
                <table className="admin-payment-table">
                  <thead>
                    <tr>
                      <th>
                        Date
                      </th>

                      <th>
                        Moyen
                      </th>

                      <th>
                        Note
                      </th>

                      <th>
                        Montant
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map(
                      (payment) => (
                        <tr key={payment.id}>
                          <td>
                            {formatPaymentDate(
                              payment.received_at,
                            )}
                          </td>

                          <td>
                            {getPaymentMethodLabel(
                              payment.payment_method,
                            )}
                          </td>

                          <td>
                            {payment.note || '—'}
                          </td>

                          <td>
                            <strong>
                              {formatAmount(
                                payment.amount_cents,
                                currency,
                              )}
                            </strong>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
          )}
        </section>
      </div>
    </section>
  );
}
