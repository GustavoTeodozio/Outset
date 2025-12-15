import { useState, useEffect } from 'react';
import api from '../../api/client';
import { useToast } from '../../hooks/useToast';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string | null;
}

const UserPlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function AdminManagement() {
  const { showToast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/admins');
      setAdmins(response.data);
    } catch (error: any) {
      showToast('Erro ao carregar administradores', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/admin/admins', formData);
      showToast('Administrador criado com sucesso!', 'success');
      setAdmins([response.data, ...admins]);
      setShowForm(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar administrador';
      showToast(message, 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 font-outer-sans">Administradores do Sistema</h3>
          <p className="text-xs sm:text-sm text-gray-600 font-outer-sans mt-1">
            Gerencie os administradores com acesso ao painel
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center justify-center gap-2 font-outer-sans text-sm sm:text-base w-full sm:w-auto"
          >
            <UserPlusIcon />
            <span className="hidden sm:inline">Cadastrar Administrador</span>
            <span className="sm:hidden">Cadastrar</span>
          </button>
        )}
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <div className="card-gradient p-4 sm:p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-bold text-gray-800 font-outer-sans">Novo Administrador</h4>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <XIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-outer-sans">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input font-outer-sans"
                placeholder="Nome do administrador"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-outer-sans">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input font-outer-sans"
                placeholder="admin@exemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-outer-sans">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input font-outer-sans"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="btn btn-secondary font-outer-sans w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary font-outer-sans w-full sm:w-auto">
                Criar Administrador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Administradores */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600 font-outer-sans">Carregando...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="card-gradient p-8 text-center">
          <p className="text-gray-600 font-outer-sans">Nenhum administrador cadastrado</p>
        </div>
      ) : (
        <div className="card-gradient overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-outer-sans">
                    Nome
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-outer-sans hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-outer-sans hidden md:table-cell">
                    Criado em
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm font-outer-sans flex-shrink-0">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 sm:ml-4 min-w-0">
                          <div className="text-sm font-medium text-gray-900 font-outer-sans truncate">
                            {admin.name}
                          </div>
                          <div className="text-xs text-gray-500 font-outer-sans sm:hidden mt-1 truncate">
                            {admin.email}
                          </div>
                          <div className="text-xs text-gray-500 font-outer-sans md:hidden mt-1">
                            {formatDate(admin.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-gray-900 font-outer-sans truncate max-w-xs">
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 font-outer-sans">
                        {formatDate(admin.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

