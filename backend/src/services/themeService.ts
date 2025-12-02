import prisma from '../models/prisma'
import logger from '../utils/logger'

/**
 * Temas de redação do ENEM - atualizados e relevantes para 2024/2025
 */
const ENEM_THEMES = [
  {
    title: 'Desafios da educação no Brasil',
    description: 'Analise os principais desafios enfrentados pela educação brasileira e suas possíveis soluções.',
    category: 'Educação'
  },
  {
    title: 'Sustentabilidade e meio ambiente',
    description: 'Discuta sobre a importância da sustentabilidade ambiental no contexto atual e as ações necessárias para preservação.',
    category: 'Meio Ambiente'
  },
  {
    title: 'Inclusão social e diversidade',
    description: 'Reflita sobre os desafios e avanços na construção de uma sociedade mais inclusiva e diversa.',
    category: 'Social'
  },
  {
    title: 'Tecnologia e sociedade',
    description: 'Analise o impacto das tecnologias digitais na sociedade contemporânea e suas implicações.',
    category: 'Tecnologia'
  },
  {
    title: 'Saúde pública no Brasil',
    description: 'Discuta os desafios do sistema de saúde pública brasileiro e possíveis melhorias.',
    category: 'Saúde'
  },
  {
    title: 'Violência urbana e segurança pública',
    description: 'Reflita sobre as causas e possíveis soluções para o problema da violência urbana no Brasil.',
    category: 'Segurança'
  },
  {
    title: 'Desigualdade social e econômica',
    description: 'Analise as causas e consequências da desigualdade social no Brasil e meios de reduzi-la.',
    category: 'Social'
  },
  {
    title: 'Mobilidade urbana e transporte público',
    description: 'Discuta sobre os desafios da mobilidade urbana e a importância de um transporte público eficiente.',
    category: 'Infraestrutura'
  },
  {
    title: 'Alimentação saudável e segurança alimentar',
    description: 'Reflita sobre o direito à alimentação adequada e os desafios para garantir segurança alimentar.',
    category: 'Saúde'
  },
  {
    title: 'Democracia e participação política',
    description: 'Analise a importância da participação cidadã para o fortalecimento da democracia.',
    category: 'Política'
  },
  {
    title: 'Cultura e identidade nacional',
    description: 'Discuta sobre a preservação da cultura brasileira e a construção da identidade nacional.',
    category: 'Cultura'
  },
  {
    title: 'Desafios da juventude no Brasil',
    description: 'Reflita sobre os principais desafios enfrentados pelos jovens brasileiros na atualidade.',
    category: 'Social'
  },
  {
    title: 'Inteligência artificial e futuro do trabalho',
    description: 'Analise o impacto da inteligência artificial no mercado de trabalho e na sociedade.',
    category: 'Tecnologia'
  },
  {
    title: 'Fake news e informação na era digital',
    description: 'Discuta sobre os desafios das fake news e a importância da educação midiática.',
    category: 'Tecnologia'
  },
  {
    title: 'Preservação de ecossistemas brasileiros',
    description: 'Reflita sobre a importância da preservação da Amazônia, Cerrado e outros biomas brasileiros.',
    category: 'Meio Ambiente'
  },
  {
    title: 'Acesso à justiça e direitos humanos',
    description: 'Analise os desafios para garantir acesso à justiça e efetivação dos direitos humanos.',
    category: 'Direitos'
  },
  {
    title: 'Evasão escolar e permanência estudantil',
    description: 'Discuta sobre as causas da evasão escolar e estratégias para garantir a permanência dos estudantes.',
    category: 'Educação'
  },
  {
    title: 'Envelhecimento populacional e políticas públicas',
    description: 'Reflita sobre os desafios e oportunidades do envelhecimento populacional no Brasil.',
    category: 'Saúde'
  },
  {
    title: 'Economia criativa e empreendedorismo',
    description: 'Analise o papel da economia criativa e do empreendedorismo no desenvolvimento econômico.',
    category: 'Economia'
  },
  {
    title: 'Habitabilidade e moradia digna',
    description: 'Discuta sobre os desafios do déficit habitacional e o direito à moradia adequada.',
    category: 'Infraestrutura'
  }
]

export class ThemeService {
  /**
   * Garante que os temas estejam cadastrados no banco de dados
   */
  static async seedThemes() {
    try {
      const existingThemes = await prisma.theme.findMany()
      
      if (existingThemes.length === 0) {
        logger.info('Seeding themes into database...')
        
        for (const themeData of ENEM_THEMES) {
          await prisma.theme.create({
            data: {
              title: themeData.title,
              description: themeData.description,
              category: themeData.category,
              isActive: true
            }
          })
        }
        
        logger.info(`✅ ${ENEM_THEMES.length} themes seeded successfully`)
      }
    } catch (error) {
      logger.error('Error seeding themes:', error)
      throw error
    }
  }

  /**
   * Busca um tema aleatório ativo
   */
  static async getRandomTheme() {
    try {
      await this.seedThemes() // Garante que os temas existam

      const themes = await prisma.theme.findMany({
        where: {
          isActive: true
        }
      })

      if (themes.length === 0) {
        throw new Error('Nenhum tema disponível no banco de dados')
      }

      const randomIndex = Math.floor(Math.random() * themes.length)
      return themes[randomIndex]
    } catch (error) {
      logger.error('Error getting random theme:', error)
      throw error
    }
  }

  /**
   * Busca todos os temas ativos
   */
  static async getAllThemes() {
    try {
      await this.seedThemes() // Garante que os temas existam

      return await prisma.theme.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          title: 'asc'
        }
      })
    } catch (error) {
      logger.error('Error getting all themes:', error)
      throw error
    }
  }

  /**
   * Busca um tema por ID
   */
  static async getThemeById(id: string) {
    try {
      const theme = await prisma.theme.findUnique({
        where: {
          id,
          isActive: true
        }
      })

      if (!theme) {
        throw new Error('Tema não encontrado')
      }

      return theme
    } catch (error) {
      logger.error('Error getting theme by ID:', error)
      throw error
    }
  }
}

