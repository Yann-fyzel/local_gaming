import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useSocketStore } from './store/useSocketStore';
import { useSocketEvents } from './hooks/useSocketEvents';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';


import { LoginView } from './views/LoginView';
import { LobbyView } from './views/LobbyView';
import { TicTacToeView } from './games/TicTacToe/TictacToeView';
import { HistoryView } from './views/GameHistoryView';
import { MinesweeperView } from './games/Demineur/DemineurView';
import { BattleShipView } from './games/BattleShip/BattleShipView';
import { RegisterView } from './views/RegisterView';
import HomePage from './views/HomePageView';
import Puissance4 from './games/Puissance4/Puissance4';
import MainLayout from './views/MainLayout';
import { ProfileView } from './views/ProfileView';
import LudoView from './games/Ludo/LudoView';



const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/" />; // Redirige si pas de JWT
};

export default function App() {

  const token = useAuthStore(s => s.token);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [token, connect, disconnect]);
  useSocketEvents();
  const isDark = useThemeStore(s => s.isDark);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);



  return (
    <>
      <Toaster position='top-right' />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>

            <Route path="/lobby" element={<LobbyView user={user} />} />
            <Route path='/profile' element={<ProfileView />} />
            <Route path="/history" element={<HistoryView />} />


            <Route path="/game/tictactoe" element={<TicTacToeView />} />
            <Route path="/game/minesweeper" element={<MinesweeperView />} />
            <Route path="/game/battleship" element={<BattleShipView />} />
            <Route path="/game/puissance4" element={<Puissance4 />} />
            <Route path="/game/ludo" element={<LudoView />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

