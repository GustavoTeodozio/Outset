# 🚀 Guia de Deploy - Adriel

Este guia explica como rodar o projeto tanto **localmente** quanto no **servidor de produção**.

## 📋 Índice

- [Desenvolvimento Local](#desenvolvimento-local)
- [Produção no Servidor](#produção-no-servidor)
- [Configurações](#configurações)
- [Troubleshooting](#troubleshooting)

---

## 💻 Desenvolvimento Local

### Opção 1: Setup Automático (Recomendado)

**Windows (PowerShell):**
```powershell
.\setup-local.ps1
```

**Linux/Mac:**
```bash
chmod +x setup-local.sh
./setup-local.sh
```

### Opção 2: Setup Manual

1. **Instale as dependências:**
```bash
npm run install:all
```

2. **Inicie PostgreSQL e Redis com Docker:**
```bash
npm run docker:dev
# ou
docker-compose -f docker-compose.dev.yml up -d
```

3. **Configure o backend:**
```bash
cd backend
cp env.example .env
# Edite .env com suas configurações
npm run prisma:generate
npm run prisma:migrate
cd ..
```

4. **Inicie o desenvolvimento:**
```bash
# Inicia backend e frontend juntos
npm run dev

# Ou separadamente:
npm run dev:backend   # Backend na porta 3333
npm run dev:frontend   # Frontend na porta 3000
```

### Acessos Locais

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3333
- **Prisma Studio:** `npm run db:studio` (abre em http://localhost:5555)

### Parar Serviços Docker

```bash
npm run docker:dev:down
# ou
docker-compose -f docker-compose.dev.yml down
```

---

## 🌐 Produção no Servidor

### Pré-requisitos

- Docker e Docker Compose instalados
- Acesso SSH ao servidor
- Domínio configurado (opcional, mas recomendado)

### Passo 1: Preparar o Servidor

1. **Clone o repositório no servidor:**
```bash
git clone <seu-repositorio> adriel
cd adriel
```

2. **Crie o arquivo de configuração:**
```bash
cp .env.production.example .env.production
nano .env.production  # ou use seu editor preferido
```

3. **Configure as variáveis de ambiente:**
```env
POSTGRES_USER=adriel_prod
POSTGRES_PASSWORD=SUA_SENHA_FORTE_AQUI
POSTGRES_DB=adriel
JWT_SECRET=SUA_CHAVE_SECRETA_FORTE_MINIMO_16_CARACTERES
REFRESH_TOKEN_SECRET=SUA_CHAVE_REFRESH_FORTE_MINIMO_16_CARACTERES
APP_URL=https://seu-dominio.com
STORAGE_DRIVER=local
```

### Passo 2: Deploy com Docker

**Opção 1: Script Automático**
```bash
chmod +x setup-server.sh
./setup-server.sh
```

**Opção 2: Manual**
```bash
# Construir imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar serviços
docker-compose -f docker-compose.prod.yml up -d

# Executar migrações
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy
```

### Passo 3: Configurar Nginx (Recomendado)

Crie um arquivo `/etc/nginx/sites-available/adriel`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site:
```bash
sudo ln -s /etc/nginx/sites-available/adriel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Passo 4: Configurar SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## ⚙️ Configurações

### Variáveis de Ambiente - Backend

Arquivo: `backend/.env`

```env
# Ambiente
NODE_ENV=development  # ou production

# Servidor
PORT=3333

# Database
DATABASE_URL=postgresql://adriel:adriel123@localhost:5432/adriel

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET=change-me-minimo-16-caracteres
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=change-me-too-minimo-16-caracteres
REFRESH_TOKEN_EXPIRES_IN=7d

# Storage
STORAGE_DRIVER=local

# Application
APP_URL=http://localhost:3000  # ou https://seu-dominio.com em produção
```

### Variáveis de Ambiente - Frontend

Arquivo: `frontend/.env` (opcional, padrões funcionam)

```env
VITE_API_URL=http://localhost:3333/api/v1
```

---

## 🔧 Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar tudo
npm run install:all

# Rodar tudo
npm run dev

# Apenas backend
npm run dev:backend

# Apenas frontend
npm run dev:frontend

# Banco de dados
npm run db:migrate      # Executar migrações
npm run db:generate     # Gerar cliente Prisma
npm run db:studio       # Abrir Prisma Studio

# Docker
npm run docker:dev      # Iniciar PostgreSQL/Redis
npm run docker:dev:down # Parar PostgreSQL/Redis
```

### Produção

```bash
# Build
npm run build

# Docker
docker-compose -f docker-compose.prod.yml up -d        # Iniciar
docker-compose -f docker-compose.prod.yml down         # Parar
docker-compose -f docker-compose.prod.yml logs -f      # Ver logs
docker-compose -f docker-compose.prod.yml restart      # Reiniciar

# Migrações
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy

# Backup do banco
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U adriel adriel > backup.sql
```

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

1. Verifique se PostgreSQL está rodando:
```bash
docker-compose -f docker-compose.dev.yml ps
```

2. Verifique a string de conexão no `.env`:
```bash
DATABASE_URL=postgresql://usuario:senha@localhost:5432/adriel
```

### Erro: "Port already in use"

Altere as portas no `docker-compose.dev.yml` ou pare o serviço que está usando a porta.

### Erro: "Prisma Client not generated"

```bash
cd backend
npm run prisma:generate
```

### Frontend não conecta ao backend

1. Verifique se o backend está rodando na porta 3333
2. Verifique o proxy no `vite.config.ts`
3. Em produção, verifique o Nginx

### Resetar banco de dados local

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
cd backend
npm run prisma:migrate
```

---

## 📊 Monitoramento

### Ver logs em produção

```bash
# Todos os serviços
docker-compose -f docker-compose.prod.yml logs -f

# Apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Verificar saúde dos serviços

```bash
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔐 Segurança em Produção

1. **Use senhas fortes** para PostgreSQL e JWT secrets
2. **Configure firewall** para permitir apenas portas necessárias
3. **Use HTTPS** com Let's Encrypt
4. **Configure backups** regulares do banco de dados
5. **Monitore logs** regularmente
6. **Mantenha dependências atualizadas**

---

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs dos containers: `docker-compose logs -f`
2. Status dos serviços: `docker-compose ps`
3. Configurações de ambiente: `.env` e `.env.production`
4. Portas em uso: `netstat -tulpn` (Linux) ou `netstat -ano` (Windows)

