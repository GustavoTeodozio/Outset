import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

// Ícones SVG minimalistas
const LeadsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SalesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const GrowthIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export function DashboardHome() {
  const queryClient = useQueryClient();
  const [syncingFacebook, setSyncingFacebook] = useState(false);
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/client/dashboard/summary');
      return response.data;
    },
  });

  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await api.get('/admin/campaigns');
      return response.data;
    },
  });

  const syncFacebookMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/client/facebook/sync');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`${data.total} campanhas sincronizadas com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSyncingFacebook(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao sincronizar. Verifique se a API Key está configurada');
      setSyncingFacebook(false);
    },
  });

  const handleSyncFacebook = () => {
    setSyncingFacebook(true);
    syncFacebookMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-outer-sans">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Leads Recebidos',
      value: data?.leadsReceived || 0,
      icon: LeadsIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      label: 'Vendas Fechadas',
      value: data?.salesClosed || 0,
      icon: SalesIcon,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      label: '% Fechamento',
      value: `${data?.closeRate ? data.closeRate.toFixed(1) : 0}%`,
      icon: ChartIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      label: 'Crescimento',
      value: `${data?.growthPercent ? data.growthPercent.toFixed(1) : 0}%`,
      icon: GrowthIcon,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2 font-outer-sans">
            Dashboard
          </h1>
          <p className="text-gray-600 font-outer-sans">Visão geral do seu desempenho e métricas</p>
        </div>
        <button
          onClick={handleSyncFacebook}
          disabled={syncingFacebook || syncFacebookMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold font-outer-sans shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className={`w-5 h-5 ${syncingFacebook ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {syncingFacebook ? 'Sincronizando...' : 'Sincronizar Facebook'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card-gradient animate-slide-up group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2 font-outer-sans">{stat.label}</h3>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-outer-sans`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-gradient animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ChartIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 font-outer-sans">Evolução Mensal</h2>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg border border-purple-200">
            <p className="text-gray-500 font-outer-sans">Gráfico de evolução será implementado aqui</p>
          </div>
        </div>
        <div className="card-gradient animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 font-outer-sans">Conteúdos Novos</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1 font-outer-sans">Mídias</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent font-outer-sans">
                {data?.newContentSummary?.mediaAssets || 0} novos conteúdos este mês
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 mb-1 font-outer-sans">Aulas</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent font-outer-sans">
                {data?.newContentSummary?.lessons || 0} novas aulas este mês
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campanhas do Facebook */}
      {campaignsData && campaignsData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-outer-sans flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Campanhas do Facebook
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignsData.map((campaign: any, index: number) => (
              <div
                key={campaign.id}
                className="card-gradient animate-slide-up group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1 font-outer-sans">
                      {campaign.name}
                    </h3>
                    {campaign.objective && (
                      <p className="text-sm text-gray-600 font-outer-sans">
                        {campaign.objective}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {campaign.status === 'ACTIVE' ? 'Ativa' :
                     campaign.status === 'PAUSED' ? 'Pausada' :
                     campaign.status === 'COMPLETED' ? 'Concluída' : 'Rascunho'}
                  </span>
                </div>

                {campaign.dailyBudget && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-sm text-green-700 font-semibold font-outer-sans">Orçamento Diário</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {parseFloat(campaign.dailyBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {campaign.startDate && (
                  <div className="mt-3 text-xs text-gray-500 font-outer-sans">
                    Início: {new Date(campaign.startDate).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aviso se não houver API Key */}
      {(!campaignsData || campaignsData.length === 0) && (
        <div className="mt-8 card-gradient text-center py-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-semibold font-outer-sans mb-2">
            Configure a API Key do Facebook para ver suas campanhas
          </p>
          <p className="text-gray-500 text-sm font-outer-sans">
            Entre em contato com o administrador para configurar a integração
          </p>
        </div>
      )}

      {/* Toast Notifications */}
      {toast.toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => toast.removeToast(t.id)}
        />
      ))}
    </div>
  );
}

