# 🔧 Setup Inicial - Adriel

Este guia é apenas para a **primeira vez** que você configura o projeto. Depois disso, você só precisa rodar `npm run dev`.

## 📋 Pré-requisitos

- Node.js 20+ instalado
- Docker e Docker Compose instalados
- Git instalado

## 🚀 Passo a Passo

### 1. Instalar Dependências

```bash
npm run install:all
```

Isso instala as dependências do projeto raiz, backend e frontend.

### 2. Iniciar Banco de Dados

```bash
npm run docker:dev
```

Isso inicia PostgreSQL e Redis em containers Docker.

### 3. Configurar Backend

```bash
cd backend
cp env.example .env
```

Edite o arquivo `backend/.env` com suas configurações:

```env
DATABASE_URL="postgresql://adriel:adriel123@localhost:5432/adriel"
REDIS_URL="redis://localhost:6379/0"
JWT_SECRET="sua-chave-secreta-minimo-16-caracteres"
REFRESH_TOKEN_SECRET="sua-chave-refresh-minimo-16-caracteres"
```

### 4. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate
```

### 5. Voltar para o diretório raiz

```bash
cd ..
```

## ✅ Pronto!

Agora você pode rodar o projeto normalmente:

```bash
npm run dev
```

## 🔄 Próximas Vezes

Depois do setup inicial, você só precisa:

1. **Iniciar banco de dados** (se não estiver rodando):
   ```bash
   npm run docker:dev
   ```

2. **Rodar o projeto**:
   ```bash
   npm run dev
   ```

## 🛠️ Scripts Úteis

```bash
npm run dev              # Inicia backend + frontend
npm run dev:backend       # Apenas backend
npm run dev:frontend      # Apenas frontend
npm run docker:dev           # Inicia PostgreSQL/Redis
npm run docker:dev:down   # Para PostgreSQL/Redis
npm run db:migrate        # Executa migrações
npm run db:generate       # Gera Prisma Client
npm run db:studio         # Abre Prisma Studio
```

## ❓ Problemas?

**Erro: "Cannot connect to database"**
- Verifique se PostgreSQL está rodando: `npm run docker:dev`

**Erro: "Port already in use"**
- Pare o serviço que está usando a porta ou altere no `docker-compose.dev.yml`

**Erro: "Prisma Client not generated"**
- Execute: `npm run db:generate`


