import type { Request, Response } from 'express';
import { z } from 'zod';

import setupService from '../../../application/modules/auth/setup.service';
import AppError from '../../../shared/errors/AppError';

const setupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const setupAdmin = async (req: Request, res: Response) => {
  try {
    const body = setupSchema.parse(req.body);
    
    const admin = await setupService.setupFirstAdmin(body);
    
    return res.status(201).json({
      message: 'Administrador criado com sucesso!',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: error.issues 
      });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Erro no setup:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const checkSetupStatus = async (_req: Request, res: Response) => {
  try {
    const hasAdmin = await setupService.hasAdmin();
    
    return res.json({
      isSetup: hasAdmin,
      message: hasAdmin 
        ? 'Sistema já configurado' 
        : 'Sistema precisa ser configurado',
    });
  } catch (error: any) {
    console.error('Erro ao verificar status do setup:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

