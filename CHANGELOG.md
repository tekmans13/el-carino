# Changelog

Toutes les évolutions importantes du projet El Carino sont documentées dans ce fichier.

Le format est inspiré de Keep a Changelog :
https://keepachangelog.com/fr/1.1.0/

Le projet suit le versionnement sémantique :
https://semver.org/lang/fr/

---

## [0.9.0] - 2026-09-23

### Site public

- Nouvelle page d'accueil mise en production
- Présentation du club, horaires, lieu et équipements
- Intégration du flux Facebook
- Accès au formulaire d'inscription
- Saison d'inscription dynamique
- Accès aux statuts de l'association
- Interface responsive desktop et mobile

### Référencement

- Optimisation du titre et de la description
- URL canonique
- Métadonnées Open Graph
- robots.txt et sitemap.xml
- Données structurées SportsClub
- Image publique pour les données structurées
- Déclaration dans Google Search Console

### Inscription

- Gestion du PAI
- Gestion du type de PAI
- Téléversement du protocole PAI
- Gestion du moyen de paiement prévu
- Paiement prévu en espèces ou en 1, 2 ou 3 chèques
- Gestion des aides CAF, CJeune et Pass'Sport
- Création définitive du dossier après validation du paiement prévu
- E-mail de confirmation d'inscription

### Administration

- Gestion des rôles Admin et Bureau
- Création automatique des profils utilisateurs
- Rôle Bureau par défaut pour les nouveaux comptes
- Protection du compte administrateur principal
- Gestion des comptes du bureau
- Consultation du PAI et de son protocole
- Affichage du paiement prévu
- Gestion et encaissement des paiements
- Statistiques administratives et financières
- Saison d'inscription administrable
- Rubrique Documents
- Téléversement et publication des statuts de l'association

### Supabase

- Gestion des données PAI
- Gestion du paiement prévu
- Ajout de la saison d'inscription
- Bucket public club-documents
- Politiques Storage pour Admin et Bureau

### CI/CD

- Variables Supabase injectées par GitHub Actions
- Déploiement FTP après réussite de la CI
- Correction du répertoire de déploiement
- Suppression du fichier .env de l'historique Git

---

## [1.0.0] - En développement

### Ajout

#### Projet

- Initialisation du projet Vite
- Mise en place de React
- Configuration React Router
- Configuration Vitest
- Configuration Playwright
- CI GitHub Actions
- Déploiement FTP automatique

#### Supabase

- Connexion Supabase
- Authentification
- Gestion des migrations
- Row Level Security
- Profils administrateurs

#### Tunnel d'inscription

- Choix Adulte / Enfant
- Choix Loisir / Compétition
- Vérification automatique des âges
- Validation des formulaires
- Questionnaire de santé dynamique
- Résumé latéral
- Navigation par étapes
- Sauvegarde dans Supabase

#### Base de données

- Table inscriptions
- Table profiles
- Gestion des statuts
- Gestion des paiements
- Politiques RLS

#### Administration

- Authentification
- Route protégée
- Début du back-office
- Lecture sécurisée des inscriptions

---

## À venir

### Back-office

- Liste complète
- Recherche
- Filtres
- Fiche détaillée
- Historique

### Documents

- Téléversement
- Consultation
- Stockage sécurisé

### Emails

- Confirmation
- Validation
- Refus
- Paiement

### Paiement

- Stripe Checkout
- Webhooks
- Confirmation automatique

### Paramétrage

- Saison
- Tarifs
- Âges
- Documents

### Site institutionnel

- Présentation
- Actualités
- Galerie
- Agenda
