# 🔧 Corrigir Enum UserRole no Banco de Dados

## ❌ Problema

A migração inicial criou a coluna `role` como `TEXT`, mas o Prisma espera o tipo enum `UserRole`. O PostgreSQL não tem esse enum criado.

## ✅ Solução: Executar SQL Direto no Banco

No terminal do container do backend, execute este comando SQL:

```bash
psql "$DATABASE_URL" << 'SQL'
-- Criar enum UserRole se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');
    END IF;
END $$;

-- Converter coluna role de TEXT para UserRole
ALTER TABLE "User" 
    ALTER COLUMN "role" TYPE "UserRole" 
    USING "role"::text::"UserRole";
SQL
```

## 🚀 Depois de Executar

Depois de executar o SQL acima, tente criar o admin novamente:

```bash
node /app/create-admin.js
```

## 📋 O Que Isso Faz

1. **Cria o enum `UserRole`** no PostgreSQL com valores `ADMIN` e `CLIENT`
2. **Converte a coluna `role`** de `TEXT` para `UserRole`
3. **Mantém os dados existentes** (valores 'ADMIN' e 'CLIENT' continuam funcionando)

---

**💡 Depois disso, você poderá criar usuários normalmente!**

