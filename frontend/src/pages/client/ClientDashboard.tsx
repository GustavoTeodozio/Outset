import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ClientSidebar } from '../../components/client/ClientSidebar';
import { DashboardHome } from './DashboardHome';
import { MediaLibrary } from './MediaLibrary';
import { TrainingCenter } from './TrainingCenter';
import { ReportsView } from './ReportsView';
import { OutsetIA } from './OutsetIA';

// Ícone SVG para logout
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export function ClientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Títulos dinâmicos baseados na rota
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/client' || path === '/client/') return 'Dashboard';
    if (path.startsWith('/client/media')) return 'Mídias';
    if (path.startsWith('/client/training')) return 'Treinamentos';
    if (path.startsWith('/client/reports')) return 'Relatórios';
    if (path.startsWith('/client/ai')) return 'Outset IA';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.4,
        }}
      ></div>

      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 relative">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center h-16 px-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-1 rounded-full bg-purple-500"></div>
              <h2 className="text-lg font-semibold text-gray-800 font-outer-sans">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 font-outer-sans hidden md:block">
                    {user.name}
                  </span>
                </div>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 font-outer-sans group"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <main className="relative py-8 px-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="training" element={<TrainingCenter />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="ai" element={<OutsetIA />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

