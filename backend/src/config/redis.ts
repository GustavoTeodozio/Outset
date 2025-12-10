import Redis from 'ioredis';

import env from './env';
import logger from './logger';

// Redis opcional para desenvolvimento local
let redis: Redis | null = null;
let redisConnected = false;

// Em desenvolvimento, Redis é opcional
const isDevelopment = process.env.NODE_ENV === 'development';

if (env.REDIS_URL && env.REDIS_URL.trim() !== '') {
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableAutoPipelining: true,
      lazyConnect: true, // Não conecta automaticamente
      retryStrategy: (times) => {
        // Em desenvolvimento, não tenta reconectar infinitamente
        if (isDevelopment && times > 3) {
          return null; // Para de tentar
        }
        return Math.min(times * 50, 2000);
      },
    });

    redis.on('connect', () => {
      redisConnected = true;
      logger.info('Redis conectado');
    });

    let lastErrorLogged = 0;
    redis.on('error', (error) => {
      redisConnected = false;
      // Log apenas uma vez a cada 60 segundos para não poluir logs
      const now = Date.now();
      if (now - lastErrorLogged > 60000) {
        if (isDevelopment) {
          logger.warn('Redis não disponível - funcionando sem cache (opcional)');
        } else {
          logger.error('Erro no Redis', { error: error.message || error });
        }
        lastErrorLogged = now;
      }
    });

    redis.on('close', () => {
      redisConnected = false;
    });

    // Tentar conectar, mas não falhar se não conseguir
    redis.connect().catch(() => {
      if (isDevelopment) {
        // Log apenas uma vez no início
        logger.warn('Redis não disponível - funcionando sem cache (opcional em desenvolvimento)');
      }
    });
  } catch (error) {
    if (isDevelopment) {
      logger.warn('Redis não inicializado - funcionando sem cache');
    } else {
      logger.error('Erro ao inicializar Redis', { error });
    }
  }
}

// Wrapper que funciona sem Redis
const redisWrapper = {
  async get(key: string): Promise<string | null> {
    if (!redis || !redisConnected) return null;
    try {
      return await redis.get(key);
    } catch (error: any) {
      // Silenciosamente retorna null se Redis não estiver disponível
      return null;
    }
  },

  async set(key: string, value: string, mode?: string, ttl?: number): Promise<void> {
    if (!redis || !redisConnected) return;
    try {
      if (mode === 'EX' && ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      // Silenciosamente ignora erros em desenvolvimento
    }
  },

  async setex(key: string, seconds: number, value: string): Promise<void> {
    if (!redis || !redisConnected) return;
    try {
      await redis.setex(key, seconds, value);
    } catch (error) {
      // Silenciosamente ignora erros em desenvolvimento
    }
  },

  async del(key: string): Promise<void> {
    if (!redis || !redisConnected) return;
    try {
      await redis.del(key);
    } catch (error) {
      // Silenciosamente ignora erros em desenvolvimento
    }
  },
};

export default redisWrapper;
