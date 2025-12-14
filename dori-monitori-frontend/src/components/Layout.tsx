import { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Activity, User, Terminal } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Layout() {
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname.startsWith(path)
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white';

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl tracking-wider">
                    <Activity className="text-indigo-500 mr-2" /> DORI<span className="text-indigo-400">-M</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard')}`}>
                        <Activity size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/projects" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/projects')}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Projetos</span>
                    </Link>
                    <Link to="/logs" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/logs')}`}>
                        <Terminal size={20} />
                        <span className="font-medium">Logs</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 w-full transition font-medium">
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-100">
                    <h2 className="text-slate-500 font-medium">Painel de Controle</h2>
                    <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full">
                        <User size={16} className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-700">Admin</span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
