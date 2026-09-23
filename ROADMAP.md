# El Carino — Roadmap

## Objectif du projet

Créer une application d'inscription complète pour le club El Carino, avec :

- un tunnel d'inscription public ;
- un questionnaire de santé adapté au profil ;
- la gestion sécurisée des dossiers ;
- un back-office pour le bureau ;
- l'envoi d'e-mails ;
- le calcul et le suivi des paiements ;
- des paramètres administrables.

Le site institutionnel est désormais intégré à l'application et utilisé comme page d'accueil publique.

---

# V1 — Application d'inscription

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

## 2. Tunnel d'inscription

### Profil

- [x] Choix Enfant ou Adulte
- [x] Choix Loisir ou Compétition
- [x] Interface avec cartes illustrées
- [x] Seuil adulte par défaut à 18 ans
- [x] Contrôle de cohérence entre le profil et la date de naissance
- [x] Âge minimum par défaut à 5 ans
- [x] Âge maximum par défaut à 80 ans
- [x] Récupération du seuil adulte depuis les paramètres administrables
- [x] Affichage dynamique des limites Enfant / Adulte

### Informations personnelles

- [x] Identité
- [x] Date de naissance
- [x] Coordonnées
- [x] Adresse
- [x] Contact d'urgence
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
- [x] Droit à l'image
- [x] Affichage compact des réponses Oui / Non
- [ ] Enregistrement des réponses détaillées dans Supabase
- [x] Téléversement du certificat médical
- [x] Stockage privé des documents
- [x] Consultation du certificat par le bureau

### PAI

- [x] Déclaration d'un PAI pendant l'inscription
- [x] Enregistrement du type de PAI
- [x] Informations complémentaires pour un PAI de type Autre
- [x] Téléversement du protocole PAI
- [x] Consultation du protocole PAI dans le back-office
- [ ] Modification du PAI après l'inscription depuis le back-office
- [ ] Ajout ou remplacement du protocole PAI après l'inscription depuis le back-office

### Paiement prévu

- [x] Choix du moyen de paiement prévu
- [x] Espèces
- [x] Paiement en 1, 2 ou 3 chèques
- [x] Aide CAF
- [x] CJeune
- [x] Pass'Sport
- [x] Affichage du paiement prévu dans le back-office

### Navigation

- [x] Progression en quatre étapes
- [x] Étapes précédentes cliquables
- [x] Blocage des étapes non encore atteintes
- [x] Retour automatique en haut au changement d'étape
- [x] Résumé latéral
- [x] Coches vertes lorsque les étapes sont complétées
- [x] Responsive mobile

---

## 3. Enregistrement du dossier

- [x] Création de l'inscription dans Supabase
- [x] Génération de l'UUID côté navigateur
- [x] Création sécurisée avec RLS
- [x] Statut initial `soumis`
- [x] Affichage de la référence du dossier
- [ ] Empêcher les doubles inscriptions accidentelles
- [x] Enregistrer les données de santé nécessaires
- [x] Enregistrer les métadonnées des documents
- [x] Calculer automatiquement le montant de l'inscription
- [x] Enregistrer le montant dans `payment_amount_cents`
- [x] Enregistrer la devise dans `payment_currency`
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
- [x] Modification du statut depuis le back-office
- [x] Commentaires internes

---

## 5. Back-office

### Accès

- [x] Authentification Supabase
- [x] Rôles `admin` et `bureau`
- [x] Table `profiles`
- [x] Route protégée `/admin`
- [x] Politique RLS de lecture des inscriptions
- [ ] Mot de passe oublié
- [ ] Page de définition d'un nouveau mot de passe
- [ ] Déconnexion
- [x] Gestion des comptes du bureau

### Liste des inscriptions

- [x] Service de lecture des inscriptions
- [x] Première liste des dossiers
- [x] Mise en page complète du back-office
- [x] Recherche par nom ou e-mail
- [x] Filtre par statut
- [x] Filtre Enfant / Adulte
- [x] Filtre Loisir / Compétition
- [ ] Filtre par état du paiement
- [ ] Relance pour non-paiement en lot
- [x] Compteurs et statistiques
- [x] Export Excel des inscriptions

### Fiche d'inscription

- [x] Page détaillée d'un dossier
- [x] Informations de l'adhérent
- [x] Informations du représentant légal
- [x] Questionnaire de santé
- [x] Documents
- [x] État du paiement
- [x] Modification du statut
- [x] Commentaire interne
- [x] Consultation du certificat médical
- [x] Remplacement du certificat médical

---

## 6. Paramètres administrables

### Âges

- [ ] Âge minimum
- [x] Âge de passage en catégorie Adulte
- [ ] Âge maximum

Valeurs actuelles :

```text
Âge minimum : 5 ans
Âge adulte : 18 ans
Âge maximum : 80 ans
```

---

# 7. Statistiques

- [x] Nombre total d'inscriptions
- [x] Répartition Enfant / Adulte
- [x] Répartition Loisir / Compétition
- [x] Répartition par sexe
- [x] Répartition par statut
- [x] Évolution quotidienne des inscriptions
- [x] Montants attendus
- [x] Montants reçus
- [x] Montants encaissés
- [x] Reste à percevoir
- [x] Moyens de paiement prévus
- [x] Aides prévues

---

# 8. Documents publics

- [x] Rubrique Documents dans le back-office
- [x] Bucket Supabase `club-documents`
- [x] Lecture publique des documents du club
- [x] Écriture réservée aux rôles Admin et Bureau
- [x] Téléversement des statuts
- [x] Publication sous le nom fixe `statuts-el-carino.pdf`
- [x] Lien vers les statuts depuis la page d'accueil

---

# 9. Site public

- [x] Nouvelle page d'accueil
- [x] Présentation du club
- [x] Horaires des entraînements
- [x] Adresse et carte du gymnase
- [x] Équipements nécessaires
- [x] Flux Facebook
- [x] Accès à l'inscription
- [x] Saison d'inscription dynamique
- [x] Responsive desktop et mobile

---

# 10. Référencement

- [x] Titre SEO
- [x] Meta description
- [x] URL canonique
- [x] Open Graph
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] Données structurées `SportsClub`
- [x] Image publique pour les données structurées
- [x] Google Search Console
- [ ] Google Business Profile / présence Google Maps

---

# À traiter avant la version 1.0.0

- [ ] Empêcher les doubles inscriptions accidentelles
- [ ] Générer un numéro de dossier lisible
- [ ] Modifier un PAI après inscription depuis le back-office
- [ ] Ajouter ou remplacer le protocole PAI après inscription
- [ ] Finaliser les communications administratives
- [ ] Revoir les différences de permissions entre Admin et Bureau
- [ ] Revue finale des tests E2E
