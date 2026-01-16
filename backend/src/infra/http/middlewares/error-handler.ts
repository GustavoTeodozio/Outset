import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import AppError from '../../../shared/errors/AppError';
import logger from '../../../config/logger';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  try {
    // Tratar erros de validação Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    if (error instanceof AppError) {
      logger.error('AppError capturado', {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        stack: error.stack,
      });
      return res.status(error.statusCode).json({
        message: error.message,
        details: error.details,
        // Sempre incluir código de erro se existir
        ...(error.details && typeof error.details === 'object' && 'code' in error.details ? { code: (error.details as any).code } : {}),
      });
    }

    // Log do erro completo para debug
    logger.error('Erro inesperado no error handler', { 
      error: error.message,
      stack: error.stack,
      name: error.name,
      // Incluir código de erro se for erro do Prisma
      ...(error && typeof error === 'object' && 'code' in error ? { prismaCode: (error as any).code, prismaMeta: (error as any).meta } : {}),
    });

    // Não deixar o servidor parar - sempre retornar resposta
    if (!res.headersSent) {
      // Sempre retornar mensagem de erro, mesmo em produção (sem stack trace completo por segurança)
      return res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: error.message || 'Erro desconhecido',
        // Incluir código de erro do Prisma se existir
        ...(error && typeof error === 'object' && 'code' in error ? { 
          code: (error as any).code,
          // Incluir meta apenas se não contiver informações sensíveis
          ...((error as any).meta && typeof (error as any).meta === 'object' ? { meta: (error as any).meta } : {})
        } : {}),
        ...(process.env.NODE_ENV === 'development' && { 
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

