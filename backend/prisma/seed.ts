import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash da senha 'password123' com salt rounds 12
  const passwordHash = await bcrypt.hash('password123', 12)

  // Criar usuário admin/teste
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@redaia.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@redaia.com',
      passwordHash,
      emailVerified: true,
      school: 'Escola Teste',
      grade: '3º Ano',
    },
  })

  console.log('✅ Created admin user:', adminUser.email)
  console.log('   Password: password123')
  console.log('   Email verified: true')

  // Criar usuário de teste não verificado
  const testUser = await prisma.user.upsert({
    where: { email: 'test@redaia.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@redaia.com',
      passwordHash,
      emailVerified: false,
    },
  })

  console.log('✅ Created test user:', testUser.email)
  console.log('   Password: password123')
  console.log('   Email verified: false')

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

