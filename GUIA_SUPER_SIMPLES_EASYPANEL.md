# 🎯 Guia Super Simples - EasyPanel (SEM Docker)

## 📌 Você Só Precisa Fazer 2 Coisas

### ✅ 1️⃣ Configurar Backend

1. **No EasyPanel**, clique em **"+ Service"**
2. Escolha **"Dockerfile"**
3. **Preencha EXATAMENTE assim:**

#### Aba "Basic"
```
Name: outset
Port: 3333
```

#### Aba "Build"
```
Build Context: backend
Dockerfile: Dockerfile
```

#### Aba "Variables" 
**Cole tudo isso aqui:**
```
NODE_ENV=production
PORT=3333
APP_URL=https://mjfupy.easypanel.host
BACKEND_URL=https://mjfupy.easypanel.host
DATABASE_URL=postgres://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
REDIS_URL=redis://marketing_redis:6379/0
JWT_SECRET=sua_chave_secreta_minimo_32_caracteres_aqui_12345678901234567890
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=outra_chave_secreta_minimo_32_caracteres_98765432109876543210
REFRESH_TOKEN_EXPIRES_IN=7d
STORAGE_DRIVER=local
```

#### Aba "Domains"
**❌ NÃO CLIQUE EM NADA AQUI! Deixe vazio!**

4. Clique em **"Deploy"** (botão verde)
5. Aguarde terminar (vai demorar alguns minutos)

---

### ✅ 2️⃣ Configurar Frontend

1. **No EasyPanel**, clique em **"+ Service"** novamente
2. Escolha **"Dockerfile"** novamente
3. **Preencha EXATAMENTE assim:**

#### Aba "Basic"
```
Name: outset-frontend
Port: 80
```

#### Aba "Build"
```
Build Context: frontend
Dockerfile: Dockerfile
```

#### Aba "Variables"
**Cole isso:**
```
NODE_ENV=production
```

#### Aba "Domains"
1. Clique em **"Add Domain"**
2. Preencha:
   - **Domain:** `mjfupy.easypanel.host` (sem https://)
   - **Redirect to:** `outset-frontend:80` (ou o nome que você deu)

4. Clique em **"Deploy"** (botão verde)
5. Aguarde terminar

---

## ✅ Pronto!

Depois disso, acesse: **https://mjfupy.easypanel.host/**

---

## ❓ Dúvidas Frequentes

### "Onde colo essas coisas?"
- **Build Context** e **Dockerfile**: São campos de texto na aba "Build"
- **Variables**: É um campo grande de texto na aba "Variables" - cole tudo de uma vez
- **Domains**: É um botão "Add Domain" na aba "Domains"

### "O que é Build Context?"
É só o nome da pasta: `backend` ou `frontend`. Só isso!

### "E se der erro?"
1. Veja os logs do serviço
2. Verifique se colou tudo certo
3. Veja se o nome do serviço backend é `outset` (se for diferente, me avise)

### "Preciso mudar algo no código?"
**NÃO!** Tudo já está pronto. Só configure no EasyPanel e pronto!

---

## 🎯 Resumo em 3 Passos

1. ✅ Criar serviço backend → Build Context: `backend` → Porta: `3333` → Colar variáveis → Deploy
2. ✅ Criar serviço frontend → Build Context: `frontend` → Porta: `80` → Adicionar domínio → Deploy  
3. ✅ Acessar `https://mjfupy.easypanel.host/`

**É só isso!** 🎉

