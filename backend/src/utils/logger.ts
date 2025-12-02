import winston from 'winston'

// Configuração do logger Winston
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'redaia-backend' },
  transports: [
    // Escrever todos os logs em console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) => {
            // Função para evitar circular references
            const getCircularReplacer = () => {
              const seen = new WeakSet()
              return (_key: string, value: unknown) => {
                if (typeof value === 'object' && value !== null) {
                  if (seen.has(value)) {
                    return '[Circular]'
                  }
                  seen.add(value)
                }
                return value
              }
            }
            
            try {
              return `${timestamp} [${level}]: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta, getCircularReplacer(), 2) : ''
              }`
            } catch (err) {
              return `${timestamp} [${level}]: ${message} [Erro ao serializar metadata]`
            }
          }
        )
      ),
    }),
    // Escrever logs de erro em arquivo
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Escrever todos os logs em arquivo
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})

// Se não estiver em produção, logar também no nível debug
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

export default logger

