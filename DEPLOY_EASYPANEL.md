# 🚀 Guia de Deploy no EasyPanel - Adriel

Este guia explica como fazer deploy do Adriel no **EasyPanel**, uma plataforma moderna de gerenciamento de aplicações Docker.

## 📋 Pré-requisitos

- Conta no [EasyPanel](https://easypanel.io)
- VPS com Docker instalado (2 vCPU, 8GB RAM, 100GB NVMe)
- Domínio configurado (opcional, mas recomendado)
- Repositório Git (GitHub, GitLab, etc.)

---

## 🎯 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que seu código está no Git:

```bash
git add .
git commit -m "Preparar para deploy no EasyPanel"
git push origin main
```

### 2. Conectar EasyPanel ao Repositório

1. Acesse o painel do EasyPanel
2. Clique em **"New Project"** ou **"Novo Projeto"**
3. Selecione **"From Git Repository"**
4. Conecte seu repositório (GitHub/GitLab)
5. Selecione o branch (geralmente `main` ou `master`)

### 3. Criar Aplicações no EasyPanel

Você precisará criar **5 aplicações**:

#### 3.1. PostgreSQL (Banco de Dados)

**Configurações:**
- **Template:** PostgreSQL
- **Nome:** `adriel-postgres`
- **Versão:** `16-alpine`
- **Porta:** `5432` (interna)
- **Variáveis de Ambiente:**
  ```
  POSTGRES_USER=adriel
  POSTGRES_PASSWORD=<GERAR_SENHA_FORTE>
  POSTGRES_DB=adriel
  ```
- **Volume:** Criar volume persistente para `/var/lib/postgresql/data`
- **Recursos:**
  - CPU: 0.5-1 vCPU
  - RAM: 1-2 GB

#### 3.2. Redis (Cache)

**Configurações:**
- **Template:** Redis
- **Nome:** `adriel-redis`
- **Versão:** `7-alpine`
- **Porta:** `6379` (interna)
- **Volume:** Criar volume persistente para `/data`
- **Recursos:**
  - CPU: 0.1-0.3 vCPU
  - RAM: 200-500 MB

#### 3.3. Backend (API)

**Configurações:**
- **Template:** Dockerfile
- **Nome:** `adriel-backend`
- **Build Context:** `./backend`
- **Dockerfile:** `backend/Dockerfile`
- **Porta:** `3333` (interna)
- **Variáveis de Ambiente:**
  ```env
  NODE_ENV=production
  PORT=3333
  DATABASE_URL=postgresql://adriel:<POSTGRES_PASSWORD>@adriel-postgres:5432/adriel
  REDIS_URL=redis://adriel-redis:6379/0
  JWT_SECRET=<GERAR_CHAVE_FORTE_MINIMO_16_CARACTERES>
  JWT_EXPIRES_IN=15m
  REFRESH_TOKEN_SECRET=<GERAR_CHAVE_FORTE_MINIMO_16_CARACTERES>
  REFRESH_TOKEN_EXPIRES_IN=7d
  APP_URL=https://seu-dominio.com
  STORAGE_DRIVER=local
  ```
- **Volumes:**
  - `./backend/storage:/app/storage` (persistente)
  - `./backend/tmp:/app/tmp` (persistente)
- **Health Check:**
  - Path: `/api/v1/health` (se existir) ou `/`
  - Interval: 30s
- **Recursos:**
  - CPU: 0.5-1 vCPU
  - RAM: 512 MB - 1 GB

**⚠️ Importante:** Após o primeiro deploy, execute as migrações:

```bash
# No terminal do EasyPanel ou via SSH
docker exec -it adriel-backend npm run prisma:deploy
```

#### 3.4. Frontend (React)

**Configurações:**
- **Template:** Dockerfile
- **Nome:** `adriel-frontend`
- **Build Context:** `./frontend`
- **Dockerfile:** `frontend/Dockerfile`
- **Porta:** `80` (interna)
- **Variáveis de Ambiente:**
  ```env
  VITE_API_URL=https://seu-dominio.com/api/v1
  ```
- **Recursos:**
  - CPU: 0.1-0.3 vCPU
  - RAM: 100-256 MB

**⚠️ Nota:** O frontend precisa saber a URL do backend. Ajuste o `nginx.conf` se necessário.

#### 3.5. Nginx (Proxy Reverso - Opcional)

Se o EasyPanel não fornecer proxy automático, crie um Nginx:

**Configurações:**
- **Template:** Nginx
- **Nome:** `adriel-nginx`
- **Porta:** `80` e `443`
- **Configuração:**
  ```nginx
  server {
      listen 80;
      server_name seu-dominio.com;
      
      # Redirecionar HTTP para HTTPS
      return 301 https://$server_name$request_uri;
  }
  
  server {
      listen 443 ssl http2;
      server_name seu-dominio.com;
      
      ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
      
      # Frontend
      location / {
          proxy_pass http://adriel-frontend:80;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
      
      # Backend API
      location /api {
          proxy_pass http://adriel-backend:3333;
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

### 4. Configurar Domínio e SSL

1. No EasyPanel, vá em **"Domains"** ou **"Domínios"**
2. Adicione seu domínio: `seu-dominio.com`
3. Configure o SSL (Let's Encrypt automático no EasyPanel)
4. Aponte o domínio para a aplicação frontend ou nginx

### 5. Executar Migrações do Banco

Após o primeiro deploy do backend:

1. Acesse o terminal do container backend no EasyPanel
2. Execute:
   ```bash
   npm run prisma:generate
   npm run prisma:deploy
   ```

Ou via SSH no servidor:
```bash
docker exec -it adriel-backend npm run prisma:deploy
```

### 6. Criar Usuário Admin

Após as migrações, crie o primeiro usuário admin:

```bash
docker exec -it adriel-backend npm run create:admin
```

Siga as instruções no terminal para criar o admin.

---

## 🔧 Configurações Avançadas

### Variáveis de Ambiente Recomendadas

**Backend:**
```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://adriel:senha@adriel-postgres:5432/adriel
REDIS_URL=redis://adriel-redis:6379/0
JWT_SECRET=gerar-chave-forte-com-32-caracteres-minimo
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=gerar-outra-chave-forte-32-caracteres
REFRESH_TOKEN_EXPIRES_IN=7d
APP_URL=https://seu-dominio.com
STORAGE_DRIVER=local
```

**Frontend:**
```env
VITE_API_URL=https://seu-dominio.com/api/v1
```

### Otimizações de Recursos

**PostgreSQL:**
- CPU: 0.5-1 vCPU
- RAM: 1-2 GB
- Volume: 20-50 GB (ajuste conforme necessário)

**Redis:**
- CPU: 0.1-0.3 vCPU
- RAM: 256-512 MB
- Volume: 1-5 GB

**Backend:**
- CPU: 0.5-1 vCPU
- RAM: 512 MB - 1 GB
- Volume: 10-30 GB (para uploads)

**Frontend:**
- CPU: 0.1-0.3 vCPU
- RAM: 100-256 MB

---

## 🔐 Segurança

1. **Use senhas fortes** para PostgreSQL e JWT secrets
2. **Configure firewall** no EasyPanel (se disponível)
3. **Use HTTPS** (SSL automático no EasyPanel)
4. **Configure backups** regulares do PostgreSQL
5. **Monitore logs** no painel do EasyPanel

---

## 📊 Monitoramento

### Ver Logs no EasyPanel

1. Acesse a aplicação no painel
2. Clique em **"Logs"** ou **"Logs"**
3. Monitore erros e performance

### Verificar Saúde dos Serviços

No painel do EasyPanel, verifique:
- Status de cada aplicação (verde = rodando)
- Uso de CPU e RAM
- Logs de erro

---

## 🐛 Troubleshooting

### Backend não conecta ao banco

1. Verifique se o PostgreSQL está rodando
2. Verifique a variável `DATABASE_URL`
3. Verifique se o nome do serviço está correto (`adriel-postgres`)

### Frontend não conecta ao backend

1. Verifique a variável `VITE_API_URL` no frontend
2. Verifique se o backend está rodando
3. Verifique as configurações de proxy no nginx

### Erro de migrações

```bash
# Regenerar Prisma Client
docker exec -it adriel-backend npm run prisma:generate

# Executar migrações
docker exec -it adriel-backend npm run prisma:deploy
```

### Resetar banco de dados

⚠️ **CUIDADO:** Isso apagará todos os dados!

```bash
# Parar aplicações
# Deletar volume do PostgreSQL
# Recriar volume
# Executar migrações novamente
```

---

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça push das mudanças para o Git
2. No EasyPanel, clique em **"Redeploy"** ou **"Rebuild"**
3. Aguarde o build e deploy completar

---

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs no EasyPanel
2. Verifique as variáveis de ambiente
3. Verifique a conectividade entre serviços
4. Consulte a documentação do EasyPanel

---

## ✅ Checklist de Deploy

- [ ] Repositório conectado ao EasyPanel
- [ ] PostgreSQL criado e configurado
- [ ] Redis criado e configurado
- [ ] Backend criado com todas as variáveis
- [ ] Frontend criado e configurado
- [ ] Domínio configurado com SSL
- [ ] Migrações executadas
- [ ] Usuário admin criado
- [ ] Testes de acesso realizados
- [ ] Backups configurados

---

**🎉 Pronto! Seu Adriel está no ar!**




