import axios from 'axios'
import logger from '../utils/logger'

/**
 * Serviço de avaliação de redações usando API direta do Gemini
 * Usa endpoint específico: gemini-1.5-flash-latest
 */
export class GeminiDirectService {
  private apiKey: string | null = null
  private readonly endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent'

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null
    
    if (this.apiKey) {
      logger.info('✅ Gemini Direct Service initialized (gemini-1.5-flash-latest)')
    } else {
      logger.warn('⚠️ GEMINI_API_KEY not configured for Gemini Direct Service')
    }
  }

  /**
   * Avalia uma redação usando o endpoint direto do Gemini
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
      throw new Error('Gemini API não configurada. Configure GEMINI_API_KEY no arquivo .env')
    }

    try {
      // Construir prompt de avaliação no formato solicitado
      const prompt = this.buildEvaluationPrompt(content)
      
      logger.info('Sending essay to Gemini Direct API (gemini-1.5-flash-latest) for evaluation...')

      // Fazer requisição direta para a API do Gemini
      const response = await axios.post(
        this.endpoint,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 segundos
        }
      )

      // Extrair texto da resposta
      let text = ''
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = response.data.candidates[0].content.parts[0].text
      }

      if (!text || text.trim().length === 0) {
        logger.error('Resposta vazia da API Gemini Direct')
        throw new Error('Resposta vazia da IA. Tente novamente.')
      }

      logger.info(`Gemini Direct API response received, length: ${text.length} characters`)

      // Parse da resposta e conversão para formato do sistema
      const evaluation = this.parseAIResponse(text)

      logger.info(`Essay evaluated. Total score: ${evaluation.totalScore}/1000`)
      return evaluation
    } catch (error: any) {
      logger.error('Error evaluating essay with Gemini Direct API:', error)
      
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data
        
        if (status === 401) {
          throw new Error('Gemini API Key inválida. Verifique sua chave no arquivo .env.')
        } else if (status === 429) {
          throw new Error('Limite de requisições da Gemini API atingido. Tente novamente mais tarde.')
        } else if (status === 404) {
          throw new Error('Modelo não encontrado. Verifique se o endpoint está correto.')
        }
        
        const errorMessage = errorData?.error?.message || errorData?.message || error.message
        throw new Error(`Erro na API do Gemini: ${errorMessage}`)
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout na avaliação da IA. Tente novamente.')
      }

      throw new Error(`Erro ao avaliar redação com Gemini Direct API: ${error.message || 'Erro desconhecido'}`)
    }
  }

  /**
   * Constrói o prompt de avaliação seguindo o formato solicitado pelo usuário
   */
  private buildEvaluationPrompt(content: string): string {
    return `Tarefa:
- Receba um texto enviado pelo usuário.
- Analise como uma banca de correção de redação.
- Corrija ortografia, gramática, coesão e coerência.
- Avalie argumentação, clareza e estrutura.
- Emita uma nota geral de 0 a 100.
- Liste os principais problemas detectados.
- Explique por que cada problema atrapalha a redação.
- Forneça sugestões diretas e acionáveis para melhorar.

Formato de resposta:
{
  "nota": number,
  "texto_corrigido": "...",
  "problemas": ["...", "..."],
  "feedback": "...",
  "sugestoes": ["...", "..."]
}

Entrada:
${content}

Faça a análise seguindo esse formato e retorne exatamente o JSON solicitado, sem comentários adicionais.`
  }

  /**
   * Faz o parse da resposta da IA e converte para o formato esperado pelo sistema
   */
  private parseAIResponse(text: string): {
    totalScore: number
    scores: { c1: number; c2: number; c3: number; c4: number; c5: number }
    feedbacks: { c1: string; c2: string; c3: string; c4: string; c5: string }
    strongPoints: string[]
    improvements: string[]
    rewriteSuggestion?: string
  } {
    try {
      // Limpar o texto e extrair JSON
      let jsonText = text.trim()
      
      // Remover markdown code blocks se existirem
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      // Tentar encontrar JSON no texto
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }

      const parsed = JSON.parse(jsonText)

      // Converter nota de 0-100 para 0-1000 (padrão ENEM)
      let nota = parsed.nota || 0
      if (nota <= 100) {
        nota = nota * 10 // Converter de 0-100 para 0-1000
      }

      // Distribuir a nota entre as 5 competências do ENEM proporcionalmente
      // Como não temos scores individuais, distribuímos igualmente
      const scorePorCompetencia = Math.round(nota / 5)

      // Criar feedbacks combinando o feedback geral com os problemas
      const feedbackGeral = parsed.feedback || ''
      const problemas = Array.isArray(parsed.problemas) ? parsed.problemas : []
      const feedbackCompleto = `${feedbackGeral}\n\nPrincipais problemas:\n${problemas.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}`

      return {
        totalScore: Math.min(1000, Math.max(0, nota)),
        scores: {
          c1: Math.min(200, Math.max(0, scorePorCompetencia)),
          c2: Math.min(200, Math.max(0, scorePorCompetencia)),
          c3: Math.min(200, Math.max(0, scorePorCompetencia)),
          c4: Math.min(200, Math.max(0, scorePorCompetencia)),
          c5: Math.min(200, Math.max(0, scorePorCompetencia))
        },
        feedbacks: {
          c1: feedbackCompleto || 'Avaliação para C1 não disponível.',
          c2: feedbackCompleto || 'Avaliação para C2 não disponível.',
          c3: feedbackCompleto || 'Avaliação para C3 não disponível.',
          c4: feedbackCompleto || 'Avaliação para C4 não disponível.',
          c5: feedbackCompleto || 'Avaliação para C5 não disponível.'
        },
        strongPoints: [], // Pode ser preenchido baseado no feedback positivo
        improvements: Array.isArray(parsed.sugestoes) ? parsed.sugestoes : [],
        rewriteSuggestion: parsed.texto_corrigido || undefined
      }
    } catch (error: any) {
      logger.error('Error parsing Gemini Direct API response:', error)
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

export const geminiDirectService = new GeminiDirectService()
