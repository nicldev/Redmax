import axios from 'axios'
import logger from '../utils/logger'
import { serializeError } from '../utils/safeErrorSerializer'

/**
 * Serviço de avaliação de redações usando Groq API
 * Gratuita, rápida e fácil de usar
 */
export class GroqAIService {
  private apiKey: string | null = null
  private modelName: string

  constructor() {
    // Groq API key (gratuita)
    this.apiKey = process.env.GROQ_API_KEY || null
    
    // Modelo recomendado (gratuito e rápido) - usando modelo atualizado
    this.modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
    
    if (this.apiKey) {
      logger.info(`✅ Groq AI Service initialized with model: ${this.modelName}`)
    } else {
      logger.warn('⚠️ GROQ_API_KEY not configured. Configure uma chave gratuita em https://console.groq.com/')
    }
  }

  /**
   * Avalia uma redação do ENEM usando Groq AI
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
    if (!this.apiKey) {
      throw new Error('Groq API não configurada. Configure GROQ_API_KEY no arquivo .env')
    }

    try {
      const prompt = this.buildEvaluationPrompt(content, theme)

      logger.info('Sending essay to Groq AI for evaluation...')

      // Fazer requisição para Groq API
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: 'Você é um corretor especializado em redações do ENEM. Seja objetivo, justo e construtivo. Sempre responda em JSON válido conforme o formato solicitado.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 segundos
        }
      )

      // Acessar a resposta do Groq (formato OpenAI-compatible)
      let text = ''
      if (response.data && response.data.choices && response.data.choices[0]) {
        text = response.data.choices[0].message?.content || ''
      }

      if (!text || text.trim().length === 0) {
        logger.error('Resposta vazia da IA. Response data:', JSON.stringify(response.data, null, 2))
        throw new Error('Resposta vazia da IA. Verifique os logs para mais detalhes.')
      }

      logger.info(`Groq AI response received, length: ${text.length} characters`)

      // Parse da resposta da IA
      const evaluation = this.parseAIResponse(text)

      logger.info(`Essay evaluated. Total score: ${evaluation.totalScore}/1000`)
      return evaluation
    } catch (error: any) {
      // Serializar erro de forma segura (sem objetos circulares)
      const errorInfo = serializeError(error)
      logger.error('Error evaluating essay with Groq AI:', errorInfo)
      
      // Mensagens de erro mais específicas
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data
        
        if (status === 401) {
          throw new Error('Chave da API do Groq inválida. Verifique a GROQ_API_KEY no arquivo .env')
        }
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'] || '60'
          throw new Error(`Limite de requisições do Groq atingido. Aguarde ${retryAfter} segundos antes de tentar novamente.`)
        }
        if (status === 404) {
          throw new Error('Modelo não encontrado. Verifique se GROQ_MODEL está correto no .env')
        }
        
        const errorMessage = errorData?.error?.message || errorData?.message || error.message
        throw new Error(`Erro na API do Groq: ${errorMessage}`)
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout na avaliação da IA. Tente novamente.')
      }

      throw new Error(`Erro ao avaliar redação com IA: ${error.message || 'Erro desconhecido'}`)
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
- Retorne APENAS o JSON, sem texto adicional antes ou depois
- Certifique-se de que o JSON é válido e bem formatado`
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

      // Remove texto antes do JSON se houver
      const jsonStart = jsonText.indexOf('{')
      if (jsonStart > 0) {
        jsonText = jsonText.substring(jsonStart)
      }

      // Tenta encontrar o JSON na resposta
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }

      const parsed = JSON.parse(jsonText)

      // Validação básica
      if (!parsed.totalScore || parsed.totalScore === undefined) {
        throw new Error('totalScore não encontrado na resposta')
      }
      
      if (!parsed.scores || typeof parsed.scores !== 'object') {
        throw new Error('scores não encontrado ou inválido na resposta')
      }
      
      if (!parsed.feedbacks || typeof parsed.feedbacks !== 'object') {
        throw new Error('feedbacks não encontrado ou inválido na resposta')
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
          c5: Math.min(200, Math.max(0, scores.c5 || 0)),
        },
        feedbacks: {
          c1: parsed.feedbacks.c1 || 'Sem feedback disponível para C1.',
          c2: parsed.feedbacks.c2 || 'Sem feedback disponível para C2.',
          c3: parsed.feedbacks.c3 || 'Sem feedback disponível para C3.',
          c4: parsed.feedbacks.c4 || 'Sem feedback disponível para C4.',
          c5: parsed.feedbacks.c5 || 'Sem feedback disponível para C5.',
        },
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        rewriteSuggestion: parsed.rewriteSuggestion || undefined,
      }
    } catch (error: any) {
      logger.error('Error parsing AI response:', error)
      logger.error('Raw response (first 1000 chars):', text.substring(0, 1000))
      
      throw new Error(`Erro ao processar resposta da IA: ${error.message || 'Formato de resposta inválido'}`)
    }
  }

  /**
   * Verifica se o serviço está configurado
   */
  isConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0
  }
}

// Singleton instance
export const groqAIService = new GroqAIService()

