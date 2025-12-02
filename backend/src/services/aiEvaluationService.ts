import { GoogleGenerativeAI } from '@google/generative-ai'
import logger from '../utils/logger'

/**
 * Serviço de avaliação de redações usando Google Gemini AI
 */
export class AIEvaluationService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor() {
    // A chave da API será lida do ambiente
    // Se não estiver configurada, o serviço não funcionará
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey)
        // Usa modelo compatível - gemini-pro ou gemini-1.0-pro são mais estáveis
        const modelName = process.env.GEMINI_MODEL || 'gemini-pro'
        this.model = this.genAI.getGenerativeModel({ 
          model: modelName
        })
        logger.info(`✅ Using Gemini model: ${modelName}`)
        logger.info('✅ Google Gemini AI initialized successfully')
      } catch (error) {
        logger.error('Error initializing Gemini AI:', error)
      }
    } else {
      logger.warn('⚠️ GEMINI_API_KEY not configured. AI evaluation will not work.')
    }
  }

  /**
   * Avalia uma redação do ENEM usando IA
   * Retorna nota e feedback detalhado por competência
   */
  async evaluateEssay(
    content: string,
    theme: string
  ): Promise<{
    totalScore: number
    scores: {
      c1: number
      c2: number
      c3: number
      c4: number
      c5: number
    }
    feedbacks: {
      c1: string
      c2: string
      c3: string
      c4: string
      c5: string
    }
    strongPoints: string[]
    improvements: string[]
    rewriteSuggestion?: string
  }> {
    if (!this.model) {
      throw new Error('Serviço de IA não configurado. Configure a GEMINI_API_KEY no arquivo .env')
    }

    try {
      const prompt = this.buildEvaluationPrompt(content, theme)

      logger.info('Sending essay to AI for evaluation...')
      
      // Timeout de 60 segundos para avaliação
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na avaliação da IA')), 60000)
      })
      
      const evaluationPromise = this.model.generateContent(prompt)
      
      const result = await Promise.race([evaluationPromise, timeoutPromise])
      
      if (!result) {
        throw new Error('Resposta inválida da IA')
      }
      
      // Verificar se result tem a propriedade response
      if (!('response' in result)) {
        logger.error('Resultado da IA não tem propriedade response:', result)
        throw new Error('Formato de resposta da IA inválido')
      }
      
      const response = result.response
      
      // Obter o texto da resposta - response.text() retorna uma Promise
      let text: string
      try {
        text = await response.text()
      } catch (textError: any) {
        logger.error('Erro ao obter texto da resposta:', textError)
        logger.error('Estrutura do response:', JSON.stringify(response, null, 2))
        throw new Error(`Erro ao extrair texto da resposta da IA: ${textError.message || 'Erro desconhecido'}`)
      }
      
      if (!text || text.trim().length === 0) {
        logger.error('Resposta vazia da IA')
        throw new Error('Resposta vazia da IA. Tente novamente.')
      }

      logger.info(`AI response received, length: ${text.length} characters`)
      
      // Parse da resposta da IA
      const evaluation = this.parseAIResponse(text)

      logger.info(`Essay evaluated. Total score: ${evaluation.totalScore}/1000`)
      return evaluation
    } catch (error: any) {
      logger.error('Error evaluating essay with AI:', error)
      
      // Mensagens de erro mais específicas
      if (error.message && error.message.includes('API_KEY')) {
        throw new Error('Chave da API do Gemini não configurada. Configure a GEMINI_API_KEY no arquivo .env do backend.')
      }
      
      if (error.message && error.message.includes('Timeout')) {
        throw new Error('Timeout na avaliação da IA. A avaliação demorou muito. Tente novamente.')
      }
      
      if (error.message && error.message.includes('quota') || error.message && error.message.includes('rate limit')) {
        throw new Error('Limite de requisições da API do Gemini atingido. Tente novamente mais tarde.')
      }
      
      if (error.message && error.message.includes('invalid')) {
        throw new Error('Erro na chave da API do Gemini. Verifique se a chave está correta.')
      }
      
      // Re-lançar o erro original se tiver uma mensagem útil
      if (error.message && error.message !== 'Erro ao avaliar redação com IA. Tente novamente.') {
        throw error
      }
      
      throw new Error('Erro ao avaliar redação com IA. Verifique se a GEMINI_API_KEY está configurada corretamente no backend.')
    }
  }

  /**
   * Constrói o prompt para avaliação da redação
   */
  private buildEvaluationPrompt(content: string, theme: string): string {
    return `Você é um corretor especializado em redações do ENEM. Avalie a seguinte redação seguindo rigorosamente os critérios oficiais do ENEM.

TEMA DA REDAÇÃO: ${theme}

REDAÇÃO DO ALUNO:
${content}

---

INSTRUÇÕES PARA AVALIAÇÃO:

Avalie a redação considerando as 5 competências do ENEM:

C1 - Domínio da escrita formal (0-200 pontos):
- Adequação à norma padrão da língua portuguesa
- Ausência ou presença de desvios gramaticais
- Uso correto da ortografia

C2 - Compreensão da proposta (0-200 pontos):
- Compreensão do tema proposto
- Não fuga ao tema
- Exploração dos textos motivadores

C3 - Argumentação (0-200 pontos):
- Seleção, organização e interpretação de informações
- Argumentos bem fundamentados
- Repertório sociocultural produtivo

C4 - Coesão textual (0-200 pontos):
- Uso adequado de conectivos
- Articulação entre parágrafos
- Progressão textual coerente

C5 - Proposta de intervenção (0-200 pontos):
- Presença de proposta de intervenção
- Detalhamento da proposta
- Respeito aos direitos humanos

FORMATO DE RESPOSTA (JSON):

{
  "totalScore": 0-1000,
  "scores": {
    "c1": 0-200,
    "c2": 0-200,
    "c3": 0-200,
    "c4": 0-200,
    "c5": 0-200
  },
  "feedbacks": {
    "c1": "Feedback detalhado sobre domínio da escrita formal...",
    "c2": "Feedback detalhado sobre compreensão da proposta...",
    "c3": "Feedback detalhado sobre argumentação...",
    "c4": "Feedback detalhado sobre coesão textual...",
    "c5": "Feedback detalhado sobre proposta de intervenção..."
  },
  "strongPoints": [
    "Ponto forte 1",
    "Ponto forte 2",
    "Ponto forte 3"
  ],
  "improvements": [
    "Melhoria sugerida 1",
    "Melhoria sugerida 2",
    "Melhoria sugerida 3"
  ],
  "rewriteSuggestion": "Sugestão de reescrita de um parágrafo específico que precisa melhorar (opcional)"
}

IMPORTANTE:
- Seja objetivo e construtivo nos feedbacks
- Identifique erros específicos quando existirem
- Sugira melhorias práticas e acionáveis
- A nota deve ser justa e refletir o desempenho real
- Retorne APENAS o JSON, sem texto adicional antes ou depois`
  }

  /**
   * Faz o parse da resposta da IA para extrair os dados estruturados
   */
  private parseAIResponse(text: string): {
    totalScore: number
    scores: {
      c1: number
      c2: number
      c3: number
      c4: number
      c5: number
    }
    feedbacks: {
      c1: string
      c2: string
      c3: string
      c4: string
      c5: string
    }
    strongPoints: string[]
    improvements: string[]
    rewriteSuggestion?: string
  } {
    try {
      // Remove markdown code blocks se existirem
      let jsonText = text.trim()
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

      // Tenta encontrar o JSON na resposta
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }

      const parsed = JSON.parse(jsonText)

      // Validação básica
      if (!parsed.totalScore || !parsed.scores || !parsed.feedbacks) {
        throw new Error('Resposta da IA em formato inválido')
      }

      // Validação de scores
      const scores = parsed.scores
      const total = parsed.totalScore || 0
      const sum = (scores.c1 || 0) + (scores.c2 || 0) + (scores.c3 || 0) + (scores.c4 || 0) + (scores.c5 || 0)

      return {
        totalScore: Math.min(1000, Math.max(0, total || sum)),
        scores: {
          c1: Math.min(200, Math.max(0, scores.c1 || 0)),
          c2: Math.min(200, Math.max(0, scores.c2 || 0)),
          c3: Math.min(200, Math.max(0, scores.c3 || 0)),
          c4: Math.min(200, Math.max(0, scores.c4 || 0)),
          c5: Math.min(200, Math.max(0, scores.c5 || 0))
        },
        feedbacks: {
          c1: parsed.feedbacks.c1 || 'Sem feedback disponível para C1.',
          c2: parsed.feedbacks.c2 || 'Sem feedback disponível para C2.',
          c3: parsed.feedbacks.c3 || 'Sem feedback disponível para C3.',
          c4: parsed.feedbacks.c4 || 'Sem feedback disponível para C4.',
          c5: parsed.feedbacks.c5 || 'Sem feedback disponível para C5.'
        },
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        rewriteSuggestion: parsed.rewriteSuggestion || undefined
      }
    } catch (error: any) {
      logger.error('Error parsing AI response:', error)
      logger.error('Raw response:', text.substring(0, 500)) // Log apenas os primeiros 500 caracteres
      
      // Lançar erro ao invés de retornar avaliação padrão
      throw new Error(`Erro ao processar resposta da IA: ${error.message || 'Formato de resposta inválido'}`)
    }
  }

  /**
   * Verifica se o serviço está configurado
   */
  isConfigured(): boolean {
    return this.model !== null
  }
}

// Singleton instance
export const aiEvaluationService = new AIEvaluationService()

