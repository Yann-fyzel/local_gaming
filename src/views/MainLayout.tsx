import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/NavBar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#0a0f12]">
            <Navbar />
            <main>
                {/* C'est ici que tes pages de jeux s'afficheront */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
