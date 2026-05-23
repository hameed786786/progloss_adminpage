import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { emit } from '../integrations/socket';
import { exportJobService } from '../services/exportJob.service';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { sendSuccess, sendError } from '../utils';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure required fields exist. If the client doesn't provide an id/name, generate sensible defaults.
    const aReq = req as AuthRequest;
    const body: any = { ...(req.body || {}) };
    if (!body.id) body.id = `EXP-${Date.now()}`;
    if (!body.name) body.name = body.template || `Export ${new Date().toISOString()}`;
    if (!body.by) body.by = aReq.user?.sub || 'System';

    const created = await exportJobService.create(body as any);
    const list = await exportJobService.list();
    emit('exportJobs:update', list);
    return sendSuccess(res, created, undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await exportJobService.update(req.params.id, req.body as any);
    if (!updated) return sendError(res, 'Export job not found', undefined, 404);
    const list = await exportJobService.list();
    emit('exportJobs:update', list);
    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await exportJobService.remove(req.params.id);
    const list = await exportJobService.list();
    emit('exportJobs:update', list);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const download = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const job = await exportJobService.get(id);
    if (!job) return sendError(res, 'Export job not found', undefined, 404);
    if (!job.fileName) return sendError(res, 'No file available for this export', undefined, 404);

    // Exports are stored in a project-level `exports` directory by convention.
    const exportsDir = process.env.EXPORTS_DIR || path.join(process.cwd(), 'exports');
    const filePath = path.join(exportsDir, job.fileName as string);
    if (!fs.existsSync(filePath)) return sendError(res, 'File not found', undefined, 404);

    // Stream file with a safe filename
    return res.download(filePath, job.fileName as string);
  } catch (err) {
    next(err);
  }
};