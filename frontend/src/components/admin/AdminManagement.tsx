import { useState, useEffect } from 'react';
import api from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/auth.store';

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

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export function AdminManagement() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuthStore();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
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
      let message = 'Erro ao criar administrador';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          message = data.errors.map((err: any) => err.message || err).join(', ');
        } else if (data.message) {
          message = data.message;
        }
      }
      
      showToast(message, 'error');
      console.error('Erro ao criar admin:', error.response?.data || error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDeleteClick = (admin: Admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
    setConfirmationCode('');
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    if (confirmationCode !== '2112') {
      showToast('Código de confirmação inválido. Não foi possível excluir o administrador.', 'error');
      return;
    }

    try {
      await api.delete(`/admin/admins/${adminToDelete.id}`, {
        data: { confirmationCode: '2112' }
      });
      showToast('Administrador excluído com sucesso!', 'success');
      setAdmins(admins.filter(admin => admin.id !== adminToDelete.id));
      setShowDeleteModal(false);
      setAdminToDelete(null);
      setConfirmationCode('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir administrador';
      showToast(message, 'error');
    }
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
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-outer-sans">
                    Ações
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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {admin.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir administrador"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <AlertIcon />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 font-outer-sans mb-2">
                    Confirmar Exclusão de Administrador
                  </h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    Você está prestes a excluir o administrador <strong>{adminToDelete.name}</strong> ({adminToDelete.email}).
                  </p>
                </div>
              </div>

              {/* Aviso sobre consequências */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2 font-outer-sans">
                  ⚠️ Atenção: Consequências da Exclusão
                </h4>
                <ul className="text-xs text-yellow-700 space-y-1 font-outer-sans list-disc list-inside">
                  <li>O administrador perderá acesso imediato ao sistema</li>
                  <li>Não será possível reverter esta ação automaticamente</li>
                  <li>O administrador precisará ser recriado manualmente se necessário</li>
                  <li>Todas as sessões ativas serão encerradas</li>
                </ul>
              </div>

              {/* Campo de código de confirmação */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-outer-sans">
                  Código de Confirmação
                </label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="input font-outer-sans text-center text-lg tracking-widest"
                  placeholder="2112"
                  maxLength={4}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1 font-outer-sans">
                  Digite o código de confirmação para prosseguir
                </p>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAdminToDelete(null);
                    setConfirmationCode('');
                  }}
                  className="btn btn-secondary font-outer-sans"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={confirmationCode !== '2112'}
                  className="btn bg-red-600 hover:bg-red-700 text-white font-outer-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Excluir Administrador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

