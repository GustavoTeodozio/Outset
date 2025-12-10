# 🔧 Configurar Build Context no EasyPanel

## ❌ Problema Encontrado

O EasyPanel está tentando encontrar o Dockerfile na raiz do repositório:
```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

Mas o Dockerfile está em `backend/Dockerfile` e `frontend/Dockerfile`.

---

## ✅ Solução: Configurar Build Context

No EasyPanel, você precisa configurar o **Build Context** (ou Root Directory) corretamente para cada serviço.

### Para o Backend

Na configuração da aplicação **Backend** no EasyPanel:

#### Opção 1: Via Interface do EasyPanel

1. Acesse a aplicação do Backend no EasyPanel
2. Vá em **Settings** ou **Configurações**
3. Procure por **Build Settings** ou **Configurações de Build**
4. Configure:
   - **Build Context** (ou **Root Directory**): `backend`
   - **Dockerfile Path**: `Dockerfile` ou `./Dockerfile`

#### Opção 2: Via Arquivo easypanel.yml (se suportado)

Se o EasyPanel suporta arquivos de configuração, você pode criar:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
```

---

## 📋 Configuração Completa no EasyPanel

### Backend (API Node.js)

**Configurações de Build:**
- **Type:** Dockerfile
- **Build Context:** `backend`
- **Dockerfile Path:** `Dockerfile`
- **Port:** `3333`

**Variáveis de Ambiente:**
```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-servico-redis>:6379/0
JWT_SECRET=<sua-chave-jwt>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<sua-chave-refresh>
REFRESH_TOKEN_EXPIRES_IN=7d
APP_URL=https://seu-dominio.com
STORAGE_DRIVER=local
```

### Frontend (React + Nginx)

**Configurações de Build:**
- **Type:** Dockerfile
- **Build Context:** `frontend`
- **Dockerfile Path:** `Dockerfile`
- **Port:** `80`

**Variáveis de Ambiente:**
```env
VITE_API_URL=https://seu-dominio.com/api/v1
```

---

## 🎯 Passo a Passo no EasyPanel

### 1. Criar/Editar Aplicação Backend

1. No painel do EasyPanel, vá para o projeto
2. Clique em **New App** ou **Nova Aplicação**
3. Escolha **Dockerfile** como tipo
4. Configure:
   - **Name:** `outset-backend` (ou como preferir)
   - **Build Context:** `backend` ⚠️ **IMPORTANTE**
   - **Dockerfile:** `Dockerfile` (relativo ao contexto)
   - **Port:** `3333`

### 2. Verificar Configuração

Certifique-se de que o EasyPanel está configurado assim:

```
Build Context: backend
Dockerfile: Dockerfile (ou ./Dockerfile)
```

Isso fará com que o EasyPanel execute:
```bash
docker build -f backend/Dockerfile backend/
```

### 3. Testar Build

Após configurar, faça um **Rebuild** ou **Redeploy**:
- O EasyPanel deve conseguir encontrar o Dockerfile
- O build deve iniciar corretamente

---

## 🔍 Como Verificar se Está Configurado Corretamente

### Logs Esperados (Sucesso)

```
#0 building with "default" instance using docker driver
#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: XXX done
#1 DONE 0.1s
#2 [internal] load .dockerignore
#2 DONE 0.1s
#3 [builder 1/8] FROM node:20-alpine
...
```

### Se Ainda Der Erro

Se ainda aparecer "no such file or directory", verifique:

1. ✅ O **Build Context** está configurado como `backend`?
2. ✅ O Dockerfile existe em `backend/Dockerfile`?
3. ✅ O repositório foi clonado corretamente?
4. ✅ O branch/commit está correto?

---

## 💡 Dica: Nomes de Diretórios no EasyPanel

Dependendo da interface do EasyPanel, o campo pode se chamar:
- **Build Context**
- **Root Directory**
- **Working Directory**
- **Context Path**

Todos significam a mesma coisa: a pasta onde o Dockerfile está localizado.

---

## 🚀 Após Configurar

Depois de configurar corretamente:

1. ✅ Salve as configurações
2. ✅ Faça um **Rebuild** ou **Redeploy**
3. ✅ Verifique os logs do build
4. ✅ Aguarde o build completar
5. ✅ As migrações executarão automaticamente (graças ao script de inicialização)

---

## 📝 Resumo Rápido

**Para Backend:**
- Build Context: `backend`
- Dockerfile: `Dockerfile`

**Para Frontend:**
- Build Context: `frontend`
- Dockerfile: `Dockerfile`

**Comando equivalente:**
```bash
# Backend
docker build -f backend/Dockerfile backend/

# Frontend
docker build -f frontend/Dockerfile frontend/
```

---

**✅ Configure o Build Context como `backend` e o erro será resolvido!**

