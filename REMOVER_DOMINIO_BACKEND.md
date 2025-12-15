# 🗑️ Remover Domínio do Backend

## ❌ NÃO coloque domínio no backend!

O domínio **NÃO deve estar no backend**. Você precisa:

### 1️⃣ Remover o Domínio do Backend

1. Na aba **"Domains"** do serviço `outset` (backend)
2. Veja o domínio: `https://mjfupy.easypanel.host/` → `http://marketing_outset:80/`
3. Clique no **ícone de lixeira** 🗑️ (último ícone à direita)
4. Confirme a remoção

**Isso vai resolver o erro!** ✅

---

### 2️⃣ O Domínio Vai no Frontend

Depois de remover do backend, você vai:

1. Criar o serviço **frontend**
2. Configurar o domínio **lá** (no frontend)
3. O frontend vai fazer proxy para o backend automaticamente

---

## 🎯 Por Que?

**Estrutura Correta:**
```
Domínio → Frontend:80 → Proxy → Backend:3333
```

**O que está errado agora:**
```
Domínio → Backend:80 ❌ (backend não tem porta 80!)
```

---

## ✅ Passo a Passo Completo

1. ❌ **Remover domínio do backend** (faça isso AGORA!)
2. ✅ Criar serviço frontend
3. ✅ Adicionar domínio no frontend
4. ✅ Deploy

**Comece removendo o domínio do backend!** 🚀

