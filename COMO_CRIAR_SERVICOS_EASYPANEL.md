# 🎯 Como Criar os Serviços no EasyPanel

## 📍 Passo a Passo Visual

### 1️⃣ Criar Backend

1. **Clique em "+ Service"** (botão verde no topo)
2. **Clique em "App"** (primeiro botão da primeira linha)
3. Preencha:

   **Nome:**
   ```
   outset
   ```

   **Build:**
   - **Build Context:** `backend`
   - **Dockerfile:** `Dockerfile`
   
   **Port:**
   ```
   3333
   ```

   **Variables (aba "Variables"):**
   - Cole tudo do arquivo `VARIAVEIS_BACKEND_COPIAR.txt`

   **Domains:**
   - ❌ **Não adicione nada aqui!**

4. **Clique em "Deploy"** (botão verde)
5. Aguarde terminar

---

### 2️⃣ Criar Frontend

1. **Clique em "+ Service"** novamente
2. **Clique em "App"** novamente
3. Preencha:

   **Nome:**
   ```
   outset-frontend
   ```

   **Build:**
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile`
   
   **Port:**
   ```
   80
   ```

   **Variables (aba "Variables"):**
   - Cole do arquivo `VARIAVEIS_FRONTEND_COPIAR.txt`

   **Domains (aba "Domains"):**
   - Clique em "Add Domain"
   - Domain: `mjfupy.easypanel.host`
   - Redirect to: `outset-frontend:80`

4. **Clique em "Deploy"** (botão verde)
5. Aguarde terminar

---

## 🎯 Resumo

**"App" = Aplicação Docker (o que você precisa)**

Você precisa criar **2 Apps**:
- ✅ **App 1:** Backend (nome: `outset`)
- ✅ **App 2:** Frontend (nome: `outset-frontend`)

**Ignore os outros:**
- ❌ MySQL, MariaDB, Postgres → Você já tem Postgres
- ❌ Redis → Você já tem Redis
- ❌ Compose → Não precisa

---

## ✅ Depois de Criar

Você terá 3 serviços:
1. `outset` (backend) ← Você criou
2. `outset-frontend` (frontend) ← Você criou  
3. `postgres` (banco) ← Já existe

Tudo funcionando! 🎉

