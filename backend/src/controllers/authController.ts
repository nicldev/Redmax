import { Request, Response } from 'express'
import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
  resendVerificationEmail,
} from '../services/authService'
import { env } from '../utils/env'
import logger from '../utils/logger'

/**
 * POST /api/auth/register
 * Registra novo usuário
 */
export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body)

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso. Verifique seu e-mail para ativar sua conta.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    })
  } catch (error: any) {
    logger.error('Register error:', error)
    throw error
  }
}

/**
 * GET /api/auth/verify-email?token=...
 * Verifica e-mail do usuário
 */
export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Token de verificação é obrigatório',
      })
    }

    await verifyEmail(token)

    // Retornar página HTML simples de sucesso
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>E-mail Verificado - RedaIA</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #F7F7F5;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #3F8CFF; }
            .success { color: #22c55e; font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>E-mail Verificado!</h1>
            <p>Sua conta foi ativada com sucesso.</p>
            <p>Você já pode fazer login no RedaIA.</p>
            <p><a href="${env.FRONTEND_URL}/login">Ir para login</a></p>
          </div>
        </body>
      </html>
    `)
  } catch (error: any) {
    logger.error('Verify email error:', error)
    
    // Retornar página HTML de erro
    res.status(error.statusCode || 400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Erro na Verificação - RedaIA</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #F7F7F5;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #ef4444; }
            .error { color: #ef4444; font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">✗</div>
            <h1>Erro na Verificação</h1>
            <p>${error.message || 'Token inválido ou expirado.'}</p>
            <p><a href="${env.FRONTEND_URL}/login">Voltar para login</a></p>
          </div>
        </body>
      </html>
    `)
  }
}

/**
 * POST /api/auth/login
 * Login do usuário
 */
export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(
      req.body.email,
      req.body.password
    )

    // Em produção, definir refresh token como HttpOnly cookie
    if (env.NODE_ENV === 'production') {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        accessToken,
        refreshToken: env.NODE_ENV === 'development' ? refreshToken : undefined, // Em dev, retornar no body também
        user,
      },
    })
  } catch (error: any) {
    logger.error('Login error:', error)
    throw error
  }
}

/**
 * POST /api/auth/refresh
 * Renova access token
 */
export async function refresh(req: Request, res: Response) {
  try {
    // Tentar obter refresh token do cookie ou body
    const refreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido',
      })
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAccessToken(refreshToken)

    // Em produção, atualizar cookie
    if (env.NODE_ENV === 'production') {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000,
      })
    }

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken: env.NODE_ENV === 'development' ? newRefreshToken : undefined,
      },
    })
  } catch (error: any) {
    logger.error('Refresh token error:', error)
    throw error
  }
}

/**
 * POST /api/auth/logout
 * Logout do usuário
 */
export async function logout(req: Request, res: Response) {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken

    if (refreshToken) {
      await revokeRefreshToken(refreshToken)
    }

    // Limpar cookie
    res.clearCookie('refreshToken')

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    })
  } catch (error: any) {
    logger.error('Logout error:', error)
    // Não falhar se token não for encontrado
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    })
  }
}

/**
 * POST /api/auth/resend-verification
 * Reenvia e-mail de verificação (requer autenticação)
 */
export async function resendVerification(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      })
    }

    await resendVerificationEmail(req.user.id)

    res.status(200).json({
      success: true,
      message: 'E-mail de verificação reenviado com sucesso',
    })
  } catch (error: any) {
    logger.error('Resend verification error:', error)
    throw error
  }
}

