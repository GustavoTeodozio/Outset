import type { Request, Response } from 'express';
import { z } from 'zod';

import taskService from '../../../application/modules/tasks/task.service';
import AppError from '../../../shared/errors/AppError';
import prisma from '../../../config/prisma';

// Helper para buscar o tenant do admin
async function getAdminTenantId(): Promise<string> {
  // Primeiro tenta encontrar pelo nome "Sistema" (tenant padrão do admin)
  let adminTenant = await prisma.tenant.findFirst({
    where: {
      name: 'Sistema',
      clients: null,
    },
    select: { id: true },
  });

  // Se não encontrar, busca qualquer tenant sem ClientProfile
  if (!adminTenant) {
    adminTenant = await prisma.tenant.findFirst({
      where: {
        clients: null,
      },
      select: { id: true },
    });
  }

  if (!adminTenant) {
    // Última tentativa: buscar tenant que tenha usuário ADMIN e não tenha ClientProfile
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
      select: { tenantId: true },
    });

    if (adminUser?.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: adminUser.tenantId },
        include: { clients: true },
      });

      if (tenant && !tenant.clients) {
        return tenant.id;
      }
    }

    throw new AppError('Tenant do administrador não encontrado', 500);
  }

  return adminTenant.id;
}

const listSchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.string().optional(),
});

const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  assigneeName: z.string().optional(),
  campaignId: z.string().optional(),
  tenantId: z.string().optional(), // Para admins especificarem o tenant
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  scheduledAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
  tags: z.string().optional(),
  position: z.number().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  assigneeName: z.string().optional(),
  campaignId: z.string().optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  scheduledAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
  publishedAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
  tags: z.string().optional(),
  position: z.number().optional(),
});

const commentSchema = z.object({
  content: z.string().min(1),
});

const checklistSchema = z.object({
  title: z.string().min(1),
  position: z.number().optional(),
});

const updateChecklistSchema = z.object({
  title: z.string().min(1).optional(),
  isCompleted: z.boolean().optional(),
});

const attachmentSchema = z.object({
  mediaId: z.string().optional(),
  name: z.string().min(1),
  url: z.string().url(),
  type: z.string(),
  size: z.number().optional(),
});

const metricsSchema = z.object({
  budget: z.number().optional(),
  spent: z.number().optional(),
  impressions: z.number().optional(),
  clicks: z.number().optional(),
  cpm: z.number().optional(),
  cpc: z.number().optional(),
  ctr: z.number().optional(),
  conversions: z.number().optional(),
  conversionRate: z.number().optional(),
  leadGoal: z.number().optional(),
  salesGoal: z.number().optional(),
  leadsActual: z.number().optional(),
  salesActual: z.number().optional(),
  revenue: z.number().optional(),
  roas: z.number().optional(),
});

const updatePositionsSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    position: z.number(),
    status: z.string().optional(),
  })),
});

export const listTasks = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const filters = listSchema.parse(req.query);
  const result = await taskService.listTasks(tenantId, filters);

  return res.json(result);
};

export const getTask = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const tenantId = req.auth?.tenantId;

  const task = await taskService.getTask(taskId, tenantId);

  return res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
  let tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  
  // Para admin, pode especificar tenantId no body ou usar o tenant padrão do admin
  if (!tenantId && req.auth?.role === 'ADMIN') {
    tenantId = (req.body as any).tenantId;
    // Se não especificou no body, busca o tenant padrão do admin
    if (!tenantId) {
      tenantId = await getAdminTenantId();
    }
  } else if (!tenantId || !userId) {
    throw new AppError('Contexto incompleto', 400);
  }

  const body = createTaskSchema.parse(req.body);

  const task = await taskService.createTask({
    ...body,
    tenantId: tenantId!,
    createdById: userId,
  });

  return res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const tenantId = req.auth?.tenantId;
  const body = updateTaskSchema.parse(req.body);

  const task = await taskService.updateTask(taskId, body, tenantId);

  return res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const tenantId = req.auth?.tenantId;

  await taskService.deleteTask(taskId, tenantId);

  return res.json({ message: 'Tarefa excluída com sucesso' });
};

// Comments
export const addComment = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  if (!tenantId || !userId) throw new AppError('Autenticação necessária', 401);

  const { content } = commentSchema.parse(req.body);

  const comment = await taskService.addComment(taskId, userId, tenantId, content);

  return res.status(201).json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = z.object({ commentId: z.string().uuid() }).parse(req.params);
  const tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  if (!tenantId || !userId) throw new AppError('Autenticação necessária', 401);

  await taskService.deleteComment(commentId, userId, tenantId);

  return res.json({ message: 'Comentário excluído com sucesso' });
};

// Checklist
export const addChecklistItem = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const { title, position } = checklistSchema.parse(req.body);

  const item = await taskService.addChecklistItem(taskId, title, position);

  return res.status(201).json(item);
};

export const updateChecklistItem = async (req: Request, res: Response) => {
  const { itemId } = z.object({ itemId: z.string().uuid() }).parse(req.params);
  const data = updateChecklistSchema.parse(req.body);

  const item = await taskService.updateChecklistItem(itemId, data);

  return res.json(item);
};

export const deleteChecklistItem = async (req: Request, res: Response) => {
  const { itemId } = z.object({ itemId: z.string().uuid() }).parse(req.params);

  await taskService.deleteChecklistItem(itemId);

  return res.json({ message: 'Item excluído com sucesso' });
};

// Attachments
export const addAttachment = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const data = attachmentSchema.parse(req.body);

  const attachment = await taskService.addAttachment(taskId, data);

  return res.status(201).json(attachment);
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const { attachmentId } = z.object({ attachmentId: z.string().uuid() }).parse(req.params);

  await taskService.deleteAttachment(attachmentId);

  return res.json({ message: 'Anexo excluído com sucesso' });
};

// Metrics
export const updateMetrics = async (req: Request, res: Response) => {
  const { taskId } = z.object({ taskId: z.string().uuid() }).parse(req.params);
  const data = metricsSchema.parse(req.body);

  const metrics = await taskService.updateMetrics(taskId, data);

  return res.json(metrics);
};

// Drag and drop
export const updatePositions = async (req: Request, res: Response) => {
  const { updates } = updatePositionsSchema.parse(req.body);

  await taskService.updatePositions(updates);

  return res.json({ message: 'Posições atualizadas com sucesso' });
};

