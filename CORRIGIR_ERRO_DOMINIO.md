# 🔧 Corrigir Erro "Service is not reachable"

## ❌ Problema Atual

O domínio `https://mjfupy.easypanel.host/` está configurado no **backend** apontando para a porta **80**, mas:
- O backend roda na porta **3333**
- O domínio deve estar no **frontend**, não no backend

## ✅ Solução Passo a Passo

### 1️⃣ Remover Domínio do Backend (AGORA)

1. No serviço `outset` (backend), vá em **"Domínios"**
2. Clique no **ícone de lixeira** ao lado de `https://mjfupy.easypanel.host/`
3. **Confirme a remoção**

Isso vai fazer o erro parar de aparecer.

### 2️⃣ Criar Serviço Frontend

1. Clique em **"+ Service"** (canto superior direito)
2. Escolha **"Dockerfile"**
3. Configure:
   - **Nome:** `outset-frontend` (ou `frontend`)
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile`
   - **Porta Interna:** `80`

### 3️⃣ Configurar Domínio no Frontend

1. No serviço `outset-frontend`, vá em **"Domínios"**
2. Clique em **"Add Domain"**
3. Configure:
   - **Domínio Público:** `https://mjfupy.easypanel.host/`
   - **Redireciona para:** `http://outset-frontend:80/` (ou o nome que você deu)

### 4️⃣ Fazer Deploy

1. Clique em **"Deploy"** (botão verde)
2. Aguarde o build completar

## 📋 Estrutura Correta

```
┌─────────────────────────────────────┐
│  https://mjfupy.easypanel.host/    │ ← Domínio no FRONTEND
└──────────────┬──────────────────────┘
               │
               ↓
      ┌─────────────────┐
      │  Frontend       │
      │  (Nginx:80)     │ ← Porta 80
      └────────┬────────┘
               │
               ├─→ / → React App
               │
               └─→ /api → Proxy para Backend
                          ↓
                  ┌─────────────────┐
                  │  Backend        │
                  │  (Node:3333)    │ ← Porta 3333
                  │  marketing_outset│
                  └─────────────────┘
```

## ⚠️ Importante

- **Backend:** Porta 3333, SEM domínio público
- **Frontend:** Porta 80, COM domínio `https://mjfupy.easypanel.host/`

## ✅ Resultado Esperado

Após configurar:
- ✅ `https://mjfupy.easypanel.host/` → Interface React (frontend)
- ✅ `/api/*` → Backend via proxy automático
- ✅ Sem erro "Service is not reachable"

