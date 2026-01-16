-- Script para corrigir tipos ENUM no PostgreSQL
-- Execute este script diretamente no banco de dados da VPS
-- Conecte-se ao banco e execute: psql -U postgres -d marketing -f fix-enum-types.sql

-- Criar tipos ENUM que estão faltando no banco de dados
-- Esta migração corrige o problema onde as colunas foram criadas como TEXT ao invés de ENUM

-- TaskStatus ENUM
DO $$ BEGIN
    CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'IN_PRODUCTION', 'FOR_APPROVAL', 'SCHEDULED', 'PUBLISHED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TaskCategory ENUM
DO $$ BEGIN
    CREATE TYPE "TaskCategory" AS ENUM ('FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_ADS', 'CONTENT', 'LANDING_PAGE', 'EMAIL_MARKETING', 'TRAFFIC', 'SEO', 'SOCIAL_MEDIA', 'COPYWRITING', 'DESIGN', 'VIDEO', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TaskPriority ENUM
DO $$ BEGIN
    CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CampaignStatus ENUM
DO $$ BEGIN
    CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- MediaType ENUM
DO $$ BEGIN
    CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ApprovalStatus ENUM
DO $$ BEGIN
    CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alterar colunas da tabela Task para usar os tipos ENUM
ALTER TABLE "Task" 
    ALTER COLUMN "status" TYPE "TaskStatus" USING "status"::"TaskStatus",
    ALTER COLUMN "category" TYPE "TaskCategory" USING "category"::"TaskCategory",
    ALTER COLUMN "priority" TYPE "TaskPriority" USING "priority"::"TaskPriority";

-- Alterar coluna da tabela TaskAttachment para usar MediaType
ALTER TABLE "TaskAttachment" 
    ALTER COLUMN "type" TYPE "MediaType" USING "type"::"MediaType";

-- Alterar coluna da tabela Campaign para usar CampaignStatus
ALTER TABLE "Campaign" 
    ALTER COLUMN "status" TYPE "CampaignStatus" USING "status"::"CampaignStatus";

-- Alterar colunas da tabela MediaAsset para usar os tipos ENUM
ALTER TABLE "MediaAsset" 
    ALTER COLUMN "type" TYPE "MediaType" USING "type"::"MediaType";

-- Alterar approvalStatus se a coluna existir
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'MediaAsset' AND column_name = 'approvalStatus') THEN
        ALTER TABLE "MediaAsset" 
            ALTER COLUMN "approvalStatus" TYPE "ApprovalStatus" USING "approvalStatus"::"ApprovalStatus";
    END IF;
END $$;

-- Alterar coluna da tabela CampaignApproval para usar ApprovalStatus
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'CampaignApproval' AND column_name = 'status') THEN
        ALTER TABLE "CampaignApproval" 
            ALTER COLUMN "status" TYPE "ApprovalStatus" USING "status"::"ApprovalStatus";
    END IF;
END $$;
