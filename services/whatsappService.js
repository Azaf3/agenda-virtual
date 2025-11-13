/**
 * Serviço de integração com WhatsApp (exemplo usando Twilio)
 * Para usar, você precisa instalar: npm install twilio
 */

// const twilio = require('twilio');
// const client = twilio(process.env.WHATSAPP_ACCOUNT_SID, process.env.WHATSAPP_AUTH_TOKEN);

/**
 * Enviar mensagem de confirmação de agendamento via WhatsApp
 */
exports.sendAppointmentConfirmation = async (appointmentData) => {
  const { patientPhone, patientName, psychologistName, date, time } = appointmentData;

  const message = `
🩺 *AgendaMental* 🩺

Olá, ${patientName}!

✅ Seu agendamento foi confirmado!

*Psicólogo(a):* ${psychologistName}
*Data:* ${date}
*Horário:* ${time}

Você receberá um lembrete 24h antes da consulta.

Para cancelar ou reagendar, acesse nossa plataforma.
  `.trim();

  try {
    // Descomente para usar Twilio
    // await client.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.WHATSAPP_PHONE_NUMBER}`,
    //   to: `whatsapp:${patientPhone}`,
    // });

    console.log('✅ WhatsApp enviado com sucesso (simulado)');
    console.log('Mensagem:', message);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar lembrete de consulta via WhatsApp
 */
exports.sendAppointmentReminder = async (appointmentData) => {
  const { patientPhone, patientName, psychologistName, date, time, meetingLink } = appointmentData;

  const message = `
🔔 *Lembrete de Consulta - AgendaMental*

Olá, ${patientName}!

Sua consulta é amanhã!

*Psicólogo(a):* ${psychologistName}
*Data:* ${date}
*Horário:* ${time}
${meetingLink ? `\n*Link da Reunião:* ${meetingLink}` : ''}

Não se esqueça! 😊
  `.trim();

  try {
    // Descomente para usar Twilio
    // await client.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.WHATSAPP_PHONE_NUMBER}`,
    //   to: `whatsapp:${patientPhone}`,
    // });

    console.log('✅ WhatsApp de lembrete enviado com sucesso (simulado)');
    console.log('Mensagem:', message);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar notificação de cancelamento via WhatsApp
 */
exports.sendCancellationNotification = async (appointmentData) => {
  const { patientPhone, patientName, psychologistName, date, time, reason } = appointmentData;

  const message = `
❌ *Cancelamento de Consulta - AgendaMental*

Olá, ${patientName}!

Seu agendamento foi cancelado.

*Psicólogo(a):* ${psychologistName}
*Data:* ${date}
*Horário:* ${time}
${reason ? `\n*Motivo:* ${reason}` : ''}

Você pode agendar uma nova consulta pela nossa plataforma a qualquer momento.
  `.trim();

  try {
    // Descomente para usar Twilio
    // await client.messages.create({
    //   body: message,
    //   from: `whatsapp:${process.env.WHATSAPP_PHONE_NUMBER}`,
    //   to: `whatsapp:${patientPhone}`,
    // });

    console.log('✅ WhatsApp de cancelamento enviado com sucesso (simulado)');
    console.log('Mensagem:', message);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error);
    return { success: false, error: error.message };
  }
};
