# 🎯 Guia Completo: Configuração Backend + Frontend na Mesma URL

## 📋 Situação Atual

Você está usando a mesma URL (`https://marketing-adriel.mjfupy.easypanel.host`) para backend e frontend.

## ✅ Correções Aplicadas

1. **CORS do backend ajustado** - Agora aceita requisições de `APP_URL` e `BACKEND_URL`
2. **Nginx do frontend ajustado** - Proxy configurado para `outset:3333` (nome do serviço backend)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────┐
│  https://marketing-adriel.mjfupy.easypanel.host  │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   Frontend (Nginx)        Backend (Node.js)
   Porta 80                Porta 3333
        │                       │
        ├── / ────────────────→ │ Serve React
        │                       │
        └── /api ──────────────→ │ Proxy para /api/v1/*
                                  │
```

## 🔧 Configuração no EasyPanel

### 1. Backend (Serviço: `outset`)

**Configurações:**
- **Build Context:** `backend` (ou raiz com Dockerfile wrapper)
- **Dockerfile:** `Dockerfile`
- **Porta Interna:** `3333`
- **Domínio:** Não precisa expor publicamente

**Variáveis de Ambiente:**
```env
NODE_ENV=production
PORT=3333
BACKEND_URL=https://marketing-adriel.mjfupy.easypanel.host
APP_URL=https://marketing-adriel.mjfupy.easypanel.host
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-redis>:6379/0
JWT_SECRET=<sua-chave-forte-32+>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<outra-chave-forte-32+>
REFRESH_TOKEN_EXPIRES_IN=7d
STORAGE_DRIVER=local
```

### 2. Frontend (Criar Novo Serviço)

**Nome do Serviço:** `outset-frontend` (ou qualquer nome que preferir)

**Configurações:**
- **Build Context:** `frontend`
- **Dockerfile:** `Dockerfile`
- **Porta Interna:** `80`
- **Domínio:** `https://marketing-adriel.mjfupy.easypanel.host` ⚠️ **IMPORTANTE**

**Variáveis de Ambiente:**
```env
VITE_API_URL=https://marketing-adriel.mjfupy.easypanel.host/api/v1
```

**⚠️ IMPORTANTE - Nome do Serviço Backend:**

O `nginx.conf` do frontend está configurado para fazer proxy para `outset:3333`. 

Se o nome do seu serviço backend no EasyPanel for diferente de `outset`, você precisa:
1. Verificar o nome do serviço backend no EasyPanel
2. Atualizar o `frontend/nginx.conf` linha 12:
   ```nginx
   proxy_pass http://NOME_DO_SERVICO_BACKEND:3333;
   ```

## 🔍 Como Descobrir o Nome do Serviço Backend

No EasyPanel:
1. Vá para o serviço do backend
2. O nome do serviço aparece na URL ou no título
3. Geralmente é o que vem após `/services/...`

## 📝 Checklist de Deploy

### Backend:
- [ ] Build Context configurado (`backend` ou raiz)
- [ ] Porta interna: `3333`
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Deploy feito com sucesso
- [ ] Testar: `https://marketing-adriel.mjfupy.easypanel.host/api/v1/` (ou `/`)

### Frontend:
- [ ] Serviço criado no EasyPanel
- [ ] Build Context: `frontend`
- [ ] Porta interna: `80`
- [ ] Domínio configurado: `https://marketing-adriel.mjfupy.easypanel.host`
- [ ] Variável `VITE_API_URL` configurada
- [ ] `nginx.conf` com nome correto do serviço backend
- [ ] Deploy feito com sucesso

## 🧪 Como Testar

### 1. Testar Backend Diretamente:
```
GET https://marketing-adriel.mjfupy.easypanel.host/
```
Deve retornar:
```json
{
  "status": "ok",
  "service": "Adriel Backend API",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### 2. Testar API:
```
GET https://marketing-adriel.mjfupy.easypanel.host/api/v1/
```

### 3. Testar Frontend:
```
GET https://marketing-adriel.mjfupy.easypanel.host/
```
Deve mostrar a interface React.

### 4. Verificar Proxy:
- Abrir DevTools (F12) → Network
- Acessar o frontend
- Tentar fazer login ou qualquer ação
- Verificar se requisições para `/api/v1/*` estão funcionando (status 200)

## ⚠️ Problemas Comuns

### 1. Frontend não consegue fazer requisições para API

**Causa:** Nome do serviço backend incorreto no `nginx.conf`

**Solução:** Verificar o nome do serviço backend no EasyPanel e atualizar `frontend/nginx.conf`

### 2. Erro de CORS

**Causa:** CORS não está aceitando o domínio

**Solução:** Verificar se `APP_URL` e `BACKEND_URL` estão configurados corretamente

### 3. 404 Not Found no Frontend

**Causa:** Domínio não configurado ou rota não encontrada

**Solução:** 
- Verificar se o domínio está configurado no serviço frontend
- Verificar se o frontend está deployado

### 4. Backend não responde através do proxy

**Causa:** Serviço backend não está acessível pela rede interna do Docker

**Solução:** Verificar se ambos os serviços estão no mesmo projeto no EasyPanel

## 🚀 Próximos Passos

1. ✅ Fazer push das alterações
2. ✅ Criar serviço frontend no EasyPanel (se ainda não criou)
3. ✅ Configurar domínio no frontend
4. ✅ Fazer deploy de ambos
5. ✅ Testar acesso

---

**💡 Dica:** Se você ainda não criou o serviço frontend, crie agora no EasyPanel usando o Dockerfile do frontend!

