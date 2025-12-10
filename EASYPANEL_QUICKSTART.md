# ⚡ Quick Start - Deploy no EasyPanel

Guia rápido para fazer deploy do Adriel no EasyPanel em **5 minutos**.

## 🎯 Passos Rápidos

### 1. Conectar Repositório (1 min)

1. Acesse EasyPanel → **New Project**
2. Selecione **From Git Repository**
3. Conecte seu repositório
4. Selecione branch `main`

### 2. Criar PostgreSQL (1 min)

- **Template:** PostgreSQL
- **Nome:** `adriel-postgres`
- **Versão:** `16-alpine`
- **Variáveis:**
  ```
  POSTGRES_USER=adriel
  POSTGRES_PASSWORD=<SENHA_FORTE>
  POSTGRES_DB=adriel
  ```
- **Volume:** Criar para `/var/lib/postgresql/data`
- **Recursos:** 1 vCPU, 2 GB RAM

### 3. Criar Redis (30 seg)

- **Template:** Redis
- **Nome:** `adriel-redis`
- **Versão:** `7-alpine`
- **Volume:** Criar para `/data`
- **Recursos:** 0.2 vCPU, 512 MB RAM

### 4. Criar Backend (1 min)

- **Template:** Dockerfile
- **Nome:** `adriel-backend`
- **Build Context:** `./backend`
- **Dockerfile:** `backend/Dockerfile`
- **Porta:** `3333`
- **Variáveis:**
  ```env
  NODE_ENV=production
  PORT=3333
  DATABASE_URL=postgresql://adriel:<SENHA_POSTGRES>@adriel-postgres:5432/adriel
  REDIS_URL=redis://adriel-redis:6379/0
  JWT_SECRET=<GERAR_32_CARACTERES>
  REFRESH_TOKEN_SECRET=<GERAR_32_CARACTERES>
  APP_URL=https://seu-dominio.com
  ```
- **Volumes:**
  - `./backend/storage:/app/storage`
  - `./backend/tmp:/app/tmp`
- **Recursos:** 1 vCPU, 1 GB RAM

### 5. Criar Frontend (1 min)

- **Template:** Dockerfile
- **Nome:** `adriel-frontend`
- **Build Context:** `./frontend`
- **Dockerfile:** `frontend/Dockerfile`
- **Porta:** `80`
- **Variáveis:**
  ```env
  VITE_API_URL=https://seu-dominio.com/api/v1
  ```
- **Recursos:** 0.2 vCPU, 256 MB RAM

### 6. Configurar Domínio (30 seg)

1. Adicione domínio no EasyPanel
2. Configure SSL (automático)
3. Aponte para frontend

### 7. Executar Migrações (30 seg)

No terminal do backend:
```bash
npm run prisma:generate
npm run prisma:deploy
npm run create:admin
```

## ✅ Pronto!

Acesse `https://seu-dominio.com` e faça login com o admin criado.

## 🔑 Gerar Chaves Secretas

Use este comando para gerar chaves seguras:

```bash
# JWT_SECRET
openssl rand -base64 32

# REFRESH_TOKEN_SECRET
openssl rand -base64 32

# POSTGRES_PASSWORD
openssl rand -base64 24
```

## 📝 Checklist

- [ ] PostgreSQL rodando
- [ ] Redis rodando
- [ ] Backend rodando
- [ ] Frontend rodando
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Migrações executadas
- [ ] Admin criado

---

**💡 Dica:** Use o arquivo `easypanel.yml` como referência para as configurações!





