# 🚀 Guia Completo: Deploy do Frontend no EasyPanel

## 📋 Pré-requisitos

- ✅ Backend já deployado e funcionando
- ✅ Domínio backend: `https://mjfupy.easypanel.host/`
- ✅ Serviço backend: `marketing_outset` (porta 3333)

## 🎯 Passo a Passo no EasyPanel

### 1. Criar Novo Serviço Frontend

No EasyPanel:

1. **Vá para o projeto:** `marketing`
2. **Clique em "Adicionar Serviço"** ou **"New Service"**
3. **Escolha:** `Dockerfile` (ou `Custom`)

### 2. Configurar Build

**Configurações:**
- **Nome do Serviço:** `outset-frontend` (ou qualquer nome que preferir)
- **Build Context:** `frontend`
- **Dockerfile:** `Dockerfile` (deixe em branco se já está no contexto)
- **Porta Interna:** `80`

### 3. Configurar Domínio

**IMPORTANTE:** Você tem duas opções:

#### Opção A: Mesma URL (Frontend faz proxy) ⭐ **RECOMENDADO**

- **Domínio Público:** `https://mjfupy.easypanel.host/`
- **Redireciona para:** `http://outset-frontend:80/`

**Como funciona:**
- Usuário acessa: `https://mjfupy.easypanel.host/` → Frontend
- Frontend serve arquivos React
- Quando frontend faz requisição para `/api/*` → Nginx do frontend faz proxy para `marketing_outset:3333`

**Vantagem:** Tudo na mesma URL, sem problemas de CORS.

#### Opção B: URL Diferente

- **Domínio Público:** `https://app.mjfupy.easypanel.host/` (ou outro subdomínio)
- **Redireciona para:** `http://outset-frontend:80/`

**Nesse caso, precisa atualizar:**
- `VITE_API_URL` para apontar para o backend
- CORS do backend para aceitar o novo domínio

### 4. Variáveis de Ambiente

**Se usar Opção A (mesma URL):**
```env
# Não precisa de variáveis especiais, o Nginx já faz proxy
# Mas pode adicionar para outras configurações:
NODE_ENV=production
```

**Se usar Opção B (URL diferente):**
```env
VITE_API_URL=https://mjfupy.easypanel.host/api/v1
NODE_ENV=production
```

### 5. Configurações Avançadas (Opcional)

- **Recursos:** CPU/Memória (deixe padrão ou ajuste conforme necessário)
- **Health Check:** Pode deixar vazio (Nginx responde na porta 80)
- **Restart Policy:** `unless-stopped` (padrão)

### 6. Remover Domínio do Backend (Se usar Opção A)

Se você escolher a **Opção A** (mesma URL), precisa **remover o domínio do backend**:

1. Vá para o serviço `marketing_outset` (backend)
2. Vá em **Domínios**
3. **Delete** o domínio `https://mjfupy.easypanel.host/`
4. O backend ficará apenas acessível internamente (via proxy do frontend)

## 🔧 Verificar Configuração do Nginx

O `nginx.conf` do frontend já está configurado para fazer proxy:

```nginx
location /api {
    proxy_pass http://marketing_outset:3333;
    ...
}
```

**IMPORTANTE:** Certifique-se de que o nome do serviço backend está correto:
- ✅ Se o serviço backend se chama `marketing_outset` → Está correto!
- ⚠️ Se for outro nome, atualize o `nginx.conf`

## 🚀 Deploy

1. **Salve todas as configurações**
2. **Clique em "Deploy"** ou **"Build & Deploy"**
3. **Aguarde o build terminar** (pode demorar alguns minutos)
4. **Verifique os logs** para garantir que buildou corretamente

## ✅ Como Testar

### 1. Testar Frontend

Acesse no navegador:
```
https://mjfupy.easypanel.host/
```

**Deve mostrar:**
- ✅ Interface React (não mais JSON do backend)
- ✅ Tela de login ou dashboard

### 2. Testar Proxy da API

Abra o DevTools (F12) → Network:
1. Tente fazer login ou qualquer ação
2. Verifique se requisições para `/api/v1/*` estão funcionando
3. Deve retornar status 200 (não 404 ou erro de CORS)

### 3. Verificar Logs

No EasyPanel:
- **Frontend:** Logs devem mostrar requisições HTTP
- **Backend:** Logs devem mostrar requisições que vieram do proxy

## 🐛 Problemas Comuns

### Problema 1: Frontend mostra JSON do backend

**Causa:** Domínio ainda apontando para backend

**Solução:** 
- Remova domínio do backend
- Configure domínio no frontend
- Aguarde alguns segundos para DNS propagar

### Problema 2: Erro 404 nas requisições `/api/*`

**Causa:** Nome do serviço backend incorreto no `nginx.conf`

**Solução:**
- Verifique o nome exato do serviço backend no EasyPanel
- Atualize `frontend/nginx.conf` linha 12
- Faça rebuild do frontend

### Problema 3: Erro de CORS

**Causa:** Frontend e backend em URLs diferentes e CORS não configurado

**Solução:**
- Verifique `APP_URL` e `BACKEND_URL` no backend
- Adicione a URL do frontend no CORS
- Ou use a Opção A (mesma URL)

### Problema 4: Build falha

**Causa:** Dependências ou TypeScript errors

**Solução:**
- Verifique logs de build
- Teste build localmente: `cd frontend && npm run build`
- Corrija erros antes de fazer deploy

## 📊 Checklist Final

### Configuração:
- [ ] Serviço frontend criado
- [ ] Build Context: `frontend`
- [ ] Porta interna: `80`
- [ ] Domínio configurado
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Domínio do backend removido (se usando mesma URL)

### Testes:
- [ ] Frontend carregando no navegador
- [ ] Interface React aparecendo
- [ ] Requisições para `/api/*` funcionando
- [ ] Login/autenticação funcionando
- [ ] Sem erros no console (F12)

## 🎉 Pronto!

Após seguir esses passos, seu frontend estará funcionando!

---

**💡 Dica:** Se tiver dúvidas sobre qual opção escolher, recomendo a **Opção A** (mesma URL com proxy), pois é mais simples e evita problemas de CORS.

