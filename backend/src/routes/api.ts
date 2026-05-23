import { Router } from "express";
import * as customers from '../controllers/customers.controller';
// data.service no longer used at top-level routes; domain services used instead
import { customerService } from '../services/customer.service';
import { invoiceService } from '../services/invoice.service';
import { planService } from '../services/plan.service';
import { staffService } from '../services/staff.service';
import { paymentService } from '../services/payment.service';
import { ticketService } from '../services/ticket.service';
import { notificationTemplateService } from '../services/notificationTemplate.service';
import { exportJobService } from '../services/exportJob.service';
import { creditNoteService } from '../services/creditNote.service';
import * as auth from '../controllers/auth.controller';
import * as rolesCtrl from '../controllers/roles.controller';
import * as invoicesCtrl from '../controllers/invoices.controller';
import * as paymentsCtrl from '../controllers/payments.controller';
import * as ticketsCtrl from '../controllers/tickets.controller';
import * as staffCtrl from '../controllers/staff.controller';
import * as notificationsCtrl from '../controllers/notification-templates.controller';
import * as exportJobsCtrl from '../controllers/export-jobs.controller';
import * as creditNotesCtrl from '../controllers/credit-notes.controller';
import { authenticate, requireRole } from "../middleware/auth.middleware";
import { requirePermission } from '../middleware/requirePermissions.middleware';
import { UserModel } from '../models/user.model';
import { sendSuccess, sendError } from '../utils';

const router = Router();

// Auth
router.post('/auth/login', auth.login);
router.post('/auth/refresh', auth.refresh);

// Customers
router.get("/customers", async (req, res) => {
  const data = await customerService.list();
  return sendSuccess(res, data);
});
router.get("/customers/:id", async (req, res) => {
  const c = await customerService.get(req.params.id);
  if (!c) return sendError(res, 'Customer not found', undefined, 404);
  return sendSuccess(res, c);
});

// Customer write endpoints (protected)
router.post('/customers', authenticate, requireRole(['Super Admin']), customers.create);
router.put('/customers/:id', authenticate, requireRole(['Super Admin']), customers.update);
router.delete('/customers/:id', authenticate, requireRole(['Super Admin']), customers.remove);

// Invoices
router.get("/invoices", async (req, res) => sendSuccess(res, await invoiceService.list()));
router.get("/invoices/:id", async (req, res) => {
  const i = await invoiceService.get(req.params.id);
  if (!i) return sendError(res, 'Invoice not found', undefined, 404);
  return sendSuccess(res, i);
});

// Plans
router.get("/plans", async (req, res) => sendSuccess(res, await planService.list()));

// Invoice write endpoints
router.post('/invoices', authenticate, requireRole(['Super Admin']), invoicesCtrl.create);
router.put('/invoices/:id', authenticate, requireRole(['Super Admin']), invoicesCtrl.update);
router.delete('/invoices/:id', authenticate, requireRole(['Super Admin']), invoicesCtrl.remove);

// Staff
router.get("/staff", async (req, res) => sendSuccess(res, await staffService.list()));
// Staff write endpoints
router.post('/staff', authenticate, requireRole(['Super Admin']), staffCtrl.create);
router.put('/staff/:id', authenticate, requireRole(['Super Admin']), staffCtrl.update);
router.delete('/staff/:id', authenticate, requireRole(['Super Admin']), staffCtrl.remove);

// Roles / permissions
router.get('/roles', authenticate, requireRole(['Super Admin']), rolesCtrl.listRoles);
router.post('/roles', authenticate, requireRole(['Super Admin']), rolesCtrl.createRole);
router.get('/roles/:name/permissions', authenticate, requireRole(['Super Admin']), rolesCtrl.getPermissions);
router.put('/roles/:name/permissions', authenticate, requireRole(['Super Admin']), rolesCtrl.setPermissions);

// Payments
router.get("/payments", async (req, res) => sendSuccess(res, await paymentService.list()));
// Payments write endpoints
router.post('/payments', authenticate, requireRole(['Super Admin']), paymentsCtrl.create);
router.put('/payments/:id', authenticate, requireRole(['Super Admin']), paymentsCtrl.update);
router.delete('/payments/:id', authenticate, requireRole(['Super Admin']), paymentsCtrl.remove);

// Tickets
router.get("/tickets", async (req, res) => sendSuccess(res, await ticketService.list()));
// Tickets write endpoints
router.post('/tickets', authenticate, requireRole(['Super Admin']), ticketsCtrl.create);
router.put('/tickets/:id', authenticate, requireRole(['Super Admin']), ticketsCtrl.update);
router.delete('/tickets/:id', authenticate, requireRole(['Super Admin']), ticketsCtrl.remove);

// Notification templates
router.get('/notification-templates', async (req, res) => sendSuccess(res, await notificationTemplateService.list()));
router.post('/notification-templates', authenticate, requireRole(['Super Admin']), notificationsCtrl.create);
router.put('/notification-templates/:id', authenticate, requireRole(['Super Admin']), notificationsCtrl.update);
router.delete('/notification-templates/:id', authenticate, requireRole(['Super Admin']), notificationsCtrl.remove);

// Export jobs
router.get('/export-jobs', async (req, res) => sendSuccess(res, await exportJobService.list()));
router.post('/export-jobs', authenticate, requireRole(['Super Admin']), exportJobsCtrl.create);
router.get('/export-jobs/:id/download', authenticate, exportJobsCtrl.download);
router.put('/export-jobs/:id', authenticate, requireRole(['Super Admin']), exportJobsCtrl.update);
router.delete('/export-jobs/:id', authenticate, requireRole(['Super Admin']), exportJobsCtrl.remove);

// Credit notes
router.get('/credit-notes', async (req, res) => sendSuccess(res, await creditNoteService.list()));
router.post('/credit-notes', authenticate, requireRole(['Super Admin']), creditNotesCtrl.create);
router.put('/credit-notes/:id', authenticate, requireRole(['Super Admin']), creditNotesCtrl.update);
router.delete('/credit-notes/:id', authenticate, requireRole(['Super Admin']), creditNotesCtrl.remove);

// Setup helper - small endpoint used by frontend to check initial state
router.get('/setup', async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments({});
    return sendSuccess(res, { usersCount });
  } catch (err) {
    return sendError(res, 'Failed to read setup state', (err as Error).message, 500);
  }
});

export default router;
