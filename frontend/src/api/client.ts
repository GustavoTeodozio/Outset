import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 (Não autorizado)
    if (error.response?.status === 401) {
      // Se não tentou refresh ainda, tenta fazer refresh do token
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post('/api/v1/auth/refresh', {
              refreshToken,
            });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Se o refresh falhar, limpa tokens e redireciona para login
          console.warn('Token inválido ou expirado. Redirecionando para login...');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Só redireciona se não estiver já na página de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // Se já tentou refresh e ainda deu 401, limpa tokens e redireciona
        console.warn('Token inválido após refresh. Limpando sessão...');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

