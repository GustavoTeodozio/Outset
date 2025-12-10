import { PrismaClient } from '@prisma/client';

import logger from './logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma: usar sintaxe simples
const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Conectar ao banco
prisma
  .$connect()
  .then(() => {
    logger.info('Prisma conectado');
  })
  .catch((error) => {
    logger.error('Erro ao conectar prisma', { error: error.message, stack: error.stack });
    // Não encerrar o processo, apenas logar
  });

// Tratamento de erros do Prisma
prisma.$on('error' as never, (e: { message: string }) => {
  logger.error('Erro do Prisma:', { error: e.message });
});

export default prisma;

