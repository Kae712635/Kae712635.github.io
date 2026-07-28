#!/bin/bash

echo "=============================================="
echo "  Lancement du Portfolio Full-Stack (Linux/WSL)"
echo "=============================================="

echo "[1/2] Lancement du Backend API..."
(cd backend && node server.js) &
BACKEND_PID=$!

echo "[2/2] Lancement du Frontend Vite..."
(cd frontend && npm install && npm run dev) &
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
