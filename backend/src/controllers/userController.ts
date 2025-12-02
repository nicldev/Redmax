import { Request, Response } from 'express'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
} from '../services/userService'
import logger from '../utils/logger'

/**
 * GET /api/user/profile
 * Retorna perfil do usuário autenticado
 */
export async function getProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      })
    }

    const user = await getUserProfile(req.user.id)

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error: any) {
    logger.error('Get profile error:', error)
    throw error
  }
}

/**
 * PUT /api/user/profile
 * Atualiza perfil do usuário
 */
export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      })
    }

    const user = await updateUserProfile(req.user.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: { user },
    })
  } catch (error: any) {
    logger.error('Update profile error:', error)
    throw error
  }
}

/**
 * PUT /api/user/change-password
 * Altera senha do usuário
 */
export async function changePasswordHandler(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      })
    }

    await changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    )

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso',
    })
  } catch (error: any) {
    logger.error('Change password error:', error)
    throw error
  }
}

/**
 * DELETE /api/user
 * Deleta conta do usuário
 */
export async function deleteAccount(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autenticado',
      })
    }

    await deleteUser(req.user.id, req.body.password)

    // Limpar cookie de refresh token
    res.clearCookie('refreshToken')

    res.status(200).json({
      success: true,
      message: 'Conta deletada com sucesso',
    })
  } catch (error: any) {
    logger.error('Delete account error:', error)
    throw error
  }
}

