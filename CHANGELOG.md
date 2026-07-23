# Changelog

Toutes les évolutions importantes du projet El Carino sont documentées dans ce fichier.

Le format est inspiré de Keep a Changelog :
https://keepachangelog.com/fr/1.1.0/

Le projet suit le versionnement sémantique :
https://semver.org/lang/fr/

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
