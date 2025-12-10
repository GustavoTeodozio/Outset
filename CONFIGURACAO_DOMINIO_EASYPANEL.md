# 🔧 Configuração de Domínio no EasyPanel

## ✅ Configuração Atual

Seu domínio está configurado assim no EasyPanel:
- **Domínio Público:** `https://marketing-mjfupy.easypanel.host/`
- **Redireciona para:** `http://marketing_outset:3333/`

## 📋 Informações Importantes

### Nome do Serviço Backend
O nome do serviço backend no EasyPanel é: **`marketing_outset`**

### Correção Aplicada
O `nginx.conf` do frontend foi atualizado para usar o nome correto:
```nginx
proxy_pass http://marketing_outset:3333;
```

## 🏗️ Configuração Completa

### Backend (Serviço: `marketing_outset`)

**Variáveis de Ambiente:**
```env
NODE_ENV=production
PORT=3333
BACKEND_URL=https://marketing-mjfupy.easypanel.host
APP_URL=https://marketing-mjfupy.easypanel.host
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-redis>:6379/0
JWT_SECRET=<sua-chave>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<sua-chave>
REFRESH_TOKEN_EXPIRES_IN=7d
STORAGE_DRIVER=local
```

### Frontend (Criar Novo Serviço)

**Nome:** `marketing-outset-frontend` (ou qualquer nome)

**Configurações:**
- Build Context: `frontend`
- Dockerfile: `Dockerfile`
- Porta Interna: `80`

**Variáveis de Ambiente:**
```env
VITE_API_URL=https://marketing-mjfupy.easypanel.host/api/v1
```

**Domínio no EasyPanel:**
- **Domínio Público:** `https://marketing-mjfupy.easypanel.host/`
- **Redireciona para:** `http://marketing-outset-frontend:80/`

## ⚠️ Duas Opções de Configuração

### Opção 1: Proxy Automático do EasyPanel (Atual)

O EasyPanel está fazendo proxy automático:
- `https://marketing-mjfupy.easypanel.host/` → `http://marketing_outset:3333/`

**Problema:** Isso faz tudo ir para o backend, não para o frontend.

**Solução:** Você precisa configurar **dois domínios** ou usar path-based routing:

1. **Backend:**
   - Domínio: `https://marketing-mjfupy.easypanel.host/api` → `http://marketing_outset:3333`

2. **Frontend:**
   - Domínio: `https://marketing-mjfupy.easypanel.host/` → `http://marketing-outset-frontend:80`

### Opção 2: Frontend Faz Proxy (Recomendado)

Deixar o frontend fazer o proxy através do Nginx:

1. **Backend:**
   - Domínio: **NÃO configurar domínio público** (apenas interno)
   - Porta: `3333` (interna)

2. **Frontend:**
   - Domínio: `https://marketing-mjfupy.easypanel.host/` → `http://marketing-outset-frontend:80`
   - O Nginx do frontend já está configurado para fazer proxy de `/api` para `marketing_outset:3333`

## 🎯 Recomendação

**Use a Opção 2** (Frontend faz proxy):

1. **Remova o domínio do backend** no EasyPanel (deixe apenas interno)
2. **Configure o domínio no frontend:**
   - Domínio: `https://marketing-mjfupy.easypanel.host/`
   - Redireciona para: `http://marketing-outset-frontend:80/`
3. **O Nginx do frontend fará o proxy** de `/api` para o backend automaticamente

## ✅ Checklist

- [ ] Nome do serviço backend correto no nginx.conf: `marketing_outset`
- [ ] Backend sem domínio público (apenas interno)
- [ ] Frontend com domínio público: `https://marketing-mjfupy.easypanel.host/`
- [ ] Variáveis de ambiente atualizadas com URL correta
- [ ] Push e deploy feitos

---

**💡 Dica:** Com essa configuração, quando você acessar `https://marketing-mjfupy.easypanel.host/`, o frontend será servido, e requisições para `/api/*` serão automaticamente proxy para o backend!

