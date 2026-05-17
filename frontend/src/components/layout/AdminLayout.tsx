import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, LogOut, LayoutDashboard, FileText, Users, ClipboardList } from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    // Мок авторизації для демо-версії ЦМС
    const isAuthenticated = localStorage.getItem('isAdmin') === 'true';

    const navItem = (to: string, label: string, icon: React.ReactNode) => {
        const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
                {icon}
                {label}
            </Link>
        );
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-5 border-b border-slate-800">
                    <Link to="/" className="text-lg font-bold text-white hover:text-dnu-blue transition-colors flex items-center gap-2">
                        <Settings className="w-5 h-5 text-dnu-blue" />
                        CNO Admin
                    </Link>
                </div>
                <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
                    {navItem('/admin', 'Дашборд', <LayoutDashboard className="w-5 h-5 text-gray-400" />)}
                    {navItem('/admin/applications', 'Заявки', <ClipboardList className="w-5 h-5 text-gray-400" />)}
                    {navItem('/admin/programs', 'Програми', <FileText className="w-5 h-5 text-gray-400" />)}
                    {navItem('/admin/users', 'Слухачі', <Users className="w-5 h-5 text-gray-400" />)}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Вийти
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
