# Goldfish Client

Frontend React application for the Goldfish note-taking application.

## Technologies

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Router

## Development

### Local Development (without Docker)

```bash
npm install
npm run dev
```

### Development with Docker (Hot Reload)

Pour utiliser le hot reload avec Docker sans avoir à reconstruire le conteneur :

```bash
# Depuis la racine du projet
docker compose -f docker-compose.dev.yml up client

# Ou depuis le dossier client
docker compose -f docker-compose.dev.yml up
```

Les modifications dans le code source seront automatiquement détectées et rechargées grâce au serveur de développement Vite. Les volumes sont montés pour permettre le hot reload sans reconstruction du conteneur.

## Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `SERVER_URL`: Backend server URL (default: http://localhost:8000)

