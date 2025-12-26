# Assets

Ce dossier contient les images et autres ressources statiques utilisées dans l'application.

## Utilisation

Pour utiliser une image dans un composant React :

```tsx
import logo from '@/assets/logo.png'

function Header() {
  return <img src={logo} alt="Logo" />
}
```

## Structure recommandée

- `images/` - Images générales (logo, illustrations, etc.)
- `icons/` - Icônes personnalisées (si nécessaire)

