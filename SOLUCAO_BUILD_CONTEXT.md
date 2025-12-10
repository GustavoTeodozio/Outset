# ⚡ Solução Rápida - Build Context

## 🔴 Erro Atual

```
ERROR: failed to build: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

## ✅ Solução Imediata

No EasyPanel, na configuração da aplicação **Backend**:

### Alterar esta configuração:

**Antes (ERRADO):**
- Build Context: `/` (raiz)
- Dockerfile: `Dockerfile`

**Depois (CORRETO):**
- **Build Context:** `backend` ⚠️
- **Dockerfile:** `Dockerfile`

---

## 📍 Onde Configurar

1. Acesse sua aplicação no EasyPanel
2. Vá em **Settings** ou **Configurações**
3. Procure **Build Settings** ou **Build Context**
4. Altere para: **`backend`**
5. Salve e faça **Rebuild**

---

## ✨ Isso Resolverá o Problema!

O EasyPanel procurará o Dockerfile em `backend/Dockerfile` ao invés da raiz.

