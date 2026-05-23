import { Router } from 'express';
import { planService } from '../services/plan.service';
import * as plansCtrl from '../controllers/plans.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils';

const router = Router();

router.get('/', async (req, res) => sendSuccess(res, await planService.list()));

router.post('/', authenticate, requireRole(['Super Admin']), plansCtrl.create);
router.put('/:id', authenticate, requireRole(['Super Admin']), plansCtrl.update);
router.delete('/:id', authenticate, requireRole(['Super Admin']), plansCtrl.remove);

export default router;