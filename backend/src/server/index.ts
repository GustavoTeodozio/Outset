import env from '../config/env';
import logger from '../config/logger';
import setupService from '../application/modules/auth/setup.service';
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

const server = app.listen(port, async () => {
  logger.info(`API ouvindo na porta ${port}`);
  
  // Inicialização automática: criar admin se não existir e variáveis estiverem configuradas
  try {
    const setupResult = await setupService.autoSetupAdmin();
    if (setupResult.created) {
      logger.info(`✅ ${setupResult.message}`);
      logger.info(`   Admin criado: ${setupResult.admin?.email}`);
    } else {
      logger.info(`ℹ️  ${setupResult.message}`);
    }
  } catch (error: any) {
    logger.error('Erro na inicialização automática:', error.message);
  }
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

