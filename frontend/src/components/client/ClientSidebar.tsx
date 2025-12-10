import { Link, useLocation } from 'react-router-dom';

export function ClientSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/client') {
      return location.pathname === '/client';
    }
    return location.pathname.startsWith(path);
  };

  // Ícones SVG
  const DashboardIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const MediaIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const TrainingIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const ReportsIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const AIIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const menuItems = [
    {
      path: '/client',
      label: 'Dashboard',
      icon: DashboardIcon,
      description: 'Visão geral',
    },
    {
      path: '/client/media',
      label: 'Mídias',
      icon: MediaIcon,
      description: 'Conteúdos e materiais',
    },
    {
      path: '/client/training',
      label: 'Treinamentos',
      icon: TrainingIcon,
      description: 'Cursos e aprendizado',
    },
    {
      path: '/client/reports',
      label: 'Relatórios',
      icon: ReportsIcon,
      description: 'Análises e métricas',
    },
    {
      path: '/client/ai',
      label: 'Outset IA',
      icon: AIIcon,
      description: 'Automação inteligente',
      badge: 'BETA',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 shadow-2xl z-40 flex flex-col bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 backdrop-blur-sm">
        <Link 
          to="/client" 
          className="flex items-center gap-3 group"
        >
          <img 
            src="/LOGO.png" 
            alt="Outset Logo" 
            className="h-12 object-contain group-hover:opacity-90 transition-opacity duration-200 drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                ${active
                  ? 'bg-white text-purple-600 shadow-lg shadow-purple-900/20 transform scale-[1.02]'
                  : 'text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md hover:scale-[1.01]'
                }
              `}
            >
              {/* Active indicator */}
              {active && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-r-full shadow-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50/10 to-transparent rounded-xl"></div>
                </>
              )}
              
              <div className={`relative z-10 ${active ? 'scale-110 text-purple-600' : 'group-hover:scale-110'} transition-transform duration-200`}>
                <item.icon active={active} />
              </div>
              
              <div className="flex-1 relative z-10">
                <div className={`font-semibold text-sm font-outer-sans ${active ? 'text-purple-700' : 'text-white'}`}>
                  {item.label}
                </div>
                <div className={`text-xs mt-0.5 font-outer-sans ${active ? 'text-purple-500' : 'text-white/70'}`}>
                  {item.description}
                </div>
              </div>

              {/* Badge (BETA) */}
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold relative z-10 ${
                  active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Active checkmark */}
              {active && !item.badge && (
                <span className="text-purple-600 relative z-10 font-bold">
                  ✓
                </span>
              )}
              
              {/* Hover arrow */}
              {!active && !item.badge && (
                <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-10">
                  →
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - User info */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-xs text-white/70 font-outer-sans mb-1">Desenvolvido por</p>
          <p className="text-sm font-bold text-white font-outer-sans">Outset Marketing</p>
        </div>
      </div>
    </aside>
  );
}

