# Documentação da API - ConexãoSaber

## Base URL

**Desenvolvimento:** `http://localhost:3333`  
**Produção:** `[URL_DO_SERVIDOR]`

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. A maioria dos endpoints requer um token de acesso no header:

```
Authorization: Bearer <accessToken>
```

### Fluxo de Autenticação

1. Registrar usuário → Receber token de verificação por e-mail
2. Verificar e-mail → Ativar conta
3. Fazer login → Receber `accessToken` e `refreshToken`
4. Usar `accessToken` em requisições autenticadas
5. Renovar `accessToken` usando `refreshToken` quando expirar

## Endpoints

### Autenticação

#### POST `/api/auth/register`

Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaSegura123",
  "school": "Escola Exemplo",
  "grade": "3º Ano"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Conta criada com sucesso. Verifique seu e-mail para ativar sua conta.",
  "data": {
    "user": {
      "id": "clx123...",
      "name": "João Silva",
      "email": "joao@example.com",
      "emailVerified": false
    }
  }
}
```

**Erros:**
- `400` - Dados inválidos
- `409` - E-mail já cadastrado

---

#### GET `/api/auth/verify-email?token={token}`

Verifica o e-mail do usuário usando o token enviado por e-mail.

**Query Parameters:**
- `token` (string, obrigatório) - Token de verificação

**Response (200):**
Retorna página HTML de sucesso ou erro.

**Erros:**
- `404` - Token inválido ou expirado

---

#### POST `/api/auth/login`

Realiza login do usuário.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "SenhaSegura123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": "clx123...",
      "name": "João Silva",
      "email": "joao@example.com",
      "emailVerified": true
    }
  }
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Credenciais inválidas
- `403` - E-mail não verificado

---

#### POST `/api/auth/refresh`

Renova o access token usando o refresh token.

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros:**
- `400` - Token inválido
- `401` - Token expirado ou revogado

---

#### POST `/api/auth/logout`

Realiza logout e revoga o refresh token.

**Request Body:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

#### POST `/api/auth/resend-verification`

Reenvia e-mail de verificação. Requer autenticação.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "E-mail de verificação reenviado"
}
```

---

### Gerenciamento de Usuário

Todos os endpoints abaixo requerem autenticação.

#### GET `/api/user/profile`

Retorna o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "name": "João Silva",
      "email": "joao@example.com",
      "school": "Escola Exemplo",
      "grade": "3º Ano",
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Erros:**
- `401` - Não autenticado
- `403` - E-mail não verificado

---

#### PUT `/api/user/profile`

Atualiza o perfil do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "João Silva Atualizado",
  "school": "Nova Escola",
  "grade": "2º Ano"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "name": "João Silva Atualizado",
      "email": "joao@example.com",
      "school": "Nova Escola",
      "grade": "2º Ano"
    }
  }
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Não autenticado

---

#### PUT `/api/user/change-password`

Altera a senha do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "SenhaAtual123",
  "newPassword": "NovaSenhaSegura123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Erros:**
- `400` - Dados inválidos
- `401` - Senha atual incorreta ou não autenticado

---

#### DELETE `/api/user`

Deleta a conta do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "password": "SenhaAtual123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conta deletada com sucesso"
}
```

**Erros:**
- `400` - Senha não fornecida
- `401` - Senha incorreta ou não autenticado

---

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (ex: e-mail duplicado)
- `429` - Muitas requisições (rate limit)
- `500` - Erro interno do servidor

## Formato de Resposta

Todas as respostas seguem o formato:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem opcional"
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": [ "Detalhes do erro" ]
}
```

## Rate Limiting

Alguns endpoints têm rate limiting aplicado:
- `/api/auth/register` - 5 requisições por 15 minutos
- `/api/auth/login` - 5 requisições por 15 minutos
- Endpoints gerais - 300 requisições por 15 minutos

## Validações

### Registro
- `name`: mínimo 2 caracteres, máximo 100
- `email`: formato de e-mail válido
- `password`: mínimo 8 caracteres, deve conter letras e números
- `school`: opcional, máximo 200 caracteres
- `grade`: opcional, máximo 50 caracteres

### Login
- `email`: formato de e-mail válido
- `password`: obrigatório

### Atualização de Perfil
- `name`: mínimo 2 caracteres, máximo 100
- `school`: opcional, máximo 200 caracteres
- `grade`: opcional, máximo 50 caracteres

### Alteração de Senha
- `currentPassword`: obrigatório
- `newPassword`: mínimo 8 caracteres, deve conter letras e números

## Exemplos de Uso

### cURL - Registrar Usuário
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "SenhaSegura123",
    "school": "Escola Exemplo",
    "grade": "3º Ano"
  }'
```

### cURL - Login
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SenhaSegura123"
  }'
```

### cURL - Obter Perfil
```bash
curl -X GET http://localhost:3333/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Health Check

#### GET `/health`

Verifica se a API está funcionando.

**Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

