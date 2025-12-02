/**
 * Utilitário para serializar erros de forma segura, evitando referências circulares
 */
export function serializeError(error: any): any {
  if (!error) return null

  const serialized: any = {
    message: error.message || 'Erro desconhecido',
    name: error.name,
    code: error.code
  }

  // Se for erro do Axios, extrair informações da response
  if (error.response) {
    serialized.response = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    }
  }

  // Se tiver request, apenas o método e URL
  if (error.request) {
    serialized.request = {
      method: error.config?.method,
      url: error.config?.url
    }
  }

  // Stack trace (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development' && error.stack) {
    serialized.stack = error.stack.split('\n').slice(0, 10).join('\n')
  }

  return serialized
}
