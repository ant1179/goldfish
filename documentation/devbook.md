# Devbook - État du développement

## Vue d'ensemble

Application de prise de notes avec fonctionnalités IA (recherche, résumé, création assistée). Architecture microservices avec Docker Compose.

## Architecture

### Services

- **Database** (`database/`) : PostgreSQL avec initialisation automatique
- **Server** (`server/`) : API FastAPI avec SQLAlchemy async
- **Client** (`client/`) : Application React SPA avec TypeScript et Vite

### Infrastructure

- Docker Compose pour orchestration globale
- Réseau Docker dédié (`goldfish-network`)
- Configuration par module avec fichiers `.env` individuels

## Fonctionnalités

### ✅ User Story 1 : Prise de notes avec persistance

**Statut** : Implémentée et fonctionnelle

#### Backend

- **Modèle de données** (`server/models/note.py`)
  - UUID comme clé primaire
  - Champs : `id`, `title`, `content`, `created_at`, `updated_at`
  - Timestamps avec timezone UTC

- **Schémas Pydantic** (`server/schemas/note.py`)
  - `NoteCreate` : Validation pour la création (titre et contenu requis)
  - `NoteResponse` : Schéma de réponse avec tous les champs

- **Routes API** (`server/routers/notes.py`)
  - `POST /api/notes` : Création d'une note
  - `GET /api/notes` : Liste toutes les notes (triées par date de création décroissante)

- **Configuration base de données** (`server/database.py`)
  - Connexion async avec asyncpg
  - Session management via dependency injection FastAPI
  - Configuration via variables d'environnement

- **Application FastAPI** (`server/main.py`)
  - Lifespan context manager pour création automatique des tables
  - CORS configuré pour le frontend
  - Endpoints de santé (`/health`)

#### Frontend

- **Composants React** :
  - `NoteForm` : Formulaire de création avec validation
  - `NoteList` : Affichage de la liste des notes avec formatage des dates
  - Interface en français (labels et messages)

- **Service API** (`client/src/services/api.ts`)
  - Client Axios configuré
  - Types TypeScript pour Note et NoteCreate
  - Méthodes : `createNote()`, `listNotes()`

- **UI** :
  - shadcn/ui pour les composants (Card, Button, Input, Label, Textarea)
  - Tailwind CSS pour le styling
  - React Router pour la navigation

#### Docker

- **Dockerfiles** :
  - `server/Dockerfile` : Image Python/FastAPI
  - `client/Dockerfile` : Build React avec Nginx
  - `database/Dockerfile` : Image PostgreSQL

- **Docker Compose** :
  - Configuration modulaire par service
  - Health checks pour PostgreSQL
  - Volumes persistants pour la base de données
  - Variables d'environnement via fichiers `.env`

### ⏳ Fonctionnalités à venir

#### User Story 2 : Recherche de notes avec IA
- **Statut** : Non implémentée
- **Prérequis** : Intégration Ollama
- **Description** : Recherche sémantique dans les notes via modèles IA locaux

#### User Story 3 : Résumé de notes avec IA
- **Statut** : Non implémentée
- **Prérequis** : Intégration Ollama
- **Description** : Génération automatique de résumés pour les notes existantes

#### User Story 4 : Création assistée de notes avec IA
- **Statut** : Non implémentée
- **Prérequis** : Intégration Ollama
- **Description** : Suggestion et assistance à la création de notes via IA

## Technologies

### Backend
- FastAPI 0.115.0
- SQLAlchemy 2.0.36 (async)
- asyncpg 0.30.0
- Pydantic 2.9.0
- uvicorn[standard] 0.32.0
- Python (gestion via requirements.txt, migration vers uv prévue)

### Frontend
- React 18.3.1
- TypeScript 5.5.4
- Vite 5.4.3
- React Router 6.26.0
- Axios 1.7.7
- Tailwind CSS 3.4.13
- shadcn/ui

### Base de données
- PostgreSQL
- SQLAlchemy ORM

### Infrastructure
- Docker & Docker Compose
- Nginx (pour le frontend)

## Structure du projet

```
goldfish/
├── client/              # Application React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── services/    # Services API
│   │   └── lib/         # Utilitaires
│   ├── docker-compose.yml
│   └── Dockerfile
├── server/              # API FastAPI
│   ├── models/          # Modèles SQLAlchemy
│   ├── schemas/         # Schémas Pydantic
│   ├── routers/         # Routes API
│   ├── database.py      # Configuration DB
│   ├── main.py          # Point d'entrée
│   ├── docker-compose.yml
│   └── Dockerfile
├── database/            # Configuration PostgreSQL
│   ├── init.sql
│   ├── docker-compose.yml
│   └── Dockerfile
├── documentation/       # Documentation
│   ├── requirements.md
│   ├── user_story_1_-_prise_de_notes.md
│   └── devbook.md       # Ce fichier
└── docker-compose.yml   # Orchestration globale
```

## Configuration

### Variables d'environnement

Chaque module possède son propre fichier `.env` (avec `.env.example` comme template) :

- **Database** : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, ports
- **Server** : `DB_DATABASE_URL`, ports
- **Client** : `SERVER_URL`, ports

## Prochaines étapes

1. Migration vers `uv` pour la gestion des dépendances Python (remplacer requirements.txt par pyproject.toml)
2. Implémentation de l'intégration Ollama pour les fonctionnalités IA
3. User Story 2 : Recherche de notes avec IA
4. User Story 3 : Résumé de notes avec IA
5. User Story 4 : Création assistée de notes avec IA
6. Amélioration de la sécurité CORS (restriction des origines en production)
7. Ajout de tests unitaires et d'intégration

## Notes techniques

- Toutes les opérations I/O sont asynchrones
- Validation des données avec Pydantic v2
- Gestion d'erreurs avec HTTPException
- Interface utilisateur en français
- Code et commentaires en anglais
- Architecture microservices avec services indépendants

