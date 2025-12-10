import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminDashboardHome } from './AdminDashboardHome';
import { KanbanBoard } from './KanbanBoard';
import { ClientManagement } from './ClientManagement';
import { ClientDetails } from './ClientDetails';
import { CampaignsManagement } from './CampaignsManagement';
import { ContentManagement } from './ContentManagement';
import { DesignerApprovals } from './DesignerApprovals';
import { TrainingManagement } from './TrainingManagement';
import { Settings } from './Settings';

// Ícone SVG minimalista para logout
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    // Throttle para 60fps (aproximadamente 16ms)
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Títulos dinâmicos baseados na rota
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'Dashboard';
    if (path.startsWith('/admin/kanban')) return 'Kanban - Fluxo de Trabalho';
    if (path.startsWith('/admin/clients')) return 'Gestão de Clientes';
    if (path.startsWith('/admin/campaigns')) return 'Campanhas';
    if (path.startsWith('/admin/contents')) return 'Conteúdos';
    if (path.startsWith('/admin/designer')) return 'Designer - Aprovações';
    if (path.startsWith('/admin/training')) return 'Treinamentos';
    if (path.startsWith('/admin/settings')) return 'Configurações';
    return 'Dashboard';
  };

  return (
    <div 
      className="min-h-screen bg-white flex relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Pattern Background - Optimized Single Layer */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.15,
          willChange: 'auto',
        }}
      ></div>

      {/* Subtle Animated Layer - Only if mouse is moving */}
      {mousePosition.x > 0 && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: 0,
            top: 0,
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, rgba(84, 38, 147, 0.06) 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            willChange: 'transform',
            transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
            transition: 'opacity 0.3s ease-out',
          }}
        ></div>
      )}

      {/* Sidebar */}
      <AdminSidebar />

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
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
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
            <Route index element={<AdminDashboardHome />} />
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="clients/:clientId" element={<ClientDetails />} />
            <Route path="campaigns" element={<CampaignsManagement />} />
            <Route path="contents" element={<ContentManagement />} />
            <Route path="designer" element={<DesignerApprovals />} />
            <Route path="training" element={<TrainingManagement />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

