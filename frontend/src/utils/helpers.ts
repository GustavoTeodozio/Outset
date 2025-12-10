/**
 * Corrige URLs de imagens e mídias para usar a URL correta do backend
 */
export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Se já é uma URL absoluta (http/https), retorna como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Se começa com /, adiciona o backend URL
  if (url.startsWith('/')) {
    return `http://localhost:3333${url}`;
  }
  
  // Caso contrário, assume que é um arquivo no diretório de mídia
  return `http://localhost:3333/static/media/${url}`;
};

/**
 * Obtém a URL base do backend
 */
export const getBackendUrl = (): string => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333';
};

