# Implémentation User Story 1 : Prise de notes avec persistance

## Architecture

Le projet suivra une architecture microservices avec :

- **Backend** : FastAPI (`server/`) - API REST pour la gestion des notes
- **Frontend** : React SPA (`client/`) - Interface web pour créer et afficher les notes
- **Base de données** : PostgreSQL (`database/`) - Persistance des notes
- **Docker** : Configuration docker-compose pour orchestrer les services

## Structure des données

**Modèle Note** :

- `id` : UUID (clé primaire)
- `title` : String (titre de la note)
- `content` : Text (contenu de la note)
- `created_at` : DateTime (date de création)
- `updated_at` : DateTime (date de modification)

## Implémentation

### 1. Structure du projet

- Créer les dossiers `server/`, `client/`, `database/`
- Organiser le backend FastAPI avec structure modulaire (routers, models, schemas, database)

### 2. Base de données PostgreSQL

- Créer le modèle SQLAlchemy pour les notes (`server/models/note.py`)
- Configuration de la connexion async avec asyncpg
- Scripts de migration/setup dans `database/`

### 3. API FastAPI

- **Schémas Pydantic** (`server/schemas/note.py`) :
  - `NoteCreate` : titre + contenu (input)
  - `NoteResponse` : note complète avec id et timestamps (output)
- **Router** (`server/routers/notes.py`) :
  - `POST /api/notes` : Créer une note
  - `GET /api/notes` : Lister toutes les notes
- **Dépendances** : Configuration database via dependency injection

### 4. Frontend React

- **Composants** :
  - Formulaire de création de note (titre + contenu)
  - Liste des notes existantes
- **Services API** : Client HTTP pour communiquer avec le backend
- **État** : Gestion simple avec useState/useEffect

### 5. Configuration Docker

- **Dockerfiles** :
  - `server/Dockerfile` : Image Python/FastAPI
  - `client/Dockerfile` : Image Node/React
- **docker-compose.yml** (racine) :
  - Service `postgres` : Base de données
  - Service `server` : API FastAPI
  - Service `client` : Application React
  - Réseau et volumes appropriés

### 6. Configuration et dépendances

- `server/pyproject.toml` : Configuration uv avec dépendances (FastAPI, SQLAlchemy, asyncpg, Pydantic v2, etc.)
- `client/package.json` : React, dépendances UI
- Variables d'environnement pour la configuration (DB_URL, etc.)

## Fichiers à créer

### Backend

- `server/main.py` : Point d'entrée FastAPI
- `server/models/note.py` : Modèle SQLAlchemy
- `server/schemas/note.py` : Schémas Pydantic
- `server/routers/notes.py` : Routes API
- `server/database.py` : Configuration base de données
- `server/Dockerfile`
- `server/pyproject.toml` : Configuration uv pour les dépendances Python

### Frontend

- `client/src/App.jsx` : Composant principal
- `client/src/components/NoteForm.jsx` : Formulaire de création
- `client/src/components/NoteList.jsx` : Liste des notes
- `client/src/services/api.js` : Client API
- `client/package.json`
- `client/Dockerfile`

### Infrastructure

- `docker-compose.yml` : Orchestration globale
- `database/init.sql` : Script d'initialisation (optionnel)
- `.env.example` : Template de variables d'environnement

## Notes techniques

- Utiliser `uv` pour la gestion des dépendances Python (pyproject.toml au lieu de requirements.txt)
- Utiliser async/await pour toutes les opérations I/O
- Validation des données avec Pydantic v2
- Gestion d'erreurs avec HTTPException
- Interface en français (labels, messages)
- Code et commentaires en anglais

