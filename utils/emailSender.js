const nodemailer = require('nodemailer');

/**
 * Configurar transporter do nodemailer
 */
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Enviar email genérico
 * @param {Object} options - Opções do email (to, subject, text, html)
 */
exports.sendEmail = async (options) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado para ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Template de email de boas-vindas
 */
exports.sendWelcomeEmail = async (userEmail, userName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Bem-vindo(a) ao AgendaMental! 🎉</h2>
      <p>Olá, <strong>${userName}</strong>!</p>
      <p>Estamos muito felizes em tê-lo(a) conosco.</p>
      <p>O AgendaMental é a sua plataforma para agendar consultas com psicólogos e terapeutas de forma simples e segura.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>O que você pode fazer:</h3>
        <ul>
          <li>Buscar psicólogos por especialidade</li>
          <li>Agendar consultas online ou presenciais</li>
          <li>Receber lembretes automáticos</li>
          <li>Gerenciar seus agendamentos</li>
        </ul>
      </div>
      
      <p>Se tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
      <p>Atenciosamente,<br><strong>Equipe AgendaMental</strong></p>
    </div>
  `;

  return await this.sendEmail({
    to: userEmail,
    subject: 'Bem-vindo ao AgendaMental! 🎉',
    html,
  });
};

/**
 * Template de email de recuperação de senha
 */
exports.sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF9800;">Recuperação de Senha</h2>
      <p>Você solicitou a recuperação de senha.</p>
      <p>Clique no botão abaixo para redefinir sua senha:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      
      <p>Ou copie e cole este link no seu navegador:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      
      <p style="color: #F44336; margin-top: 20px;">
        <strong>Atenção:</strong> Este link expira em 1 hora.
      </p>
      
      <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      
      <p>Atenciosamente,<br><strong>Equipe AgendaMental</strong></p>
    </div>
  `;

  return await this.sendEmail({
    to: userEmail,
    subject: 'Recuperação de Senha - AgendaMental',
    html,
  });
};
