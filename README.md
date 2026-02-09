# Application de covoiturage – Projet EFREI

## 📌 Description
Ce projet est une application web de covoiturage développée dans un cadre académique à l’EFREI.
Elle permet la mise en relation de conducteurs et de passagers afin de partager des trajets.
L’application repose sur une architecture client–serveur avec un frontend en Vue.js
et un backend en Node.js (Express), connecté à une base de données MySQL.

---

## 🎯 Objectifs du projet
- Concevoir une application web complète de covoiturage
- Mettre en œuvre une architecture frontend / backend moderne
- Gérer les utilisateurs, trajets et réservations
- Manipuler une base de données relationnelle (MySQL)
- Appliquer les bonnes pratiques de structuration d’un projet web

---

## 🛠️ Technologies utilisées

### Frontend
- Vue.js (Vite)
- JavaScript
- HTML / CSS
- Bootstrap

### Backend
- Node.js
- Express.js

### Base de données
- MySQL

### Outils
- Git & GitHub (versioning)
- npm

---

## 📂 Structure du projet

client/
└── vite-project/ → application frontend Vue.js

server/ → serveur backend Express.js

users.sql → script SQL de la base de données

README.md → documentation du projet


---

## 🗄️ Base de données (MySQL)
La base de données permet de gérer :
- les utilisateurs (conducteurs et passagers)
- les informations nécessaires à l’authentification
- les données liées aux trajets et réservations

### Importation
1. Créer une base de données MySQL
2. Importer le fichier :user.sql

via phpMyAdmin ou en ligne de commande.

---

## ▶️ Installation et exécution en local

### 1️⃣ Backend (Express.js)
```bash
cd server
npm install
npm start
http://localhost:3000

### 2️⃣ Frontend (Vue.js)
cd client/vite-project
npm install
npm run dev
http://localhost:5173

### 🔐 Sécurité
Les informations sensibles (identifiants de base de données, clés, mots de passe)
ne sont pas exposées publiquement dans le dépôt.
Les variables sensibles doivent être stockées dans des fichiers de configuration
ou des variables d’environnement.

### 👨‍🎓 Contexte académique
Projet réalisé dans le cadre de la formation d’ingénieur à l’EFREI.
Ce projet a pour objectif de mettre en pratique les compétences acquises
en développement web, architecture client–serveur et gestion de bases de données.

### 📧 Contact
Pour toute question ou remarque concernant ce projet,
vous pouvez me contacter via GitHub ou LinkedIn.


---

## ✅ Pourquoi ce README est **très bon pour les recruteurs**
✔️ Stack moderne clairement affichée (Vue + Express)  
✔️ Architecture lisible (`client / server`)  
✔️ Instructions pour lancer le projet  
✔️ Projet académique bien contextualisé  
✔️ Sérieux et crédibilité technique  

---

### 🔜 Prochaines améliorations possibles (optionnel mais très pro)
- Ajouter **captures d’écran** de l’interface
- Ajouter un **schéma d’architecture**
- Ajouter un **diagramme de base de données**
- Ajouter une section **Fonctionnalités**

Si tu veux, je peux t’aider à faire **la prochaine amélioration la plus rentable pour
