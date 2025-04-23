const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated } = require('../middleware/auth');

// Todas as rotas de compromissos requerem autenticação
router.use(isAuthenticated);

// Dashboard e visualização de calendário
router.get('/dashboard', appointmentController.getDashboard);
router.get('/api/appointments', appointmentController.getAppointments);
router.get('/appointments/day/:date', appointmentController.getDayAppointments);

// Gerenciamento de compromissos
router.get('/appointments/add', appointmentController.getAddAppointmentPage);
router.post('/appointments/add', appointmentController.addAppointment);
router.get('/appointments/edit/:id', appointmentController.getEditAppointmentPage);
router.post('/appointments/edit/:id', appointmentController.updateAppointment);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

// Relatórios
router.get('/reports/day/:date', appointmentController.generateDayReport);

module.exports = router;
