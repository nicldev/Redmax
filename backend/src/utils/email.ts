import nodemailer from 'nodemailer'
import { env } from './env'
import logger from './logger'

// Configurar transporter do Nodemailer
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true para 465, false para outras portas
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

// Verificar conexão SMTP
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP connection error:', error)
  } else {
    logger.info('✅ SMTP server is ready to send emails')
  }
})

interface SendVerificationEmailParams {
  email: string
  name: string
  token: string
}

/**
 * Envia e-mail de verificação para o usuário
 */
export async function sendVerificationEmail({
  email,
  name,
  token,
}: SendVerificationEmailParams): Promise<void> {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: 'Verifique seu e-mail - ConexãoSaber',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #3F8CFF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bem-vindo ao ConexãoSaber, ${name}!</h1>
            <p>Obrigado por se cadastrar. Para ativar sua conta, clique no botão abaixo para verificar seu e-mail:</p>
            <a href="${verificationUrl}" class="button">Verificar E-mail</a>
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #3F8CFF;">${verificationUrl}</p>
            <p><strong>Este link expira em 24 horas.</strong></p>
            <div class="footer">
              <p>Se você não se cadastrou no ConexãoSaber, ignore este e-mail.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Bem-vindo ao ConexãoSaber, ${name}!
      
      Obrigado por se cadastrar. Para ativar sua conta, acesse o link abaixo para verificar seu e-mail:
      
      ${verificationUrl}
      
      Este link expira em 24 horas.
      
      Se você não se cadastrou no ConexãoSaber, ignore este e-mail.
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    logger.info(`Verification email sent to ${email}:`, info.messageId)
  } catch (error) {
    logger.error(`Error sending verification email to ${email}:`, error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Mock para testes - não envia e-mail de verdade
 */
export const emailService = {
  sendVerificationEmail: process.env.NODE_ENV === 'test' 
    ? async () => {
        logger.debug('Mock: Verification email would be sent')
        return Promise.resolve()
      }
    : sendVerificationEmail,
}

