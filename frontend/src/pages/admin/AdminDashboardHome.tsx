import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../api/client';

const COLORS = ['#9333ea', '#f97316', '#10b981', '#ef4444', '#eab308'];

// Ícones SVG minimalistas
const UsersIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ChartPieIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H11V2.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function AdminDashboardHome() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Clientes Ativos', valor: stats?.activeClients || 0 },
    { name: 'Campanhas', valor: stats?.totalCampaigns || 0 },
    { name: 'Conteúdos', valor: stats?.totalMedia || 0 },
  ];

  const clientStatusPieData = [
    { name: 'Ativos', value: stats?.activeClients || 0 },
    { name: 'Pausados', value: stats?.pausedClients || 0 },
    { name: 'Cancelados', value: stats?.cancelledClients || 0 },
  ].filter((item) => item.value > 0);

  const STATUS_PIE_COLORS = ['#10b981', '#eab308', '#ef4444'];

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="px-4 py-6 sm:px-0 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600 font-outer-sans text-lg">Bem-vindo ao painel administrativo. Gerencie seus clientes, campanhas e conteúdos de forma eficiente.</p>
      </div>

      {/* Cards de Estatísticas - linha 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Clientes Ativos */}
        <div className="stat-card group animate-slide-up hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <UsersIcon />
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1 font-outer-sans">Clientes Ativos</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent font-outer-sans">
              {stats?.activeClients || 0}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-gray-500 font-outer-sans">
              <span className="text-yellow-600">{stats?.pausedClients || 0} pausados</span>
              <span className="text-red-500">{stats?.cancelledClients || 0} cancelados</span>
            </div>
          </div>
        </div>

        {/* MRR */}
        <div className="stat-card group animate-slide-up hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <CurrencyIcon />
              </div>
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1 font-outer-sans">MRR Previsto</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent font-outer-sans">
              {formatCurrency(stats?.mrr || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-outer-sans">Receita mensal recorrente (ativos)</p>
          </div>
        </div>

        {/* LT */}
        <div className="stat-card group animate-slide-up hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ClockIcon />
              </div>
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1 font-outer-sans">LT Médio</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent font-outer-sans">
              {stats?.lt ?? 0}
              <span className="text-lg ml-1 text-gray-500">m</span>
            </p>
            <p className="text-xs text-gray-500 mt-2 font-outer-sans">Tempo médio de permanência</p>
          </div>
        </div>

        {/* Campanhas */}
        <div className="stat-card group animate-slide-up hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <MegaphoneIcon />
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1 font-outer-sans">Campanhas</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent font-outer-sans">
              {stats?.totalCampaigns || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-outer-sans">Total de campanhas criadas</p>
          </div>
        </div>
      </div>

      {/* Cards - linha 2: Conteúdos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card group animate-slide-up hover:scale-[1.02] transition-transform duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <FolderIcon />
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2 font-outer-sans">Conteúdos Enviados</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent font-outer-sans">
              {stats?.totalMedia || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-outer-sans">Arquivos enviados</p>
          </div>
        </div>

        {/* Resumo status clientes */}
        <div className="stat-card group animate-slide-up col-span-1 md:col-span-2" style={{ animationDelay: '0.1s' }}>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-600 mb-4 font-outer-sans">Status dos Clientes</h3>
            <div className="flex gap-4 items-center">
              {[
                { label: 'Ativos', value: stats?.activeClients || 0, color: 'bg-green-500', text: 'text-green-700' },
                { label: 'Pausados', value: stats?.pausedClients || 0, color: 'bg-yellow-500', text: 'text-yellow-700' },
                { label: 'Cancelados', value: stats?.cancelledClients || 0, color: 'bg-red-500', text: 'text-red-700' },
              ].map((item) => (
                <div key={item.label} className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-2`}></div>
                  <p className={`text-2xl font-bold ${item.text} font-outer-sans`}>{item.value}</p>
                  <p className="text-xs text-gray-500 font-outer-sans">{item.label}</p>
                </div>
              ))}
              <div className="flex-1 text-center p-3 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-700 font-outer-sans">{stats?.totalClients || 0}</p>
                <p className="text-xs text-gray-500 font-outer-sans">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Barras */}
        <div className="card-gradient animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 font-outer-sans">Estatísticas Gerais</h2>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ChartBarIcon />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#e5e7eb' }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Status Clientes */}
        <div className="card-gradient animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 font-outer-sans">Distribuição de Clientes</h2>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <ChartPieIcon />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientStatusPieData.length > 0 ? clientStatusPieData : [{ name: 'Sem dados', value: 1 }]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={100}
                innerRadius={40}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {clientStatusPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_PIE_COLORS[index % STATUS_PIE_COLORS.length]} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
                ))}
                {clientStatusPieData.length === 0 && <Cell fill="#e5e7eb" />}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
