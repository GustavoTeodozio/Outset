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

