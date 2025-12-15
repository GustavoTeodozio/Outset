import { Router } from 'express';

import { authorizeRoles, ensureAuthenticated } from '../middlewares/auth';
import upload from '../middlewares/upload';
import asyncHandler from '../middlewares/async-handler';
import { uploadMedia, listAllMedia, deleteMedia, listPendingApprovals, listApprovedMedia, listRejectedMedia } from '../controllers/media.controller';
import {
  createCampaign,
  decideApproval,
  listCampaigns,
  listAllCampaigns,
  requestApproval,
  updateCampaignStatus,
} from '../controllers/campaigns.controller';
import { createReport } from '../controllers/reports.controller';
import { listClients, updateClientStatus, updateClientApiKey, deleteClient } from '../controllers/clients.controller';
import { getAdminStats } from '../controllers/admin.controller';
import { listUsers, listAdmins, createAdmin } from '../controllers/users.controller';
import {
  listAllTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/admin-training.controller';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  addAttachment,
  deleteAttachment,
  updateMetrics,
  updatePositions,
} from '../controllers/task.controller';
import { syncCampaigns } from '../controllers/facebook-ads.controller';

const adminRoutes = Router();

adminRoutes.use(ensureAuthenticated, authorizeRoles('ADMIN'));

adminRoutes.get('/stats', asyncHandler(getAdminStats));
adminRoutes.get('/users', asyncHandler(listUsers));
adminRoutes.get('/admins', asyncHandler(listAdmins));
adminRoutes.post('/admins', asyncHandler(createAdmin));
adminRoutes.get('/clients', asyncHandler(listClients));
adminRoutes.patch('/clients/:clientId/status', asyncHandler(updateClientStatus));
adminRoutes.patch('/clients/:clientId/api-key', asyncHandler(updateClientApiKey));
adminRoutes.delete('/clients/:clientId', asyncHandler(deleteClient));
adminRoutes.get('/media', asyncHandler(listAllMedia));
adminRoutes.post('/media', upload.single('file'), asyncHandler(uploadMedia));
adminRoutes.delete('/media/:mediaId', asyncHandler(deleteMedia));
adminRoutes.get('/media/approvals/pending', asyncHandler(listPendingApprovals));
adminRoutes.get('/media/approvals/approved', asyncHandler(listApprovedMedia));
adminRoutes.get('/media/approvals/rejected', asyncHandler(listRejectedMedia));

adminRoutes.get('/campaigns', asyncHandler(listAllCampaigns));
adminRoutes.post('/campaigns', asyncHandler(createCampaign));
adminRoutes.patch('/campaigns/:campaignId/status', asyncHandler(updateCampaignStatus));
adminRoutes.post('/campaigns/:campaignId/approval', asyncHandler(requestApproval));
adminRoutes.post('/approvals/:approvalId/decision', asyncHandler(decideApproval));

adminRoutes.post('/reports', asyncHandler(createReport));

// Training routes
adminRoutes.get('/training/tracks', asyncHandler(listAllTracks));
adminRoutes.post('/training/tracks', upload.single('cover'), asyncHandler(createTrack));
adminRoutes.patch('/training/tracks/:trackId', upload.single('cover'), asyncHandler(updateTrack));
adminRoutes.delete('/training/tracks/:trackId', asyncHandler(deleteTrack));
adminRoutes.post('/training/modules', asyncHandler(createModule));
adminRoutes.patch('/training/modules/:moduleId', asyncHandler(updateModule));
adminRoutes.delete('/training/modules/:moduleId', asyncHandler(deleteModule));
adminRoutes.post('/training/lessons', upload.single('thumbnail'), asyncHandler(createLesson));
adminRoutes.patch('/training/lessons/:lessonId', upload.single('thumbnail'), asyncHandler(updateLesson));
adminRoutes.delete('/training/lessons/:lessonId', asyncHandler(deleteLesson));

// Task/Kanban routes
adminRoutes.get('/tasks', asyncHandler(listTasks));
adminRoutes.get('/tasks/:taskId', asyncHandler(getTask));
adminRoutes.post('/tasks', asyncHandler(createTask));
adminRoutes.patch('/tasks/:taskId', asyncHandler(updateTask));
adminRoutes.delete('/tasks/:taskId', asyncHandler(deleteTask));
adminRoutes.post('/tasks/:taskId/comments', asyncHandler(addComment));
adminRoutes.delete('/tasks/comments/:commentId', asyncHandler(deleteComment));
adminRoutes.post('/tasks/:taskId/checklist', asyncHandler(addChecklistItem));
adminRoutes.patch('/tasks/checklist/:itemId', asyncHandler(updateChecklistItem));
adminRoutes.delete('/tasks/checklist/:itemId', asyncHandler(deleteChecklistItem));
adminRoutes.post('/tasks/:taskId/attachments', asyncHandler(addAttachment));
adminRoutes.delete('/tasks/attachments/:attachmentId', asyncHandler(deleteAttachment));
adminRoutes.patch('/tasks/:taskId/metrics', asyncHandler(updateMetrics));
adminRoutes.post('/tasks/positions', asyncHandler(updatePositions));

// Facebook Ads integration (admin pode sincronizar para qualquer cliente)
adminRoutes.post('/facebook/sync/:clientId', asyncHandler(syncCampaigns));

export default adminRoutes;

