# 📝 Configuração do .env do Backend

## ✅ Configuração Correta

Com o frontend fazendo proxy, o `.env` do backend deve ser:

```env
NODE_ENV=production
PORT=3333

# URLs - Use a URL do frontend (ele faz proxy)
APP_URL=https://mjfupy.easypanel.host
BACKEND_URL=https://mjfupy.easypanel.host

DATABASE_URL=postgres://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
REDIS_URL=redis://<nome-do-servico-redis>:6379/0

JWT_SECRET=<chave forte 32+ caracteres>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<outra chave forte 32+ caracteres>
REFRESH_TOKEN_EXPIRES_IN=7d

STORAGE_DRIVER=local
```

## 🔍 Explicação

### Por que usar a URL do frontend?

O frontend faz proxy de:
- `/api/*` → Backend
- `/static/*` → Backend (arquivos de mídia)

Então todas as URLs públicas (incluindo arquivos de mídia) estarão acessíveis através da URL do frontend: `https://mjfupy.easypanel.host`

### BACKEND_URL vs APP_URL

O código do backend usa:
```typescript
const backendUrl = process.env.BACKEND_URL || process.env.APP_URL || 'http://localhost:3333';
```

**Recomendação:** Defina ambos como a URL do frontend, para garantir que URLs de arquivos sejam geradas corretamente.

## 🔄 Mudanças Aplicadas

1. ✅ `APP_URL` atualizado de `https://marketing-mjfupy.easypanel.host` para `https://mjfupy.easypanel.host`
2. ✅ `BACKEND_URL` atualizado de `https://marketing-mjfupy.easypanel.host` para `https://mjfupy.easypanel.host`
3. ✅ `nginx.conf` do frontend atualizado para fazer proxy de `/static` também

## 📋 Próximos Passos

1. Atualize o `.env` no serviço `outset` (backend) no EasyPanel
2. Faça commit do `nginx.conf` atualizado do frontend
3. Faça deploy do frontend
4. Teste upload de arquivos e verifique se as URLs funcionam

