# Configuração de Banco de Dados

## Desenvolvimento Local (SQLite)

Por padrão, o projeto usa **SQLite** para desenvolvimento local, que não requer instalação de servidor de banco de dados.

O arquivo de banco será criado automaticamente em `backend/dev.db` quando você executar as migrações.

### Configuração

No arquivo `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
```

### Comandos

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migrações
npx prisma migrate dev

# Visualizar banco (opcional)
npx prisma studio
```

## Produção (PostgreSQL)

Para deploy em produção, você precisa usar **PostgreSQL**.

### 1. Alterar o Schema do Prisma

Edite `backend/prisma/schema.prisma` e altere o datasource:

```prisma
datasource db {
  provider = "postgresql"  // Mudar de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Adicionar tipos específicos do PostgreSQL (opcional)

Se quiser usar tipos nativos do PostgreSQL, você pode adicionar de volta os `@db.Decimal`:

```prisma
dailyBudget    Decimal?       @db.Decimal(12, 2)
lifetimeBudget Decimal?       @db.Decimal(12, 2)
progress       Decimal        @default(0) @db.Decimal(5, 2)
revenue        Decimal?       @db.Decimal(14, 2)
```

### 3. Configurar DATABASE_URL

No ambiente de produção, configure a variável `DATABASE_URL`:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco"
```

### 4. Regenerar e Aplicar Migrações

```bash
# Regenerar Prisma Client
npx prisma generate

# Aplicar migrações em produção
npx prisma migrate deploy
```

## Notas

- **SQLite** é ideal para desenvolvimento local (rápido, sem configuração)
- **PostgreSQL** é necessário para produção (melhor performance, recursos avançados)
- O arquivo `dev.db` (SQLite) é ignorado pelo Git (já está no `.gitignore`)
- Migrações do Prisma são compatíveis entre SQLite e PostgreSQL (com exceção de tipos específicos)


