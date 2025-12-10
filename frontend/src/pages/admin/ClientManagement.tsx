import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

// Ícones SVG minimalistas
const UserIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UnlockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export function ClientManagement() {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [clientForApiKey, setClientForApiKey] = useState<{ id: string; name: string; metaApiKey?: string } | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    businessName: '',
    segment: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    logo: null as File | null,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['admin', 'clients'],
    queryFn: async () => {
      const response = await api.get('/admin/clients');
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const formDataToSend = new FormData();
      formDataToSend.append('tenantName', data.tenantName);
      formDataToSend.append('businessName', data.businessName);
      formDataToSend.append('contactName', data.contactName);
      formDataToSend.append('contactEmail', data.contactEmail);
      formDataToSend.append('password', data.password);
      if (data.segment) {
        formDataToSend.append('segment', data.segment);
      }
      if (data.contactPhone) {
        formDataToSend.append('contactPhone', data.contactPhone);
      }
      if (data.logo) {
        formDataToSend.append('logo', data.logo);
      }

      const response = await api.post('/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      setShowForm(false);
      setFormData({
        tenantName: '',
        businessName: '',
        segment: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        password: '',
        logo: null,
      });
      setLogoPreview(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ clientId, isActive }: { clientId: string; isActive: boolean }) => {
      const response = await api.patch(`/admin/clients/${clientId}/status`, { isActive });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await api.delete(`/admin/clients/${clientId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      setShowDeleteModal(false);
      setClientToDelete(null);
    },
  });

  const updateApiKeyMutation = useMutation({
    mutationFn: async ({ clientId, metaApiKey }: { clientId: string; metaApiKey: string }) => {
      const response = await api.patch(`/admin/clients/${clientId}/api-key`, { metaApiKey });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      setShowApiKeyModal(false);
      setClientForApiKey(null);
      setApiKeyValue('');
      setShowApiKey(false);
    },
  });

  const handleToggleStatus = (clientId: string, currentStatus: boolean) => {
    if (window.confirm(`Tem certeza que deseja ${currentStatus ? 'bloquear' : 'desbloquear'} o acesso deste cliente?`)) {
      updateStatusMutation.mutate({ clientId, isActive: !currentStatus });
    }
  };

  const handleApiKeyClick = (client: any) => {
    setClientForApiKey({
      id: client.id,
      name: client.name || client.clients?.businessName || 'Cliente',
      metaApiKey: client.clients?.metaApiKey,
    });
    setApiKeyValue(client.clients?.metaApiKey || '');
    setShowApiKey(false);
    setShowApiKeyModal(true);
  };

  const handleSaveApiKey = () => {
    if (!clientForApiKey) return;
    updateApiKeyMutation.mutate({
      clientId: clientForApiKey.id,
      metaApiKey: apiKeyValue,
    });
  };

  const handleDeleteClick = (client: any) => {
    setClientToDelete({ id: client.id, name: client.name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClientMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0 animate-fade-in">
        <div className="card-gradient text-center py-12">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <WarningIcon />
          </div>
          <p className="text-red-600 mb-4 font-medium">Erro ao carregar clientes. Tente novamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-2 font-outer-sans">
            Gestão de Clientes
          </h1>
          <p className="text-gray-600 font-outer-sans">Gerencie e cadastre novos clientes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2 font-outer-sans"
        >
          {showForm ? <XIcon /> : <PlusIcon />}
          <span>{showForm ? 'Cancelar' : 'Cadastrar Cliente'}</span>
        </button>
      </div>

      {showForm && (
        <div className="card-gradient mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <UserIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 font-outer-sans">Cadastrar Novo Cliente</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 font-outer-sans">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData({ ...formData, tenantName: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Negócio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Segmento
                </label>
                <input
                  type="text"
                  value={formData.segment}
                  onChange={(e) =>
                    setFormData({ ...formData, segment: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Contato *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email do Contato *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone do Contato
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha Inicial *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Logo da Empresa
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, logo: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="input"
                />
                {logoPreview && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg border border-purple-200 inline-block">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Preview:</p>
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-white shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createClientMutation.isPending}
                className="btn btn-primary"
              >
                {createClientMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
          {createClientMutation.isError && (
            <div className="mt-4 text-red-600">
              Erro ao cadastrar cliente. Tente novamente.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {Array.isArray(clients) && clients.length > 0 ? (
          clients.map((client: any, index: number) => (
            <div
              key={client.id}
              className={`card-interactive ${client.isActive === false ? 'opacity-75 border-2 border-red-300 bg-red-50' : ''} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 flex gap-4">
                  {client.clients?.logoUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={client.clients.logoUrl}
                        alt={client.name}
                        className={`w-16 h-16 object-cover rounded-lg border ${
                          client.isActive === false ? 'opacity-50' : ''
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-gray-800 font-outer-sans">{client.name || 'Sem nome'}</h3>
                      {client.isActive === false && (
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold font-outer-sans border border-red-200">
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                  {client.clients ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-600 font-semibold font-outer-sans">Negócio:</span>
                        <span className="font-outer-sans">{client.clients.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-600 font-semibold font-outer-sans">Contato:</span>
                        <span className="font-outer-sans">{client.clients.mainContact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-600 font-semibold font-outer-sans">Email:</span>
                        <span className="font-outer-sans">{client.clients.mainEmail}</span>
                      </div>
                      {client.clients.mainPhone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-purple-600 font-semibold font-outer-sans">Telefone:</span>
                          <span className="font-outer-sans">{client.clients.mainPhone}</span>
                        </div>
                      )}
                      {client.clients.segment && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-purple-600 font-semibold font-outer-sans">Segmento:</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-outer-sans">{client.clients.segment}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic font-outer-sans">
                      Perfil do cliente não configurado
                    </p>
                  )}
                    <p className="text-xs text-gray-500 mt-3 font-outer-sans">
                      Cadastrado em:{' '}
                      {client.createdAt
                        ? new Date(client.createdAt).toLocaleDateString('pt-BR')
                        : 'Data não disponível'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold font-outer-sans border ${
                      client.isActive !== false
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {client.isActive !== false ? '✓ Ativo' : '✗ Bloqueado'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(client.id, client.isActive !== false)}
                      disabled={updateStatusMutation.isPending}
                      className={`btn text-sm flex items-center gap-1.5 font-outer-sans ${
                        client.isActive !== false
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                          : 'btn-primary'
                      }`}
                    >
                      {client.isActive !== false ? <LockIcon /> : <UnlockIcon />}
                      <span>{client.isActive !== false ? 'Bloquear' : 'Desbloquear'}</span>
                    </button>
                    <button
                      onClick={() => handleApiKeyClick(client)}
                      className="btn btn-primary text-sm flex items-center gap-1.5 font-outer-sans"
                    >
                      <KeyIcon />
                      <span>API Key</span>
                    </button>
                    <Link
                      to={`/admin/clients/${client.id}`}
                      className="btn btn-secondary text-sm flex items-center gap-1.5 font-outer-sans"
                    >
                      <SettingsIcon />
                      <span>Gerenciar</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(client)}
                      disabled={deleteClientMutation.isPending}
                      className="btn btn-danger text-sm flex items-center gap-1.5 font-outer-sans"
                    >
                      <TrashIcon />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card-gradient text-center py-16 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
              <UsersIcon />
            </div>
            <p className="text-gray-600 mb-2 text-lg font-medium font-outer-sans">
              Nenhum cliente cadastrado ainda.
            </p>
            <p className="text-gray-500 text-sm mb-6 font-outer-sans">
              Comece cadastrando seu primeiro cliente
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary flex items-center gap-2 font-outer-sans"
            >
              <PlusIcon />
              <span>Cadastrar Primeiro Cliente</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-red-200 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <WarningIcon />
              <h2 className="text-2xl font-bold text-red-600 font-outer-sans">Confirmar Exclusão</h2>
            </div>
            <p className="text-gray-700 mb-4 font-outer-sans">
              Tem certeza que deseja excluir o cliente <strong className="font-semibold">{clientToDelete.name}</strong>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <WarningIcon />
                <h3 className="font-bold text-red-800 font-outer-sans">ATENÇÃO: Esta ação é IRREVERSÍVEL!</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside font-outer-sans">
                <li>Todos os dados do cliente serão <strong>permanentemente excluídos</strong></li>
                <li>Todas as <strong>campanhas</strong> serão perdidas</li>
                <li>Todos os <strong>conteúdos e mídias</strong> serão removidos</li>
                <li>Todos os <strong>relatórios</strong> serão deletados</li>
                <li>Todos os <strong>treinamentos</strong> serão perdidos</li>
                <li>Todos os <strong>resultados e leads</strong> serão excluídos</li>
                <li>Os <strong>usuários</strong> do cliente serão removidos</li>
                <li><strong>Nada será salvo ou recuperado</strong></li>
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setClientToDelete(null);
                }}
                className="btn btn-secondary font-outer-sans"
                disabled={deleteClientMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteClientMutation.isPending}
                className="btn btn-danger flex items-center gap-2 font-outer-sans"
              >
                {deleteClientMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon />
                    <span>Sim, Excluir Permanentemente</span>
                  </>
                )}
              </button>
            </div>
            {deleteClientMutation.isError && (
              <div className="mt-4 text-red-600 text-sm">
                Erro ao excluir cliente. Tente novamente.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de API Key */}
      {showApiKeyModal && clientForApiKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                    <KeyIcon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 font-outer-sans">Chave API da Meta</h3>
                    <p className="text-sm text-gray-600 font-outer-sans">{clientForApiKey.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowApiKeyModal(false);
                    setClientForApiKey(null);
                    setApiKeyValue('');
                    setShowApiKey(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 font-outer-sans">
                  Chave de API da Meta (Facebook/Instagram)
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    className="input font-outer-sans pr-10"
                    placeholder="Cole sua chave de API da Meta aqui"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showApiKey ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-outer-sans">
                  Esta chave será usada para acessar as APIs do Facebook/Instagram e gerenciar campanhas e métricas deste cliente.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowApiKeyModal(false);
                    setClientForApiKey(null);
                    setApiKeyValue('');
                    setShowApiKey(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors font-outer-sans"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveApiKey}
                  disabled={updateApiKeyMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl font-outer-sans flex items-center justify-center gap-2"
                >
                  {updateApiKeyMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Chave</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

