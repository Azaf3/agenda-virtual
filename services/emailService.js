const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Enviar email de confirmação de agendamento
 */
exports.sendAppointmentConfirmation = async (appointmentData) => {
  const { patientEmail, patientName, psychologistName, date, time } = appointmentData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: patientEmail,
    subject: '✅ Agendamento Confirmado - AgendaMental',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Agendamento Confirmado!</h2>
        <p>Olá, <strong>${patientName}</strong>!</p>
        <p>Seu agendamento foi confirmado com sucesso.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalhes do Agendamento:</h3>
          <p><strong>Psicólogo(a):</strong> ${psychologistName}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Horário:</strong> ${time}</p>
        </div>
        
        <p>Você receberá um lembrete 24 horas antes da consulta.</p>
        <p>Se precisar cancelar ou reagendar, faça-o com pelo menos 24 horas de antecedência.</p>
        
        <p>Atenciosamente,<br><strong>Equipe AgendaMental</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmação enviado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar lembrete de consulta
 */
exports.sendAppointmentReminder = async (appointmentData) => {
  const { patientEmail, patientName, psychologistName, date, time, meetingLink } = appointmentData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: patientEmail,
    subject: '🔔 Lembrete: Sua consulta é amanhã - AgendaMental',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9800;">Lembrete de Consulta</h2>
        <p>Olá, <strong>${patientName}</strong>!</p>
        <p>Este é um lembrete de que você tem uma consulta agendada para amanhã.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalhes do Agendamento:</h3>
          <p><strong>Psicólogo(a):</strong> ${psychologistName}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Horário:</strong> ${time}</p>
          ${meetingLink ? `<p><strong>Link da Reunião:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
        </div>
        
        <p>Prepare-se para a consulta e não se esqueça!</p>
        
        <p>Atenciosamente,<br><strong>Equipe AgendaMental</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de lembrete enviado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar notificação de cancelamento
 */
exports.sendCancellationNotification = async (appointmentData) => {
  const { patientEmail, patientName, psychologistName, date, time, reason } = appointmentData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: patientEmail,
    subject: '❌ Agendamento Cancelado - AgendaMental',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F44336;">Agendamento Cancelado</h2>
        <p>Olá, <strong>${patientName}</strong>!</p>
        <p>Informamos que seu agendamento foi cancelado.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalhes do Agendamento:</h3>
          <p><strong>Psicólogo(a):</strong> ${psychologistName}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Horário:</strong> ${time}</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
        </div>
        
        <p>Você pode agendar uma nova consulta a qualquer momento pela nossa plataforma.</p>
        
        <p>Atenciosamente,<br><strong>Equipe AgendaMental</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de cancelamento enviado com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};
