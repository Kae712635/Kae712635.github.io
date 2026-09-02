#!/bin/bash

# Charger NVM si disponible pour avoir la bonne version de Node (>= 18)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

echo "=============================================="
echo "  Lancement du Portfolio Full-Stack (Linux/WSL)"
echo "  Node version: $(node -v 2>/dev/null || echo 'non trouvé')"
echo "=============================================="

echo "[1/2] Lancement du Backend API..."
(cd backend && node server.js) &
BACKEND_PID=$!

echo "[2/2] Lancement du Frontend Vite..."
(
  cd frontend || exit 1
  npm install
  # Garantir les permissions d'exécution sur les binaires node_modules
  chmod -R +x node_modules/.bin 2>/dev/null || true
  npm run dev
) &
FRONTEND_PID=$!

echo ""
echo "✅ Serveurs lancés en arrière-plan !"
echo "Frontend : http://localhost:5173"
echo "Backend  : http://localhost:3001"
echo ""
echo "Appuyez sur Ctrl+C pour couper les deux serveurs."

# Attrape le Ctrl+C pour tuer les processus enfants
trap "echo 'Fermeture des serveurs...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait

