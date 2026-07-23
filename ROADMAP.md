# El Carino — Roadmap

## Objectif du projet

Créer une application d’inscription complète pour le club El Carino, avec :

- un tunnel d’inscription public ;
- un questionnaire de santé adapté au profil ;
- la gestion sécurisée des dossiers ;
- un back-office pour le bureau ;
- l’envoi d’e-mails ;
- la demande et le suivi des paiements ;
- des paramètres administrables.

Le site institutionnel complet sera développé dans une phase ultérieure.

---

# V1 — Application d’inscription

## 1. Socle technique

- [x] Projet Vite + React
- [x] Routage React Router
- [x] Connexion Supabase
- [x] Authentification administrateur
- [x] Protection des routes du back-office
- [x] Tests unitaires avec Vitest
- [x] Tests E2E avec Playwright
- [x] Build de production
- [x] CI GitHub
- [x] Déploiement FTP
- [x] Migrations Supabase versionnées
- [x] Politiques RLS initiales

---

## 2. Tunnel d’inscription

### Profil

- [x] Choix Enfant ou Adulte
- [x] Choix Loisir ou Compétition
- [x] Interface avec cartes illustrées
- [x] Seuil adulte par défaut à 15 ans
- [x] Contrôle de cohérence entre le profil et la date de naissance
- [x] Âge minimum par défaut à 5 ans
- [x] Âge maximum par défaut à 80 ans
- [ ] Récupération des limites d’âge depuis les paramètres administrables

### Informations personnelles

- [x] Identité
- [x] Date de naissance
- [x] Coordonnées
- [x] Adresse
- [x] Contact d’urgence
- [x] Représentant légal pour les enfants
- [x] Vérification des adresses e-mail
- [x] Vérification des numéros de téléphone
- [x] Vérification du code postal
- [x] Mise en page responsive

### Santé et autorisations

- [x] Questionnaire de santé
- [x] Questions adaptées au profil Enfant ou Adulte
- [x] Certificat médical obligatoire en cas de réponse positive
- [x] Certificat médical obligatoire pour certains profils
- [x] Autorisation parentale
- [x] Droit à l’image
- [x] Affichage compact des réponses Oui / Non
- [ ] Enregistrement des réponses détaillées dans Supabase
- [ ] Téléversement du certificat médical
- [ ] Stockage privé des documents
- [ ] Consultation du certificat par le bureau

### Navigation

- [x] Progression en quatre étapes
- [x] Étapes précédentes cliquables
- [x] Blocage des étapes non encore atteintes
- [x] Retour automatique en haut au changement d’étape
- [x] Résumé latéral
- [x] Coches vertes lorsque les étapes sont complétées
- [x] Responsive mobile

---

## 3. Enregistrement du dossier

- [x] Création de l’inscription dans Supabase
- [x] Génération de l’UUID côté navigateur
- [x] Création sécurisée avec RLS
- [x] Statut initial `soumis`
- [x] Affichage de la référence du dossier
- [ ] Empêcher les doubles inscriptions accidentelles
- [ ] Enregistrer les données de santé nécessaires
- [ ] Enregistrer les métadonnées des documents
- [ ] Générer un numéro de dossier lisible
- [ ] Afficher une page finale de confirmation

---

## 4. Workflow des dossiers

Statuts prévus :

- `brouillon`
- `soumis`
- `incomplet`
- `complement_demande`
- `valide`
- `en_attente_paiement`
- `paye`
- `refuse`
- `annule`

Fonctionnalités :

- [x] Types et statuts créés en base
- [x] Politiques de lecture pour les rôles Admin et Bureau
- [ ] Modification du statut depuis le back-office
- [ ] Demande de complément
- [ ] Motif de refus
- [ ] Commentaires internes
- [ ] Historique des changements de statut
- [ ] Journal des actions administratives

---

## 5. Back-office

### Accès

- [x] Authentification Supabase
- [x] Rôles `admin` et `bureau`
- [x] Table `profiles`
- [x] Route protégée `/admin`
- [x] Politique RLS de lecture des inscriptions
- [ ] Mot de passe oublié
- [ ] Page de définition d’un nouveau mot de passe
- [ ] Déconnexion
- [ ] Gestion des comptes du bureau

### Liste des inscriptions

- [x] Service de lecture des inscriptions
- [x] Première liste des dossiers
- [ ] Mise en page complète du back-office
- [ ] Recherche par nom ou e-mail
- [ ] Filtre par statut
- [ ] Filtre Enfant / Adulte
- [ ] Filtre Loisir / Compétition
- [ ] Filtre par état du paiement
- [ ] Tri par date
- [ ] Pagination
- [ ] Compteurs et statistiques

### Fiche d’inscription

- [ ] Page détaillée d’un dossier
- [ ] Informations de l’adhérent
- [ ] Informations du représentant légal
- [ ] Questionnaire de santé
- [ ] Documents
- [ ] État du paiement
- [ ] Modification du statut
- [ ] Commentaire interne
- [ ] Historique
- [ ] Export PDF
- [ ] Impression

---

## 6. Paramètres administrables

### Âges

- [ ] Âge minimum
- [ ] Âge de passage en catégorie Adulte
- [ ] Âge maximum

Valeurs par défaut actuelles :

```text
Âge minimum : 5 ans
Âge adulte : 15 ans
Âge maximum : 80 ans
```

### Saison

- [ ] Nom de la saison
- [ ] Date d'ouverture des inscriptions
- [ ] Date de fermeture des inscriptions
- [ ] Activation ou fermeture manuelle du formulaire

### Tarifs

- [ ] Tarif Enfant Loisir
- [ ] Tarif Enfant Compétition
- [ ] Tarif Adulte Loisir
- [ ] Tarif Adulte Compétition
- [ ] Réductions
- [ ] Tarif famille
- [ ] Tarif exceptionnel
- [ ] Devise

### Documents

- [ ] Types de documents demandés
- [ ] Taille maximale des fichiers
- [ ] Formats autorisés
- [ ] Certificat médical obligatoire selon le profil

---

## 7. E-mails

- [ ] Configuration SMTP
- [ ] Mail de confirmation de dépôt
- [ ] Mail récapitulatif du dossier
- [ ] Mail de demande de complément
- [ ] Mail de validation
- [ ] Mail de refus
- [ ] Mail de demande de paiement
- [ ] Mail de confirmation de paiement
- [ ] Modèles d'e-mails administrables
- [ ] Journal des e-mails envoyés

Le mail de paiement contiendra un lien durable :

```text
https://el-carino.org/paiement/<token>
```

Ce lien générera une nouvelle session Stripe au moment où l'utilisateur cliquera dessus.

---

## 8. Paiement Stripe

- [x] Colonnes de paiement ajoutées en base
- [x] Statuts de paiement ajoutés
- [ ] Calcul du montant côté serveur
- [ ] Jeton de paiement sécurisé
- [ ] Stockage du hash du jeton
- [ ] Page publique `/paiement/:token`
- [ ] Création d'une Checkout Session Stripe au clic
- [ ] Redirection vers Stripe
- [ ] Webhook `checkout.session.completed`
- [ ] Mise à jour automatique du dossier
- [ ] Gestion des paiements échoués
- [ ] Gestion des annulations
- [ ] Gestion des remboursements
- [ ] Reçu de paiement
- [ ] Blocage des doubles paiements

---

## 9. Documents

Aucune photo d'identité n'est prévue.

Documents pouvant être demandés :

- Certificat médical
- Justificatifs complémentaires (selon les besoins du club)

Fonctionnalités :

- [ ] Bucket Supabase Storage privé
- [ ] Téléversement sécurisé
- [ ] Validation du type MIME
- [ ] Validation de la taille
- [ ] Association du document à une inscription
- [ ] Consultation sécurisée par le bureau
- [ ] Remplacement d'un document
- [ ] Suppression d'un document
- [ ] Historique des documents

---

## 10. Qualité et sécurité

- [x] RLS activée
- [x] Création publique contrôlée
- [x] Lecture réservée aux rôles autorisés
- [ ] Tests unitaires complets
- [ ] Tests Playwright du tunnel complet
- [ ] Tests du back-office
- [ ] Tests du paiement
- [ ] Protection contre les doubles soumissions
- [ ] Limitation du nombre de requêtes
- [ ] Journalisation des erreurs
- [ ] Conformité RGPD
- [ ] Export des données personnelles
- [ ] Suppression ou anonymisation des dossiers

---

## 11. Déploiement

- [x] Build Vite
- [x] Déploiement automatique
- [x] Domaine prévu : `https://el-carino.org`
- [ ] Configuration finale de Supabase Auth
- [ ] SMTP de production
- [ ] Variables Stripe de production
- [ ] Edge Functions
- [ ] Webhook Stripe
- [ ] Sauvegarde de la base
- [ ] Procédure de restauration
- [ ] Supervision
- [ ] Vérification complète sur mobile

---

# V2 — Site institutionnel

Le site institutionnel sera développé après la finalisation de la V1.

## Contenu

- [ ] Accueil
- [ ] Présentation du club
- [ ] Histoire
- [ ] Disciplines
- [ ] Entraîneurs
- [ ] Horaires
- [ ] Tarifs
- [ ] Actualités
- [ ] Agenda
- [ ] Résultats sportifs
- [ ] Galerie photos
- [ ] Partenaires
- [ ] Contact
- [ ] Mentions légales
- [ ] Politique de confidentialité

## Administration

- [ ] Gestion des actualités
- [ ] Gestion des pages
- [ ] Gestion des événements
- [ ] Gestion des partenaires
- [ ] Gestion des contenus

---

# Priorités de développement

## Priorité 1

- Finaliser le back-office
- Fiche détaillée d'une inscription
- Gestion des statuts

## Priorité 2

- Gestion des documents
- Téléversement sécurisé
- Consultation des documents

## Priorité 3

- E-mails automatiques
- Templates d'e-mails

## Priorité 4

- Paiement Stripe
- Webhooks
- Confirmation de paiement

## Priorité 5

- Paramétrage complet du club
- Tarifs
- Saison
- Âges
- Documents

## Priorité 6

- Site institutionnel (V2)

---

# État actuel du projet

## V1

**Avancement estimé : 55 %**

### Terminé

- Socle technique
- Tunnel d'inscription
- Validation des données
- Enregistrement dans Supabase
- Sécurité RLS
- Début du back-office

### En cours

- Interface d'administration

### À venir

- Documents
- E-mails
- Paiement
- Paramétrage
- Finalisation

---

# Objectif

Mettre en production une application complète permettant au bureau d'El Carino de gérer les inscriptions sans traitement papier, avec un workflow entièrement dématérialisé.
