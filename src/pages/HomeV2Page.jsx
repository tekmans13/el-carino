import {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import { getClubSettings } from '../features/inscription/services/clubSettingsService';

import topImage from '../assets/home/top.webp';
import topMobileImage from '../assets/home/top-mobile.webp';
import logoMobileImage from '../assets/home/logo-el-carino-txt.webp';
import registrationButtonImage from '../assets/home/registration-button.webp';
import bottomImage from '../assets/home/bottom.webp';
import equipmentImage from '../assets/home/equipment/equipment.webp';

import '../features/home/home-v2.css';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 11h-5V11h3V6h2Z"
      />
    </svg>
  );
}


import { getClubDocumentPublicUrl } from '../features/admin/services/clubDocumentsService';

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 2h8l5 5v15H6Zm7 1.5V8h4.5ZM8 12v2h9v-2Zm0 4v2h9v-2Z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
      />
    </svg>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="home-v2-card-title">
      <span className="home-v2-card-icon">
        {icon}
      </span>

      <h2>{children}</h2>
    </div>
  );
}

export default function HomeV2Page() {
  const [registrationSeason, setRegistrationSeason] =
    useState('');

  useEffect(() => {
    let active = true;

    async function loadRegistrationSeason() {
      try {
        const settings = await getClubSettings();

        if (active) {
          setRegistrationSeason(
            settings.registration_season ?? '',
          );
        }
      } catch (error) {
        console.error(
          'Impossible de charger la saison des inscriptions :',
          error,
        );
      }
    }

    loadRegistrationSeason();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-v2">
      <h1 className="home-v2-seo-title">
        El Cariño Muay Thaï – Club de boxe à l'Estaque Marseille 13016
      </h1>

      <section className="home-v2-hero">
        <img
          src={topImage}
          alt="El Carino Muay Thaï Marseille"
          className="home-v2-hero-desktop"
        />

        <div className="home-v2-hero-mobile">
          <img
            src={topMobileImage}
            alt=""
            className="home-v2-hero-mobile-background"
          />

          <img
            src={logoMobileImage}
            alt="El Carino Muay Thaï"
            className="home-v2-hero-mobile-logo"
          />
        </div>

        <Link
          to="/inscription"
          className="home-v2-registration-link"
          aria-label={
            registrationSeason
              ? `S'inscrire pour la saison ${registrationSeason}`
              : "S'inscrire"
          }
        >
          <img
            src={registrationButtonImage}
            alt=""
            className="home-v2-registration-image"
          />

          {registrationSeason && (
            <strong>
              SAISON {registrationSeason}
            </strong>
          )}
        </Link>
      </section>

      <section className="home-v2-information">
        <article className="home-v2-card home-v2-facebook">
          <SectionTitle icon={<FacebookIcon />}>
            Nos dernières publications
          </SectionTitle>

          <div className="home-v2-facebook-feed">
            <iframe
              title="Publications Facebook El Carino Muay Thaï"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FEl-Cari%25C3%25B1o-Muay-Tha%25C3%25AF-100094125736093%2F&tabs=timeline&width=425&height=650&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="425"
              height="650"
              style={{
                border: 'none',
                overflow: 'hidden',
              }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </article>

        <article className="home-v2-card home-v2-association">
          <SectionTitle icon={<UsersIcon />}>
            L’association
          </SectionTitle>

          <div className="home-v2-card-body">
            <p>
              El Cariño est un club de Muay Thaï à l’Estaque,
              dans le 16e arrondissement de Marseille (13016).
              L’association accueille enfants, adolescents et
              adultes pour la pratique de la boxe thaïlandaise,
              de l’initiation et du loisir jusqu’à la compétition.
            </p>

            <p>
              Nous partageons des valeurs fortes :
              discipline, respect, honneur et plaisir de
              la pratique.
            </p>

            <ul className="home-v2-values">
              <li>Association loi 1901</li>
              <li>Affiliée FFKMDA</li>
              <li>Encadrement diplômé</li>
              <li>Cours tous niveaux</li>
              <li>Esprit famille et convivialité</li>
            </ul>

            <a
              className="home-v2-statutes"
              href={getClubDocumentPublicUrl(
                'statuts-el-carino.pdf',
              )}
              target="_blank"
              rel="noreferrer"
            >
              <DocumentIcon />
              <span>Statuts de l’association</span>
              <b>→</b>
            </a>
          </div>
        </article>

        <article className="home-v2-card home-v2-schedule">
          <SectionTitle icon={<ClockIcon />}>
            Horaires des séances
          </SectionTitle>

          <div className="home-v2-card-body">
            <div className="home-v2-session">
              <h3>ENFANTS</h3>

              <div>
                <span>Mercredi</span>
                <strong>17h00 – 18h00</strong>
              </div>

              <div>
                <span>Samedi</span>
                <strong>10h00 – 12h00</strong>
              </div>
            </div>

            <div className="home-v2-session">
              <h3>ADOS / ADULTES</h3>

              <div>
                <span>Mardi</span>
                <strong>17h30 – 19h30</strong>
              </div>

              <div>
                <span>Mercredi</span>
                <strong>18h30 – 20h00</strong>
              </div>

              <div>
                <span>Samedi</span>
                <strong>10h00 – 12h00</strong>
              </div>
            </div>

            <div className="home-v2-location-block">
              <div className="home-v2-location">
                <PinIcon />

                <div>
                  <strong>
                    Gymnase du Collège de l’Estaque
                  </strong>
                  <span>
                    348 Rue Rabelais — 13016 Marseille
                  </span>
                </div>
              </div>

              <div className="home-v2-map">
                <iframe
                  title="Gymnase du Collège de l’Estaque"
                  src="https://www.google.com/maps?q=348+Rue+Rabelais+13016+Marseille&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="home-v2-equipment">

        <img
          src={equipmentImage}
          alt="Équipement nécessaire pour la pratique du Muay Thaï"
        />
      </section>

      <footer className="home-v2-footer">
        <img
          src={bottomImage}
          alt="Muay Thaï Marseille - El Carino"
        />

        <div className="home-v2-footer-values">
          <span>DISCIPLINE</span>
          <b className="is-blue">★</b>
          <span>RESPECT</span>
          <b className="is-red">★</b>
          <span>HONNEUR</span>
        </div>
      </footer>
    </main>
  );
}
