/**
 * Converte URLs do YouTube/Vimeo para formato embed
 */
export const convertToEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  // YouTube - formato watch
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  }

  // YouTube - formato curto (youtu.be)
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  }

  // YouTube - formato embed (já está no formato correto)
  if (url.includes('youtube.com/embed/')) {
    return url.includes('?') ? url : `${url}?rel=0&modestbranding=1`;
  }

  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }

  // Vimeo - formato player (já está no formato correto)
  if (url.includes('player.vimeo.com/video/')) {
    return url;
  }

  return null;
};

/**
 * Verifica se a URL é do YouTube ou Vimeo
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
};

