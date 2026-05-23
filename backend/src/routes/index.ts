import { Router } from 'express';
import auth from './auth.route';
import customers from './customers.route';
import invoices from './invoices.route';
import plans from './plans.route';
import staff from './staff.route';
import payments from './payments.route';
import tickets from './tickets.route';
import roles from './roles.route';
import setup from './setup.route';
import notificationTemplates from './notification-templates.route';
import exportJobs from './export-jobs.route';
import creditNotes from './credit-notes.route';

const router = Router();

router.use(auth);
router.use('/customers', customers);
router.use('/invoices', invoices);
router.use('/plans', plans);
router.use('/staff', staff);
router.use('/setup', setup);
router.use('/payments', payments);
router.use('/tickets', tickets);
router.use('/roles', roles);
router.use('/notification-templates', notificationTemplates);
router.use('/export-jobs', exportJobs);
router.use('/credit-notes', creditNotes);

export default router;
