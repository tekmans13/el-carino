# El Carino — Roadmap

## Objectif du projet

Créer une application d'inscription complète pour le club El Carino, avec :

- un tunnel d'inscription public ;
- un questionnaire de santé adapté au profil ;
- la gestion sécurisée des dossiers ;
- un back-office pour le bureau ;
- l'envoi d'e-mails ;
- la demande et le suivi des paiements ;
- des paramètres administrables.

Le site institutionnel complet sera développé dans une phase ultérieure.

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
- [x] Seuil adulte par défaut à 15 ans
- [x] Contrôle de cohérence entre le profil et la date de naissance
- [x] Âge minimum par défaut à 5 ans
- [x] Âge maximum par défaut à 80 ans
- [ ] Récupération des limites d'âge depuis les paramètres administrables

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
- [ ] Gestion des comptes du bureau

### Liste des inscriptions

- [x] Service de lecture des inscriptions
- [x] Première liste des dossiers
- [x] Mise en page complète du back-office
- [x] Recherche par nom ou e-mail
- [x] Filtre par statut
- [x] Filtre Enfant / Adulte
- [x] Filtre Loisir / Compétition
- [ ] Filtre par état du paiement
- [ ] Relance pour non paiement en lot
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

- [ ] Tarif Enfant 
- [ ] Tarif Adulte 

### Documents

- [ ] Certificat médical obligatoire selon le profil

---

## 7. E-mails

- [ ] Configuration SMTP
- [x] Mail de confirmation de dépôt
- [ ] Mail récapitulatif du dossier
- [ ] Mail de demande de complément
- [ ] Mail de validation
- [ ] Mail de refus
- [ ] Mail de demande de paiement
- [ ] Mail de confirmation de paiement
- [ ] Modèles d'e-mails administrables

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

- [x] Bucket Supabase Storage privé
- [x] Téléversement sécurisé
- [x] Association du document à une inscription
- [x] Consultation sécurisée par le bureau
- [x] Remplacement d'un certificat médical
- [x] Suppression automatique de l'ancien certificat lors d'un remplacement
- [ ] Suppression manuelle d'un document

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
- [ ] Afficahge des erreurs avec envois automoatique à l'admin
- [ ] Conformité RGPD

---

## 11. Déploiement

- [x] Build Vite
- [x] Déploiement automatique
- [x] Domaine prévu : `https://el-carino.org`
- [ ] Configuration finale de Supabase Auth
- [ ] SMTP de production
- [ ] Variables Stripe de production
- [x] Edge Functions
- [ ] Webhook Stripe

---

# V2 — Site institutionnel

Le site institutionnel sera développé après la finalisation de la V1.

## Contenu

- [ ] Accueil
- [ ] Présentation du club (présentation et status
- [ ] Horaires
- [ ] Tarifs
- [ ] Actualités facebook imbeded
- [ ] Contact

## Administration

- [ ] Gestion des contenus, edition simple texte

---

# Priorités de développement

## Priorité 1

- Finaliser le paiement Stripe
- Génération sécurisée des liens de paiement
- Webhook Stripe

## Priorité 2

- Paramètres administrables
- Tarifs
- Saison
- Âges
- Documents

## Priorité 3

- E-mails automatiques
- Modèles d'e-mails administrables

## Priorité 4

- Site institutionnel (V2)

---

# État actuel du projet

## V1

**Avancement estimé : 75 %**

### Terminé

- Socle technique
- Tunnel d'inscription
- Validation des données
- Enregistrement dans Supabase
- Sécurité RLS
- Back-office
- Recherche et filtres
- Fiche détaillée d'une inscription
- Gestion des statuts
- Notes administratives
- Gestion des certificats médicaux
- Remplacement des certificats médicaux
- Export Excel
- E-mail de confirmation

### En cours

- Paiement Stripe

### À venir

- Paramètres administrables
- Finalisation de la V1

---

# Objectif

Mettre en production une application complète permettant au bureau d'El Carino de gérer les inscriptions sans traitement papier, avec un workflow entièrement dématérialisé.
