import { Request, Response, NextFunction } from 'express';
import { roleService } from '../services/role.service';
import { sendError } from '../utils';

export interface AuthRequest extends Request {
  user?: { sub: string; role: string };
}

export const requirePermission = (moduleName: string, actionName: string) => async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return sendError(res, 'Unauthenticated', undefined, 401);
  const roleName = req.user.role || 'User';
  const role = (await roleService.findByName(roleName)) as any;
  const matrix = role?.matrix || {};
  const actions = matrix[moduleName] as number[] | undefined;
  if (!actions) return sendError(res, 'Forbidden', undefined, 403);
  const idxMap = { View: 0, Create: 1, Edit: 2, Delete: 3, Approve: 4, Export: 5, Admin: 6 } as Record<string, number>;
  const idx = idxMap[actionName] ?? 0;
  const val = actions[idx] ?? 0;
  if (val <= 0) return sendError(res, 'Forbidden', undefined, 403);
  return next();
};