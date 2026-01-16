# Correção de Tipos ENUM no PostgreSQL

## Problema

O banco de dados PostgreSQL está retornando o erro:
```
type "public.TaskStatus" does not exist
```

Isso acontece porque as migrações criaram as colunas como `TEXT` ao invés de usar os tipos `ENUM` do PostgreSQL que o Prisma espera.

## Solução

Execute o script SQL para criar os tipos ENUM e alterar as colunas:

### Opção 1: Via EasyPanel (Recomendado)

1. Acesse o serviço do PostgreSQL no EasyPanel
2. Abra o terminal/console SQL do banco
3. Execute o conteúdo do arquivo `scripts/fix-enum-types.sql`

### Opção 2: Via linha de comando

Se você tem acesso SSH à VPS:

```bash
# Conecte-se ao container do PostgreSQL
docker exec -i marketing_postgres psql -U postgres -d marketing < backend/scripts/fix-enum-types.sql
```

### Opção 3: Via Prisma Migrate (se tiver acesso local)

```bash
cd backend
npx prisma migrate deploy
```

A migração `fix_add_enum_types` será aplicada automaticamente.

## Verificação

Após executar o script, teste criar uma task novamente. O erro `type "public.TaskStatus" does not exist` deve desaparecer.

## Arquivos criados

- `backend/prisma/migrations/fix_add_enum_types/migration.sql` - Migração do Prisma
- `backend/scripts/fix-enum-types.sql` - Script SQL direto para execução manual
