# El Carino

Application web de gestion des inscriptions du club El Carino.

Cette application permet de gérer l'ensemble du processus d'inscription des adhérents, depuis le formulaire public jusqu'au suivi administratif, en passant par la gestion des documents, des paiements et des communications.

---

# Fonctionnalités

## Inscription publique

- Choix du profil (Enfant / Adulte)
- Choix de la pratique (Loisir / Compétition)
- Formulaire en plusieurs étapes
- Coordonnées complètes
- Adresse
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
- suivre les paiements ;
- exporter les dossiers au format Excel.

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

L'export respecte automatiquement les filtres actuellement affichés dans le back-office.

---

# Technologies

- React 19
- Vite
- React Router
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase Edge Functions
- Vitest
- Playwright
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

---

# Développement

Lancer le serveur :

```bash
npm run dev
```

---

# Production

Créer le build :

```bash
npm run build
```

Les fichiers sont générés dans :

```text
dist/
```

---

# Tests

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

```
src/
    components/
    features/
    hooks/
    pages/
    router/
    services/
    styles/

supabase/
    migrations/
    functions/

tests/
```

---

# Base de données

Les migrations Supabase sont conservées dans :

```
supabase/migrations/
```

Toutes les modifications de la base doivent être versionnées.

---

# Déploiement

La CI GitHub Actions réalise automatiquement :

1. Installation des dépendances
2. Tests unitaires
3. Build Vite
4. Déploiement FTP

---

# Sécurité

- Authentification Supabase
- Row Level Security
- Routes administrateur protégées
- Documents stockés dans un bucket privé
- Lecture réservée aux membres autorisés

Les exports Excel contiennent des données personnelles et médicales. Ils sont destinés exclusivement aux membres habilités du club.

---

# Documentation

- ROADMAP.md
- CHANGELOG.md
- CONTRIBUTING.md
- LICENSE
