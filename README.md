# goldfish
AI based note taking app

## Développement

Pour lancer tous les services en mode développement avec hot reload :

```bash
docker compose -f docker-compose.dev.yml up
```

Cela lancera :
- La base de données PostgreSQL
- Le serveur FastAPI (avec hot reload via `--reload`)
- Le client React (avec hot reload via Vite)

Les modifications dans le code seront automatiquement détectées et rechargées sans avoir à reconstruire les conteneurs.

## Production

Pour lancer tous les services en mode production :

```bash
docker compose up
```
