import bcrypt from 'bcrypt'
import prisma from '../models/prisma'
import { hashPassword, comparePassword } from './authService'

/**
 * Busca perfil do usuário
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      school: true,
      grade: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw { statusCode: 404, message: 'Usuário não encontrado' }
  }

  return user
}

/**
 * Atualiza perfil do usuário
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    school?: string
    grade?: string
  }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw { statusCode: 404, message: 'Usuário não encontrado' }
  }

  // Atualizar apenas campos fornecidos
  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.school !== undefined) updateData.school = data.school
  if (data.grade !== undefined) updateData.grade = data.grade

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      school: true,
      grade: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return updatedUser
}

/**
 * Altera senha do usuário
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw { statusCode: 404, message: 'Usuário não encontrado' }
  }

  // Verificar senha atual
  const passwordValid = await comparePassword(currentPassword, user.passwordHash)

  if (!passwordValid) {
    throw { statusCode: 401, message: 'Senha atual incorreta' }
  }

  // Hash da nova senha
  const newPasswordHash = await hashPassword(newPassword)

  // Atualizar senha
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  })

  return { success: true }
}

/**
 * Deleta conta do usuário
 */
export async function deleteUser(userId: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw { statusCode: 404, message: 'Usuário não encontrado' }
  }

  // Verificar senha
  const passwordValid = await comparePassword(password, user.passwordHash)

  if (!passwordValid) {
    throw { statusCode: 401, message: 'Senha incorreta' }
  }

  // Deletar usuário (cascade deleta tokens e verificações)
  await prisma.user.delete({
    where: { id: userId },
  })

  return { success: true }
}

