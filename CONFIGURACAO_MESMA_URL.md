# 🔧 Configuração: Backend e Frontend na Mesma URL

## ✅ Configuração Atual

Você está usando a mesma URL (`https://marketing-adriel.mjfupy.easypanel.host`) para backend e frontend. Isso é possível usando um proxy reverso.

## 📋 Como Funciona

### Estrutura:

```
Usuário acessa: https://marketing-adriel.mjfupy.easypanel.host/
    ↓
Frontend (Nginx) na porta 80
    ↓
├── / → Serve arquivos estáticos do React
└── /api → Faz proxy para backend:3333
```

### Backend:
- Escuta na porta `3333` (interna)
- Rotas disponíveis:
  - `/` → Health check
  - `/api/v1/*` → Endpoints da API

### Frontend:
- Escuta na porta `80` (interna)
- Serve arquivos React em `/`
- Faz proxy de `/api` para o backend

## ⚙️ Configuração no EasyPanel

### Backend (Serviço: `outset`)

**Variáveis de Ambiente:**
```env
NODE_ENV=production
PORT=3333
BACKEND_URL=https://marketing-adriel.mjfupy.easypanel.host
APP_URL=https://marketing-adriel.mjfupy.easypanel.host
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-redis>:6379/0
JWT_SECRET=<sua-chave>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<sua-chave>
REFRESH_TOKEN_EXPIRES_IN=7d
STORAGE_DRIVER=local
```

**Configurações:**
- **Build Context:** `backend`
- **Dockerfile:** `Dockerfile`
- **Porta Interna:** `3333`
- **Domínio:** Não precisa expor externamente (será acessado via proxy do frontend)

### Frontend (Novo Serviço)

**Criar um novo serviço no EasyPanel:**

1. **Nome:** `outset-frontend` (ou `outset-ui`)

2. **Configurações de Build:**
   - **Type:** Dockerfile
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile`
   - **Porta Interna:** `80`

3. **Variáveis de Ambiente:**
   ```env
   VITE_API_URL=https://marketing-adriel.mjfupy.easypanel.host/api/v1
   ```

4. **Importante - Configurar Proxy no EasyPanel:**
   
   O EasyPanel precisa saber que:
   - `/` → Frontend (porta 80)
   - `/api` → Backend (porta 3333)
   
   **Dependendo do EasyPanel, você pode:**
   - **Opção A:** Usar o proxy reverso automático do EasyPanel (se disponível)
   - **Opção B:** Configurar um serviço Nginx separado que faz o proxy
   - **Opção C:** Deixar o frontend fazer o proxy (atual `nginx.conf`)

## 🔧 Se o EasyPanel Não Fizer Proxy Automático

### Opção 1: Usar Nginx do Frontend (Recomendado)

O `nginx.conf` do frontend já está configurado para fazer proxy de `/api` para o backend.

**Mas precisa ajustar o nome do serviço:**

No `frontend/nginx.conf`, linha 12:
```nginx
proxy_pass http://backend:3333;
```

**Isso precisa ser o nome do serviço do backend no EasyPanel!**

Se o serviço do backend se chama `outset`, mude para:
```nginx
proxy_pass http://outset:3333;
```

### Opção 2: Usar Variável de Ambiente no Nginx

Criar um `nginx.conf.template` que usa variável de ambiente:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://${BACKEND_HOST:-backend}:${BACKEND_PORT:-3333};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🎯 Estrutura Final no EasyPanel

```
marketing/
├── outset (backend)
│   ├── Porta: 3333 (interna)
│   ├── Domínio: (não exposto publicamente)
│   └── Variáveis: BACKEND_URL, APP_URL, etc.
│
└── outset-frontend (frontend)
    ├── Porta: 80 (interna)
    ├── Domínio: https://marketing-adriel.mjfupy.easypanel.host
    ├── Proxy: /api → outset:3333
    └── Variáveis: VITE_API_URL
```

## ✅ Checklist

- [ ] Backend criado com porta 3333 (interna)
- [ ] Frontend criado com porta 80 (interna)
- [ ] Frontend configurado com domínio público
- [ ] Nginx do frontend configurado para fazer proxy de `/api` para o backend
- [ ] CORS do backend aceitando requisições do mesmo domínio
- [ ] Variáveis de ambiente configuradas corretamente

## 🔍 Como Testar

1. **Backend diretamente:**
   ```
   https://marketing-adriel.mjfupy.easypanel.host/api/v1/
   ```

2. **Frontend:**
   ```
   https://marketing-adriel.mjfupy.easypanel.host/
   ```

3. **Verificar se proxy funciona:**
   - Abrir o navegador
   - F12 → Network
   - Acessar o frontend
   - Verificar se requisições para `/api/v1/*` estão funcionando

---

**💡 Dica:** O EasyPanel pode ter proxy reverso automático. Verifique na documentação ou nas configurações de domínio se há opção de "Path-based routing" ou "Proxy Rules".

