import { Link, useLocation } from 'react-router-dom';

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Ícones SVG minimalistas
  const DashboardIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ClientsIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const CampaignsIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );

  const ContentsIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );

  const TrainingIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const KanbanIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
    </svg>
  );

  const DesignerIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const SettingsIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: DashboardIcon,
      description: 'Visão geral',
    },
    {
      path: '/admin/kanban',
      label: 'Kanban',
      icon: KanbanIcon,
      description: 'Fluxo de trabalho',
    },
    {
      path: '/admin/clients',
      label: 'Clientes',
      icon: ClientsIcon,
      description: 'Gestão de clientes',
    },
    {
      path: '/admin/campaigns',
      label: 'Campanhas',
      icon: CampaignsIcon,
      description: 'Criar e gerenciar',
    },
    {
      path: '/admin/contents',
      label: 'Conteúdos',
      icon: ContentsIcon,
      description: 'Mídias e materiais',
    },
    {
      path: '/admin/designer',
      label: 'Designer',
      icon: DesignerIcon,
      description: 'Aprovações de conteúdo',
    },
    {
      path: '/admin/training',
      label: 'Treinamentos',
      icon: TrainingIcon,
      description: 'Cursos e aulas',
    },
    {
      path: '/admin/settings',
      label: 'Configurações',
      icon: SettingsIcon,
      description: 'Perfil e API',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 shadow-2xl z-40 flex flex-col" style={{ backgroundColor: '#542693' }}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-purple-600/50" style={{ backgroundColor: 'rgba(84, 38, 147, 0.3)' }}>
        <Link 
          to="/admin" 
          className="flex items-center gap-3 group"
        >
          <img 
            src="/LOGO.png" 
            alt="Outset Logo" 
            className="h-12 object-contain group-hover:opacity-90 transition-opacity duration-200"
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
                group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${active
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 transform scale-[1.02]'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white hover:shadow-md'
                }
              `}
            >
              {/* Active indicator */}
              {active && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-300 rounded-r-full shadow-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent rounded-xl"></div>
                </>
              )}
              
              <div className={`relative z-10 ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
                <item.icon active={active} />
              </div>
              
              <div className="flex-1 relative z-10">
                <div className={`font-semibold text-sm font-outer-sans ${active ? 'text-white' : 'text-purple-100'}`}>
                  {item.label}
                </div>
                <div className={`text-xs mt-0.5 font-outer-sans ${active ? 'text-orange-100' : 'text-purple-300'}`}>
                  {item.description}
                </div>
              </div>

              {/* Hover arrow */}
              {!active && (
                <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-10">
                  →
                </span>
              )}
              
              {/* Active checkmark */}
              {active && (
                <span className="text-white relative z-10">
                  ✓
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

