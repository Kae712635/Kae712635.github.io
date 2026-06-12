# Portfolio 3D - Monorepo Full-Stack

Une application Web complète avec un espace 3D interactif (Frontend React/Three.js) et une API de données locale (Backend Express).

## 🏗️ Architecture

Le projet est structuré sous forme de "Monorepo" séparant le front et le back, optimisé pour le déploiement sur conteneur Docker.

```text
portfolio/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Logique de gestion des projets
│   │   └── routes/        # Routes de l'API REST
│   ├── server.js          # Point d'entrée de l'API Node.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants React (Univers 3D, Interface)
│   │   ├── hooks/         # Hooks personnalisés (ex: useProjects.js)
│   │   └── data/          # projects.json (Base de données dynamique)
│   ├── vite.config.js     # Config Vite avec Proxy API
│   └── package.json
├── .github/workflows/     # CI/CD (GitHub Actions)
├── docker-compose.yml     # Lancement Docker unifié
├── Dockerfile             # Multi-stage build (Front + Back)
├── start.bat              # Script de lancement (Windows)
└── start.sh               # Script de lancement (Linux/macOS)
```

## 🚀 Démarrage Rapide (Développement Local)

Vous avez deux options pour lancer le projet sur votre machine.

### Option 1 : Via le script (Recommandé)
Double-cliquez sur `start.bat` (Windows) ou exécutez `./start.sh` (Mac/Linux).
Le script va automatiquement installer les dépendances et ouvrir les serveurs Frontend et Backend dans deux fenêtres séparées.

### Option 2 : Manuellement
1. **Lancer le Backend (API)** :
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *L'API sera disponible sur `http://localhost:3000`.*

2. **Lancer le Frontend (Vite)** :
   Ouvrez un nouveau terminal :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *L'interface sera disponible sur `http://localhost:5173`.*

## 🐳 Déploiement (Docker)

Le projet est entièrement "Dockerisé" pour être déployé très facilement sur n'importe quel serveur (VPS) sans avoir à installer Node.js manuellement.

Pour construire et lancer le conteneur complet :
```bash
docker-compose up --build -d
```
L'application (Front + Back combinés) sera accessible sur le port **3000** de votre machine/serveur.

## 🔒 Sécurité et Optimisation

- **Frontend ultra-optimisé** : Les textures et la géométrie 3D sont gérées dynamiquement. Le `Device Pixel Ratio` est plafonné pour empêcher les écrans 4K de surcharger la carte graphique.
- **Sécurité** : Balises `Content-Security-Policy` (CSP) strictes, headers `nosniff`, et validation complète des variables en entrée.
- **CI/CD** : Chaque modification poussée sur la branche `main` déclenche une action GitHub qui compile automatiquement la dernière version de l'image Docker et la met à disposition sur le `GitHub Container Registry`.
