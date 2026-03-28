import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';

const PLAN_LABELS: Record<string, string> = {
  START: 'Start',
  MASTER: 'Master',
  PREMIUM: 'Premium',
  CUSTOM: 'Personalizado',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  PAUSED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

type Tab = 'profile' | 'campaigns' | 'contents';

export function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editMode, setEditMode] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileForm, setProfileForm] = useState({
    businessName: '',
    cpfCnpj: '',
    segment: '',
    mainContact: '',
    mainEmail: '',
    mainPhone: '',
    address: '',
    plan: 'START' as 'START' | 'MASTER' | 'PREMIUM' | 'CUSTOM',
    customPlanDescription: '',
    monthlyValue: '',
    contractMonths: '',
    dueDate: '',
    goals: '',
    website: '',
  });

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
      return response.data.find((c: any) => c.id === clientId);
    },
    enabled: !!clientId,
  });

  // Populate form when client loads
  useEffect(() => {
    if (client?.clients) {
      const p = client.clients;
      setProfileForm({
        businessName: p.businessName ?? '',
        cpfCnpj: p.cpfCnpj ?? '',
        segment: p.segment ?? '',
        mainContact: p.mainContact ?? '',
        mainEmail: p.mainEmail ?? '',
        mainPhone: p.mainPhone ?? '',
        address: p.address ?? '',
        plan: p.plan ?? 'START',
        customPlanDescription: p.customPlanDescription ?? '',
        monthlyValue: p.monthlyValue ? String(p.monthlyValue) : '',
        contractMonths: p.contractMonths ? String(p.contractMonths) : '',
        dueDate: p.dueDate ? new Date(p.dueDate).toISOString().split('T')[0] : '',
        goals: p.goals ?? '',
        website: p.website ?? '',
      });
    }
  }, [client]);

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
      return { items: response.data.items?.filter((m: any) => m.tenantId === clientId) || [] };
    },
    enabled: !!clientId && activeTab === 'contents',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileForm) => {
      const payload: any = { ...data };
      if (!payload.monthlyValue) delete payload.monthlyValue;
      if (!payload.contractMonths) delete payload.contractMonths;
      if (!payload.dueDate) delete payload.dueDate;
      const response = await api.patch(`/admin/clients/${clientId}/profile`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
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
      setCampaignForm({ name: '', objective: '', budgetStrategy: 'DAILY', dailyBudget: '', lifetimeBudget: '', startDate: '', endDate: '' });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/admin/media', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media', clientId] });
      setShowContentForm(false);
      setContentForm({ title: '', description: '', category: '', type: 'IMAGE', file: null });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm.file) return;
    const fd = new FormData();
    fd.append('file', contentForm.file);
    fd.append('title', contentForm.title);
    fd.append('tenantId', clientId!);
    if (contentForm.description) fd.append('description', contentForm.description);
    if (contentForm.category) fd.append('category', contentForm.category);
    fd.append('type', contentForm.type);
    uploadMutation.mutate(fd);
  };

  const inputClass = 'w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-outer-sans';
  const readonlyClass = 'w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg text-sm font-outer-sans';

  if (clientLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="card-gradient text-center py-12">
          <p className="text-gray-500 mb-4 font-outer-sans">Cliente não encontrado</p>
          <Link to="/admin/clients" className="btn btn-primary font-outer-sans">Voltar para Clientes</Link>
        </div>
      </div>
    );
  }

  const profile = client.clients;
  const allLogos: string[] = profile?.logoUrls?.length > 0 ? profile.logoUrls : profile?.logoUrl ? [profile.logoUrl] : [];

  return (
    <div className="px-4 py-6 sm:px-0 animate-fade-in">
      {/* Back */}
      <Link to="/admin/clients" className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-800 mb-5 text-sm font-semibold font-outer-sans transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para Clientes
      </Link>

      {/* Header do cliente */}
      <div className="card-gradient mb-6">
        <div className="flex flex-wrap items-start gap-4">
          {/* Logos */}
          {allLogos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {allLogos.map((url, i) => (
                <img key={i} src={url} alt={`Logo ${i + 1}`} className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-md" />
              ))}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent font-outer-sans">
                {profile?.businessName || client.name}
              </h1>
              {profile?.clientStatus && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border font-outer-sans ${STATUS_COLORS[profile.clientStatus]}`}>
                  {STATUS_LABELS[profile.clientStatus]}
                </span>
              )}
              {profile?.plan && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-outer-sans ${
                  profile.plan === 'PREMIUM' ? 'bg-yellow-100 text-yellow-800' :
                  profile.plan === 'MASTER' ? 'bg-blue-100 text-blue-800' :
                  profile.plan === 'CUSTOM' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {PLAN_LABELS[profile.plan]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-outer-sans">
              {profile?.mainContact && <span>👤 {profile.mainContact}</span>}
              {profile?.mainEmail && <span>✉️ {profile.mainEmail}</span>}
              {profile?.mainPhone && <span>📱 {profile.mainPhone}</span>}
              {profile?.monthlyValue && (
                <span className="text-purple-700 font-semibold">
                  💰 R$ {Number(profile.monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {profile.contractMonths ? `/mês · ${profile.contractMonths} meses` : '/mês'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1">
          {([
            { id: 'profile', label: 'Dados do Cliente', icon: '👤' },
            { id: 'campaigns', label: 'Campanhas', icon: '📣' },
            { id: 'contents', label: 'Conteúdos', icon: '📁' },
          ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all font-outer-sans flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ===== ABA: DADOS DO CLIENTE ===== */}
      {activeTab === 'profile' && (
        <div className="card-gradient animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 font-outer-sans">Informações do Cliente</h2>
            <div className="flex gap-2">
              {saveSuccess && (
                <span className="text-green-600 text-sm font-semibold font-outer-sans flex items-center gap-1">
                  ✓ Salvo com sucesso
                </span>
              )}
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="btn btn-primary text-sm font-outer-sans flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              ) : (
                <button onClick={() => { setEditMode(false); }} className="btn btn-secondary text-sm font-outer-sans">
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Nome / Razão social */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Nome completo / Razão social</label>
                {editMode
                  ? <input type="text" value={profileForm.businessName} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} className={inputClass} />
                  : <p className={readonlyClass}>{profile?.businessName || '—'}</p>}
              </div>

              {/* CPF / CNPJ */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">CPF / CNPJ</label>
                {editMode
                  ? <input type="text" value={profileForm.cpfCnpj} onChange={(e) => setProfileForm({ ...profileForm, cpfCnpj: e.target.value })} className={inputClass} placeholder="000.000.000-00" />
                  : <p className={readonlyClass}>{profile?.cpfCnpj || '—'}</p>}
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Responsável pelo contato</label>
                {editMode
                  ? <input type="text" value={profileForm.mainContact} onChange={(e) => setProfileForm({ ...profileForm, mainContact: e.target.value })} className={inputClass} />
                  : <p className={readonlyClass}>{profile?.mainContact || '—'}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">E-mail</label>
                {editMode
                  ? <input type="email" value={profileForm.mainEmail} onChange={(e) => setProfileForm({ ...profileForm, mainEmail: e.target.value })} className={inputClass} />
                  : <p className={readonlyClass}>{profile?.mainEmail || '—'}</p>}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Telefone</label>
                {editMode
                  ? <input type="tel" value={profileForm.mainPhone} onChange={(e) => setProfileForm({ ...profileForm, mainPhone: e.target.value })} className={inputClass} placeholder="(00) 00000-0000" />
                  : <p className={readonlyClass}>{profile?.mainPhone || '—'}</p>}
              </div>

              {/* Segmento */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Segmento</label>
                {editMode
                  ? <input type="text" value={profileForm.segment} onChange={(e) => setProfileForm({ ...profileForm, segment: e.target.value })} className={inputClass} />
                  : <p className={readonlyClass}>{profile?.segment || '—'}</p>}
              </div>

              {/* Endereço */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Endereço completo</label>
                {editMode
                  ? <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className={inputClass} placeholder="Rua, número, bairro, cidade, estado, CEP" />
                  : <p className={readonlyClass}>{profile?.address || '—'}</p>}
              </div>

              {/* Site */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Website</label>
                {editMode
                  ? <input type="text" value={profileForm.website} onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })} className={inputClass} placeholder="https://..." />
                  : <p className={readonlyClass}>{profile?.website || '—'}</p>}
              </div>

              {/* Plano */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Plano adquirido</label>
                {editMode ? (
                  <select value={profileForm.plan} onChange={(e) => setProfileForm({ ...profileForm, plan: e.target.value as any })} className={inputClass}>
                    <option value="START">Start</option>
                    <option value="MASTER">Master</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="CUSTOM">Personalizado</option>
                  </select>
                ) : (
                  <p className={readonlyClass}>{PLAN_LABELS[profile?.plan] || '—'}</p>
                )}
              </div>

              {/* Descrição plano personalizado */}
              {(editMode ? profileForm.plan === 'CUSTOM' : profile?.plan === 'CUSTOM') && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Descrição do plano personalizado</label>
                  {editMode
                    ? <textarea value={profileForm.customPlanDescription} onChange={(e) => setProfileForm({ ...profileForm, customPlanDescription: e.target.value })} className={inputClass} rows={3} />
                    : <p className={readonlyClass}>{profile?.customPlanDescription || '—'}</p>}
                </div>
              )}

              {/* Valor mensal */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Valor mensal (R$)</label>
                {editMode
                  ? <input type="number" min="0" step="0.01" value={profileForm.monthlyValue} onChange={(e) => setProfileForm({ ...profileForm, monthlyValue: e.target.value })} className={inputClass} placeholder="0,00" />
                  : <p className={readonlyClass}>{profile?.monthlyValue ? `R$ ${Number(profile.monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}</p>}
              </div>

              {/* Meses de contrato */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Meses de contrato</label>
                {editMode
                  ? <input type="number" min="1" step="1" value={profileForm.contractMonths} onChange={(e) => setProfileForm({ ...profileForm, contractMonths: e.target.value })} className={inputClass} placeholder="Ex: 12" />
                  : <p className={readonlyClass}>{profile?.contractMonths ? `${profile.contractMonths} meses` : '—'}</p>}
              </div>

              {/* Data de vencimento */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Data de vencimento</label>
                {editMode
                  ? <input type="date" value={profileForm.dueDate} onChange={(e) => setProfileForm({ ...profileForm, dueDate: e.target.value })} className={inputClass} />
                  : <p className={readonlyClass}>{profile?.dueDate ? new Date(profile.dueDate).toLocaleDateString('pt-BR') : '—'}</p>}
              </div>

              {/* Status do contrato (readonly) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Status</label>
                <p className={readonlyClass}>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[profile?.clientStatus ?? 'ACTIVE']}`}>
                    {STATUS_LABELS[profile?.clientStatus ?? 'ACTIVE']}
                  </span>
                  {profile?.statusReason && <span className="ml-2 text-gray-500 text-xs">({profile.statusReason})</span>}
                </p>
              </div>

              {/* Objetivos */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide font-outer-sans">Objetivos / Observações</label>
                {editMode
                  ? <textarea value={profileForm.goals} onChange={(e) => setProfileForm({ ...profileForm, goals: e.target.value })} className={inputClass} rows={3} placeholder="Objetivos de marketing, metas, observações..." />
                  : <p className={`${readonlyClass} min-h-[60px]`}>{profile?.goals || '—'}</p>}
              </div>

            </div>

            {/* Logos exibidas */}
            {allLogos.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide font-outer-sans">Logos cadastradas</label>
                <div className="flex flex-wrap gap-3">
                  {allLogos.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Logo ${i + 1}`} className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm" />
                      {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-purple-600 text-white px-1 rounded font-outer-sans">Principal</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editMode && (
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary font-outer-sans">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="btn btn-primary font-outer-sans flex items-center gap-2"
                >
                  {updateProfileMutation.isPending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Salvando...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Salvar alterações</>
                  )}
                </button>
              </div>
            )}
            {updateProfileMutation.isError && (
              <p className="mt-3 text-red-600 text-sm font-outer-sans">Erro ao salvar. Tente novamente.</p>
            )}
          </form>
        </div>
      )}

      {/* ===== ABA: CAMPANHAS ===== */}
      {activeTab === 'campaigns' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-outer-sans">Campanhas</h2>
            <button onClick={() => setShowCampaignForm(!showCampaignForm)} className="btn btn-primary font-outer-sans">
              {showCampaignForm ? 'Cancelar' : '+ Criar Campanha'}
            </button>
          </div>

          {showCampaignForm && (
            <div className="card-gradient mb-6">
              <h3 className="text-lg font-bold mb-4 font-outer-sans">Nova Campanha</h3>
              <form onSubmit={(e) => { e.preventDefault(); createCampaignMutation.mutate(campaignForm); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-outer-sans">Nome da Campanha *</label>
                  <input type="text" required value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-outer-sans">Objetivo</label>
                  <textarea value={campaignForm.objective} onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })} className={inputClass} rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 font-outer-sans">Estratégia de Orçamento</label>
                    <select value={campaignForm.budgetStrategy} onChange={(e) => setCampaignForm({ ...campaignForm, budgetStrategy: e.target.value as 'DAILY' | 'LIFETIME' })} className={inputClass}>
                      <option value="DAILY">Diário</option>
                      <option value="LIFETIME">Total</option>
                    </select>
                  </div>
                  {campaignForm.budgetStrategy === 'DAILY' ? (
                    <div>
                      <label className="block text-sm font-medium mb-1 font-outer-sans">Orçamento Diário (R$)</label>
                      <input type="number" step="0.01" value={campaignForm.dailyBudget} onChange={(e) => setCampaignForm({ ...campaignForm, dailyBudget: e.target.value })} className={inputClass} />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-1 font-outer-sans">Orçamento Total (R$)</label>
                      <input type="number" step="0.01" value={campaignForm.lifetimeBudget} onChange={(e) => setCampaignForm({ ...campaignForm, lifetimeBudget: e.target.value })} className={inputClass} />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={createCampaignMutation.isPending} className="btn btn-primary font-outer-sans">
                    {createCampaignMutation.isPending ? 'Criando...' : 'Criar Campanha'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {campaignsLoading ? (
            <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {campaigns?.map((campaign: any) => (
                <div key={campaign.id} className="card-interactive">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-800 mb-1 font-outer-sans">{campaign.name}</h3>
                      {campaign.objective && <p className="text-sm text-gray-600 mb-2 font-outer-sans">{campaign.objective}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-outer-sans ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 font-outer-sans mt-2">
                    {campaign.dailyBudget && <span>Orç. Diário: <strong>R$ {Number(campaign.dailyBudget).toFixed(2)}</strong></span>}
                    {campaign.lifetimeBudget && <span>Orç. Total: <strong>R$ {Number(campaign.lifetimeBudget).toFixed(2)}</strong></span>}
                  </div>
                </div>
              ))}
              {(!campaigns || campaigns.length === 0) && (
                <div className="card-gradient text-center py-12">
                  <p className="text-gray-500 font-outer-sans">Nenhuma campanha criada ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== ABA: CONTEÚDOS ===== */}
      {activeTab === 'contents' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-outer-sans">Conteúdos</h2>
            <button onClick={() => setShowContentForm(!showContentForm)} className="btn btn-primary font-outer-sans">
              {showContentForm ? 'Cancelar' : '+ Upload de Conteúdo'}
            </button>
          </div>

          {showContentForm && (
            <div className="card-gradient mb-6">
              <h3 className="text-lg font-bold mb-4 font-outer-sans">Upload de Conteúdo</h3>
              <form onSubmit={handleContentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-outer-sans">Título *</label>
                  <input type="text" required value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-outer-sans">Descrição</label>
                  <textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} className={inputClass} rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 font-outer-sans">Categoria</label>
                    <input type="text" value={contentForm.category} onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 font-outer-sans">Tipo</label>
                    <select value={contentForm.type} onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })} className={inputClass}>
                      <option value="IMAGE">Imagem</option>
                      <option value="VIDEO">Vídeo</option>
                      <option value="DOCUMENT">Documento</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-outer-sans">Arquivo *</label>
                  <input type="file" required onChange={(e) => { const f = e.target.files?.[0]; if (f) setContentForm({ ...contentForm, file: f }); }} className={inputClass} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={uploadMutation.isPending} className="btn btn-primary font-outer-sans">
                    {uploadMutation.isPending ? 'Enviando...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {mediaLoading ? (
            <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {media?.items?.map((item: any) => (
                <div key={item.id} className="card-interactive">
                  <h3 className="font-bold mb-2 font-outer-sans">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-500 mb-2 font-outer-sans">{item.description}</p>}
                  <div className="flex items-center gap-2 mb-4">
                    {item.category && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-outer-sans">{item.category}</span>}
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-outer-sans">{item.type}</span>
                  </div>
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm font-outer-sans">
                    Ver Arquivo
                  </a>
                </div>
              ))}
              {(!media?.items || media.items.length === 0) && (
                <div className="card-gradient text-center py-12 col-span-3">
                  <p className="text-gray-500 font-outer-sans">Nenhum conteúdo enviado ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
