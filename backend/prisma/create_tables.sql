-- Script SQL para criar todas as tabelas do RedaIA
-- Execute este script no banco de dados APIenem

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "school" TEXT,
    "grade" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Verificação de E-mail
CREATE TABLE IF NOT EXISTS "email_verifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de Refresh Tokens
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela de Temas
CREATE TABLE IF NOT EXISTS "themes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "year" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Redações
CREATE TABLE IF NOT EXISTS "essays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "theme_id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "char_count" INTEGER NOT NULL DEFAULT 0,
    "is_evaluated" BOOLEAN NOT NULL DEFAULT false,
    "total_score" INTEGER,
    "score_c1" INTEGER,
    "score_c2" INTEGER,
    "score_c3" INTEGER,
    "score_c4" INTEGER,
    "score_c5" INTEGER,
    "feedback_c1" TEXT,
    "feedback_c2" TEXT,
    "feedback_c3" TEXT,
    "feedback_c4" TEXT,
    "feedback_c5" TEXT,
    "strong_points" TEXT,
    "improvements" TEXT,
    "rewrite_suggestion" TEXT,
    "evaluated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "essays_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "essays_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices para email_verifications
CREATE INDEX IF NOT EXISTS "email_verifications_token_idx" ON "email_verifications"("token");
CREATE INDEX IF NOT EXISTS "email_verifications_user_id_idx" ON "email_verifications"("user_id");

-- Índices para refresh_tokens
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- Índices para themes
CREATE INDEX IF NOT EXISTS "themes_category_idx" ON "themes"("category");
CREATE INDEX IF NOT EXISTS "themes_is_active_idx" ON "themes"("is_active");

-- Índices para essays
CREATE INDEX IF NOT EXISTS "essays_user_id_idx" ON "essays"("user_id");
CREATE INDEX IF NOT EXISTS "essays_theme_id_idx" ON "essays"("theme_id");
CREATE INDEX IF NOT EXISTS "essays_is_evaluated_idx" ON "essays"("is_evaluated");
CREATE INDEX IF NOT EXISTS "essays_created_at_idx" ON "essays"("created_at");

