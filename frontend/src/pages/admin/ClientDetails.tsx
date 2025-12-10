import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

export function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'contents'>('campaigns');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    objective: '',
    budgetStrategy: 'DAILY' as 'DAILY' | 'LIFETIME',
    dailyBudget: '',
    lifetimeBudget: '',
    startDate: '',
    endDate: '',
  });

  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    category: '',
    type: 'IMAGE',
    file: null as File | null,
  });

  const queryClient = useQueryClient();

  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['admin', 'client', clientId],
    queryFn: async () => {
      const response = await api.get('/admin/clients');
      const clients = response.data;
      return clients.find((c: any) => c.id === clientId);
    },
    enabled: !!clientId,
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['admin', 'campaigns', clientId],
    queryFn: async () => {
      const response = await api.get('/admin/campaigns');
      return response.data.filter((c: any) => c.tenantId === clientId);
    },
    enabled: !!clientId && activeTab === 'campaigns',
  });

  const { data: media, isLoading: mediaLoading } = useQuery({
    queryKey: ['admin', 'media', clientId],
    queryFn: async () => {
      const response = await api.get('/admin/media');
      return {
        items: response.data.items?.filter((m: any) => m.tenantId === clientId) || [],
      };
    },
    enabled: !!clientId && activeTab === 'contents',
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        tenantId: clientId,
        dailyBudget: data.dailyBudget ? Number(data.dailyBudget) : undefined,
        lifetimeBudget: data.lifetimeBudget ? Number(data.lifetimeBudget) : undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      };
      const response = await api.post('/admin/campaigns', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns', clientId] });
      setShowCampaignForm(false);
      setCampaignForm({
        name: '',
        objective: '',
        budgetStrategy: 'DAILY',
        dailyBudget: '',
        lifetimeBudget: '',
        startDate: '',
        endDate: '',
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/admin/media', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media', clientId] });
      setShowContentForm(false);
      setContentForm({
        title: '',
        description: '',
        category: '',
        type: 'IMAGE',
        file: null,
      });
    },
  });

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCampaignMutation.mutate(campaignForm);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm.file) {
      alert('Selecione um arquivo');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', contentForm.file);
    formDataToSend.append('title', contentForm.title);
    formDataToSend.append('tenantId', clientId!);
    if (contentForm.description) {
      formDataToSend.append('description', contentForm.description);
    }
    if (contentForm.category) {
      formDataToSend.append('category', contentForm.category);
    }
    formDataToSend.append('type', contentForm.type);

    uploadMutation.mutate(formDataToSend);
  };

  if (clientLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (!client) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">Cliente não encontrado</p>
          <Link to="/admin/clients" className="btn btn-primary">
            Voltar para Clientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link to="/admin/clients" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Voltar para Clientes
        </Link>
        <div className="flex items-center gap-4">
          {client.clients?.logoUrl && (
            <img
              src={client.clients.logoUrl}
              alt={client.name}
              className="w-20 h-20 object-cover rounded-lg border"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            {client.clients && (
              <div className="mt-2 text-gray-600">
                <p><strong>Negócio:</strong> {client.clients.businessName}</p>
                <p><strong>Contato:</strong> {client.clients.mainContact}</p>
                <p><strong>Email:</strong> {client.clients.mainEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campanhas
          </button>
          <button
            onClick={() => setActiveTab('contents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Conteúdos
          </button>
        </nav>
      </div>

      {activeTab === 'campaigns' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Campanhas</h2>
            <button
              onClick={() => setShowCampaignForm(!showCampaignForm)}
              className="btn btn-primary"
            >
              {showCampaignForm ? 'Cancelar' : '+ Criar Campanha'}
            </button>
          </div>

          {showCampaignForm && (
            <div className="card mb-6">
              <h3 className="text-xl font-bold mb-4">Nova Campanha</h3>
              <form onSubmit={handleCampaignSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome da Campanha *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignForm.name}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Objetivo
                  </label>
                  <textarea
                    value={campaignForm.objective}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, objective: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Estratégia de Orçamento
                    </label>
                    <select
                      value={campaignForm.budgetStrategy}
                      onChange={(e) =>
                        setCampaignForm({
                          ...campaignForm,
                          budgetStrategy: e.target.value as 'DAILY' | 'LIFETIME',
                        })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="DAILY">Diário</option>
                      <option value="LIFETIME">Total</option>
                    </select>
                  </div>
                  {campaignForm.budgetStrategy === 'DAILY' ? (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Orçamento Diário (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={campaignForm.dailyBudget}
                        onChange={(e) =>
                          setCampaignForm({ ...campaignForm, dailyBudget: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Orçamento Total (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={campaignForm.lifetimeBudget}
                        onChange={(e) =>
                          setCampaignForm({ ...campaignForm, lifetimeBudget: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={createCampaignMutation.isPending}
                    className="btn btn-primary"
                  >
                    {createCampaignMutation.isPending ? 'Criando...' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {campaignsLoading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {campaigns?.map((campaign: any) => (
                <div key={campaign.id} className="card">
                  <h3 className="text-lg font-bold mb-2">{campaign.name}</h3>
                  {campaign.objective && (
                    <p className="text-sm text-gray-600 mb-2">{campaign.objective}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                    {campaign.dailyBudget && (
                      <span>Orç. Diário: R$ {campaign.dailyBudget.toFixed(2)}</span>
                    )}
                    {campaign.lifetimeBudget && (
                      <span>Orç. Total: R$ {campaign.lifetimeBudget.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
              {(!campaigns || campaigns.length === 0) && (
                <div className="card text-center py-12">
                  <p className="text-gray-500">Nenhuma campanha criada ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'contents' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Conteúdos</h2>
            <button
              onClick={() => setShowContentForm(!showContentForm)}
              className="btn btn-primary"
            >
              {showContentForm ? 'Cancelar' : '+ Upload de Conteúdo'}
            </button>
          </div>

          {showContentForm && (
            <div className="card mb-6">
              <h3 className="text-xl font-bold mb-4">Upload de Conteúdo</h3>
              <form onSubmit={handleContentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={contentForm.title}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <input
                      type="text"
                      value={contentForm.category}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                      value={contentForm.type}
                      onChange={(e) =>
                        setContentForm({ ...contentForm, type: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="IMAGE">Imagem</option>
                      <option value="VIDEO">Vídeo</option>
                      <option value="DOCUMENT">Documento</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Arquivo *</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setContentForm({ ...contentForm, file });
                      }
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="btn btn-primary"
                  >
                    {uploadMutation.isPending ? 'Enviando...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {mediaLoading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {media?.items?.map((item: any) => (
                <div key={item.id} className="card">
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    {item.category && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {item.category}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      {item.type}
                    </span>
                  </div>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-sm"
                  >
                    Ver Arquivo
                  </a>
                </div>
              ))}
              {(!media?.items || media.items.length === 0) && (
                <div className="card text-center py-12 col-span-3">
                  <p className="text-gray-500">Nenhum conteúdo enviado ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

