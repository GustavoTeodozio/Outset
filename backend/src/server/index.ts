import env from '../config/env';
import logger from '../config/logger';
import app from './app';

const port = env.PORT;

// Tratamento de erros não capturados
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  // Não encerrar o processo, apenas logar
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection:', { reason: reason?.message || reason, promise });
  // Não encerrar o processo, apenas logar
});

const server = app.listen(port, () => {
  logger.info(`API ouvindo na porta ${port}`);
});

// Tratamento de erros do servidor
server.on('error', (error: Error) => {
  logger.error('Erro no servidor:', { error: error.message, stack: error.stack });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

