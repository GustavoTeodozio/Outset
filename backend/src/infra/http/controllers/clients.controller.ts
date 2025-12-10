import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';

export const listClients = async (req: Request, res: Response) => {
  try {
    // Buscar todos os tenants e filtrar apenas os que têm ClientProfile
    // (exclui o tenant do admin que não tem ClientProfile)
    const allTenants = await prisma.tenant.findMany({
      include: {
        clients: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filtrar apenas tenants que têm ClientProfile (clientes reais)
    const clients = allTenants.filter((tenant) => tenant.clients !== null);

    return res.json(clients);
  } catch (error: any) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({
      message: 'Erro ao buscar clientes',
      error: error.message,
    });
  }
};

export const updateClientStatus = async (req: Request, res: Response) => {
  try {
    const params = z.object({ clientId: z.string().uuid() }).parse(req.params);
    const body = z.object({ isActive: z.boolean() }).parse(req.body);

    const client = await prisma.tenant.update({
      where: { id: params.clientId },
      data: { isActive: body.isActive },
      include: {
        clients: true,
      },
    });

    return res.json(client);
  } catch (error: any) {
    console.error('Erro ao atualizar status do cliente:', error);
    throw new AppError('Erro ao atualizar status do cliente', 500);
  }
};

export const updateClientApiKey = async (req: Request, res: Response) => {
  try {
    const params = z.object({ clientId: z.string().uuid() }).parse(req.params);
    const body = z.object({ metaApiKey: z.string().optional() }).parse(req.body);

    // Verificar se o tenant existe e tem ClientProfile
    const tenant = await prisma.tenant.findUnique({
      where: { id: params.clientId },
      include: { clients: true },
    });

    if (!tenant || !tenant.clients) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Atualizar a API key no ClientProfile
    const updatedClient = await prisma.clientProfile.update({
      where: { tenantId: params.clientId },
      data: { metaApiKey: body.metaApiKey || null },
      include: { tenant: true },
    });

    return res.json(updatedClient);
  } catch (error: any) {
    console.error('Erro ao atualizar API key do cliente:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erro ao atualizar API key do cliente', 500);
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const params = z.object({ clientId: z.string().uuid() }).parse(req.params);

    // Verificar se o tenant existe e tem ClientProfile (é um cliente real)
    const tenant = await prisma.tenant.findUnique({
      where: { id: params.clientId },
      include: {
        clients: true,
      },
    });

    if (!tenant) {
      throw new AppError('Cliente não encontrado', 404);
    }

    if (!tenant.clients) {
      throw new AppError('Não é possível excluir este tenant', 400);
    }

    // Deletar em cascata todos os dados relacionados
    await prisma.$transaction(async (tx) => {
      // Deletar em ordem para respeitar as constraints
      
      // 1. Deletar lessonProgress primeiro (tem relação com tenant)
      await tx.lessonProgress.deleteMany({ where: { tenantId: params.clientId } });
      
      // 2. Deletar logs e tokens
      await tx.mediaDownloadLog.deleteMany({ where: { tenantId: params.clientId } });
      await tx.downloadToken.deleteMany({ where: { tenantId: params.clientId } });
      
      // 3. Deletar outros dados relacionados ao tenant
      await tx.auditLog.deleteMany({ where: { tenantId: params.clientId } });
      await tx.integrationAsset.deleteMany({ where: { tenantId: params.clientId } });
      await tx.notification.deleteMany({ where: { tenantId: params.clientId } });
      await tx.report.deleteMany({ where: { tenantId: params.clientId } });
      await tx.manualResult.deleteMany({ where: { tenantId: params.clientId } });
      await tx.lead.deleteMany({ where: { tenantId: params.clientId } });
      await tx.campaignApproval.deleteMany({ where: { tenantId: params.clientId } });
      await tx.campaign.deleteMany({ where: { tenantId: params.clientId } });
      await tx.mediaAsset.deleteMany({ where: { tenantId: params.clientId } });
      
      // 4. Deletar training tracks e seus módulos/lições
      const tracks = await tx.trainingTrack.findMany({ where: { tenantId: params.clientId } });
      for (const track of tracks) {
        const modules = await tx.trainingModule.findMany({ where: { trackId: track.id } });
        for (const module of modules) {
          // Buscar todas as lições do módulo
          const lessons = await tx.lesson.findMany({ where: { moduleId: module.id } });
          const lessonIds = lessons.map((l) => l.id);
          
          // Deletar lessonProgress das lições primeiro
          if (lessonIds.length > 0) {
            await tx.lessonProgress.deleteMany({ where: { lessonId: { in: lessonIds } } });
          }
          
          // Depois deletar as lições
          await tx.lesson.deleteMany({ where: { moduleId: module.id } });
        }
        await tx.trainingModule.deleteMany({ where: { trackId: track.id } });
      }
      await tx.trainingTrack.deleteMany({ where: { tenantId: params.clientId } });

      // 5. Deletar sessões
      await tx.session.deleteMany({ where: { tenantId: params.clientId } });

      // 6. Deletar usuários (que não são admin)
      await tx.user.deleteMany({
        where: {
          tenantId: params.clientId,
          role: 'CLIENT',
        },
      });

      // 7. Deletar ClientProfile
      await tx.clientProfile.delete({ where: { tenantId: params.clientId } });

      // 8. Por último, deletar o Tenant
      await tx.tenant.delete({ where: { id: params.clientId } });
    });

    return res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir cliente:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erro ao excluir cliente', 500);
  }
};

