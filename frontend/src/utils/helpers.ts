/**
 * Corrige URLs de imagens e mídias para usar a URL correta do backend
 */
export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Se já é uma URL absoluta (http/https), retorna como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Em produção, usar URL relativa (o Nginx faz proxy)
  // Em desenvolvimento, usar localhost
  const backendUrl = getBackendUrl();
  const isDevelopment = import.meta.env.DEV;
  
  // Se começa com /, adiciona o backend URL (apenas em desenvolvimento)
  if (url.startsWith('/')) {
    return isDevelopment ? `${backendUrl}${url}` : url;
  }
  
  // Caso contrário, assume que é um arquivo no diretório de mídia
  return isDevelopment 
    ? `${backendUrl}/static/media/${url}` 
    : `/static/media/${url}`;
};

/**
 * Obtém a URL base do backend
 */
export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';
};

