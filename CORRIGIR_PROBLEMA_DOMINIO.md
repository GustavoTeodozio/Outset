# 🔧 Corrigir Erro "Service is not reachable"

## ❌ Problema Identificado

Você está vendo o erro porque:

1. ✅ Backend está configurado corretamente
2. ❌ **Domínio está no lugar ERRADO** (está no backend, deveria estar no frontend)
3. ❌ **Porta errada** (está apontando para porta 80, backend roda na 3333)
4. ❌ **Frontend ainda não foi criado**

## ✅ Solução em 3 Passos

### 1️⃣ REMOVER Domínio do Backend (AGORA!)

1. No serviço `outset` (backend)
2. Vá na aba **"Domains"** (já está aberta na imagem)
3. Clique no **ícone de lixeira** 🗑️ ao lado de `https://mjfupy.easypanel.host/`
4. **Confirme a remoção**

Isso vai fazer o erro parar! ✅

---

### 2️⃣ Criar Serviço Frontend

1. Clique em **"+ Service"** (canto superior direito)
2. Clique em **"App"**
3. Configure:

   **Nome:** `outset-frontend`
   
   **Build:**
   - Build Context: `frontend`
   - Dockerfile: `Dockerfile`
   
   **Port:** `80`
   
   **Variables:**
   ```
   NODE_ENV=production
   ```
   
   **Domains:**
   - Clique em "Add Domain"
   - Domain: `mjfupy.easypanel.host`
   - Redirect to: `outset-frontend:80`

4. Clique em **"Deploy"**

---

### 3️⃣ Aguardar Deploy

- Aguarde o build do frontend terminar (alguns minutos)
- Depois acesse: `https://mjfupy.easypanel.host/`

---

## 🎯 Por Que Isso Resolve?

**Agora (ERRADO):**
```
Domínio → Backend:80 ❌ (backend não roda na porta 80!)
```

**Depois (CORRETO):**
```
Domínio → Frontend:80 ✅ (Nginx recebe)
         ↓
         Frontend faz proxy:
         - /api → Backend:3333 ✅
         - /static → Backend:3333 ✅
```

---

## ✅ Checklist

- [ ] ❌ Domínio removido do backend (`outset`)
- [ ] ✅ Serviço frontend (`outset-frontend`) criado
- [ ] ✅ Domínio configurado no frontend
- [ ] ✅ Frontend deployado
- [ ] ✅ Testado: `https://mjfupy.easypanel.host/`

---

**🚀 Comece removendo o domínio do backend AGORA!**

