# El Carino

Version actuelle : **0.8.0**

Application web de gestion des inscriptions du club El Carino.

Cette application permet de gérer l'ensemble du processus d'inscription des adhérents, depuis le formulaire public jusqu'au suivi administratif, en passant par la gestion des documents, des paiements et des communications.

---

# Fonctionnalités

## Inscription publique

- Choix du profil (Enfant / Adulte)
- Choix de la pratique (Loisir / Compétition)
- Formulaire multi-étapes
- Coordonnées complètes
- Adresse postale
- Contact d'urgence
- Représentant légal (mineurs)
- Questionnaire de santé dynamique
- Gestion des autorisations
- Téléversement du certificat médical
- Validation complète des données
- Enregistrement sécurisé dans Supabase
- Envoi d'un e-mail de confirmation

---

## Administration

L'espace d'administration permet de :

- authentifier les membres du bureau ;
- consulter les inscriptions ;
- rechercher un adhérent ;
- filtrer les dossiers ;
- consulter le détail complet d'une inscription ;
- modifier le statut d'un dossier ;
- ajouter des notes internes ;
- consulter le certificat médical ;
- remplacer un certificat médical ;
- supprimer automatiquement l'ancien certificat dans Supabase Storage ;
- suivre l'état des paiements ;
- exporter les dossiers au format Excel.

---

## Gestion des documents

Les certificats médicaux sont stockés dans un bucket privé Supabase.

Le back-office permet de :

- consulter un certificat médical via une URL signée temporaire ;
- remplacer un certificat médical existant ;
- supprimer automatiquement l'ancien document après un remplacement réussi ;
- conserver les métadonnées du document dans la base de données.

---

## Export Excel

L'export contient notamment :

- Date d'inscription
- Statut
- Nom
- Prénom
- Sexe
- Date de naissance
- Adresse
- Email
- Téléphone
- Contact d'urgence
- Téléphone du contact d'urgence
- Représentant légal
- Coordonnées du représentant légal
- Questionnaire de santé
- Certificat médical requis
- Certificat médical fourni
- Nom du certificat
- Autorisation parentale
- Droit à l'image
- Paiement

L'export respecte automatiquement les filtres actuellement appliqués dans le back-office.

---

# Technologies

## Front-end

- React 19
- Vite
- React Router

## Back-end

- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase Edge Functions

## Qualité

- ESLint
- Vitest
- Playwright

## Outils

- SheetJS (xlsx)
- GitHub Actions

---

# Installation

Installer les dépendances :

```bash
npm install
```

Créer le fichier `.env` :

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

Lancer le serveur de développement :

```bash
npm run dev
```

---

# Développement

Créer le build de production :

```bash
npm run build
```

Les fichiers sont générés dans :

```text
dist/
```

---

# Tests

Lancer ESLint :

```bash
npm run lint
```

Tests unitaires :

```bash
npm run test:unit
```

Tests end-to-end :

```bash
npm run test:e2e
```

---

# Structure du projet

```text
src/
├── components/
├── features/
├── hooks/
├── pages/
├── router/
├── services/
└── styles/

supabase/
├── functions/
└── migrations/

tests/
├── e2e/
└── unit/
```

---

# Base de données

Les migrations Supabase sont conservées dans :

```text
supabase/migrations/
```

Toutes les évolutions de la base de données doivent être versionnées via une migration.

---

# Déploiement

La pipeline GitHub Actions réalise automatiquement :

1. Installation des dépendances
2. Vérification ESLint
3. Exécution des tests unitaires
4. Build Vite
5. Déploiement FTP

---

# Sécurité

- Authentification Supabase
- Row Level Security (RLS)
- Routes administrateur protégées
- Documents stockés dans un bucket privé
- Consultation des certificats via des URL signées temporaires
- Suppression sécurisée des anciens certificats lors d'un remplacement
- Lecture réservée aux membres autorisés

Les exports Excel contiennent des données personnelles et médicales. Ils sont destinés exclusivement aux membres habilités du club.

---

# Documentation

- `ROADMAP.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `LICENSE`
