# ⚡ Início Rápido - Adriel

## 🎯 Desenvolvimento Local

### Opção 1: Com Docker (Recomendado)

**Primeira vez:**
```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar .env (opcional - será criado automaticamente)
cd backend
cp env.example .env
cd ..
```

**Desenvolvimento:**
```bash
npm run dev
```

### Opção 2: Sem Docker (PostgreSQL/Redis locais)

**Primeira vez:**
```bash
# 1. Instalar dependências
npm run install:all

# 2. Certifique-se de que PostgreSQL e Redis estão rodando localmente

# 3. Configurar .env para uso local
cd backend
cp env.local.example .env
# Edite .env com suas credenciais locais
cd ..
```

**Desenvolvimento:**
```bash
npm run dev
```

O script `npm run dev` automaticamente:
- ✅ Detecta se Docker está disponível (usa se disponível)
- ✅ Se não tiver Docker, usa PostgreSQL/Redis locais
- ✅ Gera Prisma Client se necessário
- ✅ Cria .env se não existir
- ✅ Inicia Backend na porta 3333
- ✅ Inicia Frontend na porta 3000

### Verificar setup

```bash
# Verifica se tudo está configurado corretamente
npm run check
```

### Acessos

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3333
- **Prisma Studio:** `npm run db:studio`

> 💡 **Dica:** Se PostgreSQL/Redis não estiverem rodando, execute `npm run docker:dev` antes de `npm run dev`

---

## 🌐 Deploy no Servidor (10 minutos)

### 1. Prepare o servidor

```bash
# Clone o repositório
git clone <seu-repo> adriel
cd adriel

# Configure variáveis
cp .env.production.example .env.production
nano .env.production  # Edite com suas configurações
```

### 2. Deploy

```bash
# Opção 1: Script automático
chmod +x setup-server.sh
./setup-server.sh

# Opção 2: Manual
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy
```

### 3. Configure Nginx (Opcional)

Veja exemplos em [DEPLOY.md](./DEPLOY.md)

---

## 📋 Comandos Essenciais

### Desenvolvimento

```bash
npm run dev              # Backend + Frontend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend
npm run docker:dev       # Iniciar PostgreSQL/Redis
```

### Produção

```bash
docker-compose -f docker-compose.prod.yml up -d    # Iniciar
docker-compose -f docker-compose.prod.yml logs -f  # Ver logs
docker-compose -f docker-compose.prod.yml down     # Parar
```

### Banco de Dados

```bash
npm run db:migrate   # Executar migrações
npm run db:generate  # Gerar Prisma Client
npm run db:studio    # Abrir Prisma Studio
```

---

## ❓ Problemas Comuns

**Erro de conexão com banco:**
```bash
npm run docker:dev  # Reinicie PostgreSQL/Redis
```

**Porta em uso:**
- Altere as portas no `docker-compose.dev.yml`

**Prisma não gerado:**
```bash
npm run db:generate
```

---

## 📚 Documentação Completa

- [README.md](./README.md) - Documentação completa
- [SETUP.md](./SETUP.md) - Setup inicial (primeira vez)
- [DEPLOY.md](./DEPLOY.md) - Guia detalhado de deploy

