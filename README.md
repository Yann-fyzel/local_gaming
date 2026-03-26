# 🎮 DiceLink - Plateforme de Jeux Multijoueurs en Réseau Local

Une plateforme de jeux stratégiques multijoueurs optimisée pour les réseaux locaux (LAN). Connectez-vous avec vos amis et affrontez-les dans une variété de jeux classiques sans latence !

## ✨ Caractéristiques Principales

- **🚀 Zéro Latence** : Architecture optimisée pour les réseaux locaux avec synchronisation en temps réel
- **👥 Jeu Multijoueur** : Jouez avec vos amis sur le même réseau LAN
- **🏆 Système de Classement** : Suivez vos statistiques et montez le classement local
- **📊 Historique des Parties** : Consultez toutes vos parties passées et vos résultats
- **🎨 Interface Moderne** : Design futuriste avec thème sombre et animations fluides
- **🔐 Authentification Sécurisée** : Système de login/register avec JWT
- **🌓 Mode Sombre** : Support du thème sombre pour une meilleure expérience

## 🎯 Jeux Disponibles

### 1. **Tic Tac Toe** (Morpion)

- Jeu classique 3x3
- Défiez un ami sur le même appareil

### 2. **Démineur** (Minesweeper)

- Découvrez les cases sans toucher aux mines
- Système de chronomètre pour mesurer votre vitesse

### 3. **Bataille Navale** (BattleShip)

- Positionnez vos navires en stratégie
- Attaquez la flotte adverse en temps réel

### 4. **Puissance 4**

- Alignez 4 jetons pour gagner
- Jeu stratégique classique

### 5. **Ludo**

- Jeu de course traditionnelle avec dés
- Affrontez jusqu'à 4 joueurs

## 🛠️ Stack Technologique

### Frontend

- **React 19** - Bibliothèque UI
- **Vite** - Build tool et dev server ultra-rapide
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router v7** - Navigation côté client

### État & Communication

- **Zustand** - Gestion d'état légère et performante
- **Socket.io Client** - Communication en temps réel WebSocket
- **Axios** - Client HTTP

### UI & UX

- **Lucide React** - Icônes minimalistes
- **React Hot Toast** - Notifications toast
- **React Confetti** - Effets de confettis pour les victoires

### Développement

- **TypeScript ESLint** - Linting et contrôle de qualité
- **PostCSS & Autoprefixer** - Traitement CSS cross-browser

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un serveur backend (API + Socket.io)

### Étapes

1. **Cloner le projet**

   ```bash
   git clone <your-repo-url>
   cd local_gaming
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Créer un fichier `.env` à la racine du projet :

   ```env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=ws://localhost:3000
   ```

4. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   ```

   L'application sera disponible à `http://localhost:5173`

## 📝 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler le projet TypeScript et générer la build de production
npm run build

# Prévisualiser la build de production en local
npm run preview

# Linter le code (ESLint)
npm run lint
```

## 📁 Structure du Projet

```
src/
├── api/                    # Configuration Axios pour les appels HTTP
├── assets/                 # Images et ressources statiques
├── components/             # Composants réutilisables
│   ├── ConsoleDebug.tsx   # Outil de debug
│   └── NavBar.tsx         # Barre de navigation
├── games/                  # Composants des différents jeux
│   ├── BattleShip/
│   ├── Demineur/
│   ├── Ludo/
│   ├── Puissance4/
│   └── TicTacToe/
├── hooks/                  # Hooks personnalisés
│   ├── useSocket.ts       # Gestion de la connexion Socket.io
│   └── useSocketEvents.ts # Événements Socket.io
├── store/                  # Stores Zustand (gestion d'état)
│   ├── useAuthStore.ts    # Authentification et user
│   ├── useLogStore.ts     # Logs système
│   ├── useSocketStore.ts  # État de connexion Socket
│   └── useThemeStore.ts   # Préférences de thème
├── types/                  # Types TypeScript
│   └── games.ts           # Interfaces pour les jeux et joueurs
├── views/                  # Pages/vues principales
│   ├── GameHistoryView.tsx      # Historique des parties
│   ├── HomePageView.tsx         # Page d'accueil
│   ├── LobbyView.tsx            # Lobby pour choisir un jeu
│   ├── LoginView.tsx            # Page de connexion
│   ├── MainLayout.tsx           # Layout principal
│   ├── ProfileView.tsx          # Profil utilisateur
│   └── RegisterView.tsx         # Inscription
├── App.tsx                 # Composant racine et routage
├── main.tsx               # Point d'entrée
└── index.css              # Styles globaux
```

## 🎮 Flux Utilisateur

```
HomePage (Landing Page)
  ↓
Register / Login
  ↓
MainLayout (Navigation persiste)
  ├─→ Lobby (Choisir un jeu)
  │    ↓
  │   Game View (Jeu spécifique)
  │
  ├─→ Profile (Profil utilisateur)
  │
  └─→ GameHistory (Historique)
```

## 🔌 Gestion d'État (Zustand)

Le projet utilise 4 stores principaux :

### `useAuthStore`

- Stocke l'utilisateur courant et le token JWT
- Persiste les données dans localStorage
- Gère la déconnexion

### `useSocketStore`

- Gère la connexion Socket.io
- Contrôle la connexion/déconnexion
- Permet la communication en temps réel

### `useThemeStore`

- Gestion du mode sombre/clair
- Applique les classes CSS au DOM

### `useLogStore`

- Logs système pour le debug
- Console virtuelle

## 🔄 Communication Temps Réel

Les événements Socket.io sont centralisés dans [src/hooks/useSocketEvents.ts](src/hooks/useSocketEvents.ts) :

- Événements de connexion/déconnexion
- Mise à jour des états des jeux
- Notifications en temps réel
- Synchronisation entre joueurs

## 🔐 Authentification

- **JWT Token** : Les tokens sont stockés en localStorage
- **Axios Interceptor** : Automatiquement inclus dans les requêtes
- **Routes Privées** : Protection des routes avec vérification du token
- **Déconnexion** : Nettoyage du localStorage et fermeture Socket.io

## 🎨 Styling

Le projet utilise **Tailwind CSS v4** avec :

- Système de couleurs custom (cyan/bleu/gris)
- Classes utilitaires pour la responsivité
- Animations et transitions fluides
- Support du mode sombre natif

## 🚀 Déploiement

### Build pour la Production

```bash
npm run build
```

Cela génère un dossier `dist/` prêt à être déployé.

### Variables d'Environnement Production

Avant le déploiement, mettez à jour les variables d'environnement :

```env
VITE_API_URL=https://api.votre-domaine.com
VITE_SOCKET_URL=wss://votre-domaine.com
```

## 📋 Prérequis Backend

Le frontend nécessite un serveur backend avec :

- **API REST** pour l'authentification (POST /auth/login, /auth/register)
- **Socket.io Server** pour la communication temps réel
- **Base de données** pour stocker les joueurs, parties et statistiques
- **CORS** configuré pour autoriser les requêtes du frontend

## 🐛 Troubleshooting

### "Cannot connect to server"

- Vérifiez que le backend est lancé
- Vérifiez les URLs dans le `.env` (protocole ws:// ou wss://)
- Vérifiez le CORS sur le backend

### "WebSocket connection failed"

- Assurez-vous que Socket.io est configuré sur le backend
- Vérifiez les pare-feu du réseau local

### Jeu figé ou lag

- Vérifiez la latence du réseau
- Consultez la Console Debug (ConsoleDebug.tsx)

## 🤝 Contribution

Pour contribuer au projet :

1. Créer une branche feature (`git checkout -b feature/ma-feature`)
2. Committer les changements (`git commit -m 'Add: ma-feature'`)
3. Pousser la branche (`git push origin feature/ma-feature`)
4. Ouvrir une Pull Request

## 📄 Licence

Ce projet est disponible sous licence [MIT](./LICENSE).

## 👨‍💻 Auteur

Développé comme plateforme de jeux multijoueurs pour réseau local.

## 📞 Support

Pour toute question ou issue :

- Consultez la [documentation officielle de React](https://react.dev)
- Consultez la [documentation officielle de Vite](https://vite.dev)
- Vérifiez les logs dans la Console de Développement (F12)

---

**Happy Gaming! 🎮**

Connectez-vous, défaites vos amis et montez le classement ! 🏆
