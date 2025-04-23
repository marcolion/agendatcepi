const Appointment = require('../models/Appointment');
const { sendAppointmentNotification } = require('../config/email');
const moment = require('moment');

// Renderizar página do dashboard com calendário
exports.getDashboard = async (req, res) => {
  try {
    // Obter mês e ano atuais ou da query
    const month = req.query.month ? parseInt(req.query.month) : moment().month() + 1;
    const year = req.query.year ? parseInt(req.query.year) : moment().year();
    
    // Renderizar dashboard com dados do usuário
    res.render('dashboard', {
      user: {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole,
        username: req.session.username
      },
      month,
      year
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar dashboard' });
  }
};

// Obter compromissos para o calendário (formato JSON)
exports.getAppointments = async (req, res) => {
  try {
    // Obter mês e ano da query
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    
    // Calcular datas de início e fim do mês
    const startDate = moment({ year, month: month - 1, day: 1 }).startOf('day').toDate();
    const endDate = moment({ year, month: month - 1 }).endOf('month').endOf('day').toDate();
    
    // Buscar compromissos no período
    const appointments = await Appointment.find({
      dateTime: { $gte: startDate, $lte: endDate }
    }).populate('createdBy', 'name');
    
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar compromissos' });
  }
};

// Obter compromissos de um dia específico
exports.getDayAppointments = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Converter string de data para objeto Date
    const selectedDate = moment(date, 'YYYY-MM-DD');
    const startDate = selectedDate.startOf('day').toDate();
    const endDate = selectedDate.endOf('day').toDate();
    
    // Buscar compromissos do dia
    const appointments = await Appointment.find({
      dateTime: { $gte: startDate, $lte: endDate }
    }).populate('createdBy', 'name');
    
    res.render('day-appointments', {
      appointments,
      date: selectedDate.format('DD/MM/YYYY'),
      user: {
        id: req.session.userId,
        role: req.session.userRole
      }
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao buscar compromissos do dia' });
  }
};

// Renderizar página de adicionar compromisso
exports.getAddAppointmentPage = (req, res) => {
  res.render('add-appointment');
};

// Adicionar novo compromisso
exports.addAppointment = async (req, res) => {
  const { requesterName, subject, dateTime, position, email, organization } = req.body;
  
  try {
    // Criar novo compromisso
    const appointment = await Appointment.create({
      requesterName,
      subject,
      dateTime: new Date(dateTime),
      position,
      email,
      organization,
      createdBy: req.session.userId
    });
    
    // Enviar notificação por email
    const emailResult = await sendAppointmentNotification(
      email,
      `Confirmação de Compromisso: ${subject}`,
      appointment
    );
    
    // Atualizar status de notificação
    if (emailResult.success) {
      appointment.notificationSent = true;
      await appointment.save();
    }
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('add-appointment', {
      error: 'Erro ao cadastrar compromisso',
      appointment: { requesterName, subject, dateTime, position, email, organization }
    });
  }
};

// Renderizar página de editar compromisso
exports.getEditAppointmentPage = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.render('error', { message: 'Compromisso não encontrado' });
    }
    
    // Formatar data e hora para o input datetime-local
    const formattedDateTime = moment(appointment.dateTime).format('YYYY-MM-DDTHH:mm');
    
    res.render('edit-appointment', {
      appointment: {
        ...appointment.toObject(),
        dateTime: formattedDateTime
      }
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar compromisso' });
  }
};

// Atualizar compromisso
exports.updateAppointment = async (req, res) => {
  const { requesterName, subject, dateTime, position, email, organization } = req.body;
  
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.render('error', { message: 'Compromisso não encontrado' });
    }
    
    // Verificar se a data/hora foi alterada
    const newDateTime = new Date(dateTime);
    const dateChanged = appointment.dateTime.getTime() !== newDateTime.getTime();
    
    // Atualizar campos
    appointment.requesterName = requesterName;
    appointment.subject = subject;
    appointment.dateTime = newDateTime;
    appointment.position = position;
    appointment.email = email;
    appointment.organization = organization;
    
    // Resetar status de notificação se a data foi alterada
    if (dateChanged) {
      appointment.notificationSent = false;
    }
    
    await appointment.save();
    
    // Enviar nova notificação se a data foi alterada
    if (dateChanged) {
      await sendAppointmentNotification(
        email,
        `Atualização de Compromisso: ${subject}`,
        appointment
      );
      
      appointment.notificationSent = true;
      await appointment.save();
    }
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao atualizar compromisso' });
  }
};

// Excluir compromisso
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Compromisso não encontrado' });
    }
    
    await Appointment.findByIdAndDelete(req.params.id);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao excluir compromisso' });
  }
};

// Gerar relatório de compromissos do dia
exports.generateDayReport = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Converter string de data para objeto Date
    const selectedDate = moment(date, 'YYYY-MM-DD');
    const startDate = selectedDate.startOf('day').toDate();
    const endDate = selectedDate.endOf('day').toDate();
    
    // Buscar compromissos do dia
    const appointments = await Appointment.find({
      dateTime: { $gte: startDate, $lte: endDate }
    }).populate('createdBy', 'name').sort('dateTime');
    
    res.render('report', {
      appointments,
      date: selectedDate.format('DD/MM/YYYY'),
      printMode: true
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao gerar relatório' });
  }
};
