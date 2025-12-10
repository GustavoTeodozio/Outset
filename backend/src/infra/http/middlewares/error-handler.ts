import type { NextFunction, Request, Response } from 'express';

import AppError from '../../../shared/errors/AppError';
import logger from '../../../config/logger';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  try {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
        details: error.details,
      });
    }

    // Log do erro completo para debug
    logger.error('Erro inesperado', { 
      error: error.message,
      stack: error.stack,
      name: error.name
    });

    // Não deixar o servidor parar - sempre retornar resposta
    if (!res.headersSent) {
      return res.status(500).json({ 
        message: 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { 
          error: error.message,
          stack: error.stack 
        })
      });
    }
  } catch (handlerError) {
    // Se até o handler de erro falhar, logar e não deixar o servidor parar
    console.error('Erro crítico no error handler:', handlerError);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

export default errorHandler;

