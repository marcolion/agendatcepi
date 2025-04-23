const nodemailer = require('nodemailer');

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Para desenvolvimento, usaremos Ethereal
  port: 587,
  secure: false,
  auth: {
    user: 'ethereal.user@ethereal.email', // Será substituído por credenciais reais
    pass: 'ethereal.pass'
  }
});

// Função para enviar email de notificação de compromisso
const sendAppointmentNotification = async (to, subject, appointmentDetails) => {
  try {
    // Criar conta de teste no Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    // Atualizar configurações com a conta de teste
    transporter.auth.user = testAccount.user;
    transporter.auth.pass = testAccount.pass;
    
    // Enviar email
    const info = await transporter.sendMail({
      from: '"Agenda da Presidência TCE/PI" <agenda@tce-pi.gov.br>',
      to: to,
      subject: subject,
      html: `
        <h2>Detalhes do Compromisso</h2>
        <p><strong>Solicitante:</strong> ${appointmentDetails.requesterName}</p>
        <p><strong>Assunto:</strong> ${appointmentDetails.subject}</p>
        <p><strong>Data e Hora:</strong> ${new Date(appointmentDetails.dateTime).toLocaleString('pt-BR')}</p>
        <p><strong>Cargo:</strong> ${appointmentDetails.position}</p>
        <p><strong>Órgão:</strong> ${appointmentDetails.organization}</p>
        <p>Este é um email automático, por favor não responda.</p>
      `
    });
    
    console.log('Email enviado: %s', info.messageId);
    console.log('URL de visualização: %s', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendAppointmentNotification
};
