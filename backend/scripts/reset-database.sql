-- Script para limpar completamente o banco e permitir reaplicar migrações
-- Execute este script no PostgreSQL antes de rodar prisma migrate deploy

-- Desabilitar foreign keys temporariamente
SET session_replication_role = 'replica';

-- Deletar todas as tabelas (isso vai deletar todas as foreign keys também)
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Deletar tabela de migrações do Prisma
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

-- Reabilitar foreign keys
SET session_replication_role = 'origin';

-- Comentário: Após executar este script, rode:
-- npx prisma migrate deploy

