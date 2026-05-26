# TaskManager — Application Angular de Gestion de Tâches

Application web de gestion de tâches développée avec **Angular 21** dans le cadre de la formation L3. Elle propose un système de _board_ type Trello/Kanban avec **authentification locale**, **création, suivi et suppression de tâches**, le tout stocké dans le `localStorage` du navigateur.

---

## 📋 Table des matières

1. [Technologies](#-technologies)
2. [Prérequis](#-prérequis)
3. [Installation](#-installation)
   - [Classique (Node.js)](#1-classique-recommandé)
   - [Avec Docker](#2-avec-docker)
4. [Architecture du projet](#-architecture-du-projet)
5. [Structure détaillée](#-structure-détaillée)
6. [Fonctionnalités](#-fonctionnalités)
7. [Commandes utiles](#-commandes-utiles)
8. [Bonnes pratiques appliquées](#-bonnes-pratiques-appliquées)
9. [Auteur](#-auteur)

---

## 🧰 Technologies

| Technologie          | Version   |
|----------------------|-----------|
| Angular              | ~21.2.0   |
| TypeScript           | ~5.9.2    |
| Node.js              | 22 (Alpine) |
| RxJS                 | ~7.8.0    |
| Reactive Forms       | intégré   |
| Angular Router       | intégré   |
| SCSS                 | —         |
| Docker               | —         |

---

## ✅ Prérequis

- **Node.js** >= 22 _(ou Docker)_
- **npm** >= 10
- Navigateur moderne

---

## 🚀 Installation

### 1️⃣ Classique (recommandé)

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd Formation-angular-2

# Accéder au projet Angular
cd projet/task-manager

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ng serve
```

Ouvrir [http://localhost:4200](http://localhost:4200).

### 2️⃣ Avec Docker

```bash
# Construire l'image
docker compose build

# Lancer le conteneur
docker compose up -d

# Se connecter au conteneur
docker exec -it formation-angular-l3 sh

# Dans le conteneur
cd /app/task-manager
npm install
npx ng serve --host 0.0.0.0
```

Le **Dockerfile** utilise `node:22-alpine`, installe `@angular/cli` globalement et expose le port **4200**. Le `docker-compose.yml` monte le dossier `./projet` dans `/app` pour le développement en direct.

---

## 🏛 Architecture du projet

```
Formation-angular-2/
├── dockerfile                  # Image Docker (Node 22 + Angular CLI)
├── docker-compose.yml          # Orchestration Docker
├── projet/
│   └── task-manager/           # Application Angular
│       ├── src/
│       │   ├── index.html
│       │   ├── main.ts         # Point d'entrée (bootstrapApplication)
│       │   ├── styles.scss     # Styles globaux
│       │   └── app/
│       │       ├── app.ts              # Root component (standalone)
│       │       ├── app.config.ts       # Configuration des providers
│       │       ├── app.routes.ts       # Définition des routes + guards
│       │       ├── core/
│       │       │   ├── models/         # Interfaces TypeScript
│       │       │   │   ├── user.model.ts
│       │       │   │   └── task.model.ts
│       │       │   └── services/       # Services métier
│       │       │       ├── auth.service.ts
│       │       │       └── task.service.ts
│       │       └── features/           # Modules fonctionnels
│       │           ├── auth/           # Authentification
│       │           │   ├── auth-routing-module.ts
│       │           │   ├── login/
│       │           │   └── register/
│       │           └── tasks/          # Gestion des tâches
│       │               ├── tasks-routing-module.ts
│       │               ├── board/
│       │               ├── task-card/
│       │               └── task-form/
│       ├── angular.json
│       ├── package.json
│       ├── tsconfig.json
│       └── public/
```

### 🔹 Standalone Components (architecture moderne)

L'application utilise exclusivement des **composants standalone** (sans `NgModule`). Le bootstrap se fait via `bootstrapApplication()` dans `main.ts`.

### 🔹 Core — Modèles et services partagés

- **`core/models/`** : définit les interfaces `User` et `Task` avec le type `TaskStatus` (`'todo' | 'in-progress' | 'done'`).
- **`core/services/`** :
  - `AuthService` : gère l'inscription/connexion/déconnexion avec stockage dans `localStorage` et signaux Angular (`signal`, `computed`).
  - `TaskService` : CRUD complet des tâches, filtrées par utilisateur connecté, exposées via des signaux (`todoTasks`, `inProgressTasks`, `doneTasks`).

### 🔹 Features — Pages fonctionnelles

- **`features/auth/login/`** : formulaire de connexion (Reactive Forms + validation).
- **`features/auth/register/`** : formulaire d'inscription avec confirmation de mot de passe.
- **`features/tasks/board/`** : tableau Kanban avec 3 colonnes (À faire, En cours, Terminé).
- **`features/tasks/task-card/`** : carte individuelle avec actions de changement de statut et suppression.
- **`features/tasks/task-form/`** : formulaire de création de tâche.

### 🔹 Guards de route

Dans `app.routes.ts` :

| Guard        | Rôle                                     |
|-------------|------------------------------------------|
| `authGuard` | Protège `/board` — redirige vers `/login` si non connecté |
| `guestGuard` | Protège `/login` et `/register` — redirige vers `/board` si déjà connecté |

---

## 📁 Structure détaillée

### Modèles

| Fichier | Contenu |
|---------|---------|
| `user.model.ts` | `interface User { id, username, email, password, createdAt }` |
| `task.model.ts` | `type TaskStatus` et `interface Task { id, title, description, status, userId, createdAt, updatedAt }` |

### Services

| Service | Méthodes principales |
|---------|---------------------|
| `AuthService` | `register()`, `login()`, `logout()`, `currentUser` (signal), `isLoggedIn` (computed) |
| `TaskService` | `addTask()`, `updateStatus()`, `updateTask()`, `deleteTask()`, `myTasks` / `todoTasks` / `inProgressTasks` / `doneTasks` (computed) |

### Composants

| Composant           | Selector          | Rôle |
|---------------------|-------------------|------|
| `AppComponent`      | `app-root`        | Root avec `<router-outlet />` |
| `LoginComponent`    | `app-login`       | Formulaire de connexion |
| `RegisterComponent` | `app-register`    | Formulaire d'inscription |
| `BoardComponent`    | `app-board`       | Tableau Kanban 3 colonnes |
| `TaskCardComponent` | `app-task-card`   | Carte tâche avec actions |
| `TaskFormComponent` | `app-task-form`   | Formulaire d'ajout de tâche |

---

## ✨ Fonctionnalités

- ✅ **Authentification** : inscription / connexion avec validation Reactive Forms
- ✅ **Board Kanban** : colonnes _À faire_, _En cours_, _Terminé_
- ✅ **CRUD tâches** : créer, déplacer entre colonnes, supprimer
- ✅ **Données persistées** dans `localStorage` (par utilisateur)
- ✅ **Navigation protégée** : guards `authGuard` et `guestGuard`
- ✅ **Signaux Angular** : gestion d'état réactive sans `NgRx`
- ✅ **Composants standalone** : architecture Angular moderne
- ✅ **Lazy loading** des routes avec `loadComponent()`
- ✅ **Interface responsive** : design épuré, grille CSS

---

## 📜 Commandes utiles

```bash
ng serve       
```

---

## ✅ Bonnes pratiques appliquées

- **Standalone components** (pas de NgModule)
- **Signals** (`signal`, `computed`) pour l'état réactif
- **Reactive Forms** avec `FormBuilder` et `Validators`
- **Lazy loading** via `loadComponent()` dans les routes
- **Route guards** fonctionnels (`canActivate`)
- **`input()` et `output()`** fonctions plutôt que les décorateurs `@Input` / `@Output`
- **Contrôle de flux natif** (`@if`, `@for`) au lieu de `*ngIf`, `*ngFor`
- **SCSS** avec conventions BEM-like
- **TypeScript strict** : `strict: true` dans `tsconfig.json`

---

## 👤 Auteur

**Didier** — Formation L3

Projet pédagogique — Angular 21 avec architecture moderne standalone + signaux.
