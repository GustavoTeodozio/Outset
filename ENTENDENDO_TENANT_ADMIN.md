# 🏢 Entendendo Tenant e TenantId do Admin

## 📚 Conceito de Tenant (Multi-Tenant)

**Tenant = Empresa/Cliente** no sistema multi-tenant.

Cada cliente tem seu próprio **Tenant** isolado, como se fosse um "espaço separado" no sistema.

---

## 🎯 Como Funciona no Seu Sistema

### Estrutura:

```
Tenant (Empresa)
  ├─ ClientProfile (dados do negócio)
  ├─ User[] (usuários da empresa)
  ├─ Campaign[] (campanhas)
  ├─ MediaAsset[] (arquivos de mídia)
  └─ ... (outros dados)
```

### Exemplo Real:

```
Tenant: "Empresa ABC"
  ├─ User: João (CLIENT)
  ├─ User: Maria (CLIENT)
  ├─ Campaign: Campanha Verão
  └─ MediaAsset: Logo ABC

Tenant: "Empresa XYZ"
  ├─ User: Pedro (CLIENT)
  ├─ Campaign: Campanha Inverno
  └─ MediaAsset: Banner XYZ
```

**Cada empresa vê APENAS seus próprios dados!**

---

## 👤 Tenant do Admin

### Diferença Principal:

| Tipo | Tenant | Explicação |
|------|--------|------------|
| **Admin** | Tenant "Sistema" | Único tenant compartilhado por todos os admins |
| **Cliente** | Tenant próprio | Cada cliente tem seu próprio tenant |

### Admin e o Tenant "Sistema":

```
Tenant: "Sistema" (id: 444aeabf-701e-4a21-9db8-60f2eca11d6d)
  ├─ User: Gustavo Sampaio (ADMIN) ← Você
  ├─ User: Outro Admin (ADMIN)
  └─ ... (dados administrativos)
```

**Por que "Sistema"?**
- Admins precisam ver **TODOS** os tenants (todas as empresas)
- Não pertencem a uma empresa específica
- Gerenciam o sistema inteiro

### Cliente e seu Tenant Próprio:

```
Tenant: "Empresa ABC" (id: cc2fd940-dd69-43e9-89c5-85fb2c072b3c)
  ├─ ClientProfile: dados da empresa
  ├─ User: João (CLIENT) ← Usuário da empresa
  └─ ... (dados da empresa)
```

**Cada cliente tem seu próprio tenant isolado!**

---

## 🔍 No Banco de Dados

### Tabela Tenant:

```sql
Tenant
├─ id: "444aeabf-701e-4a21-9db8-60f2eca11d6d"
├─ name: "Sistema"
├─ slug: "sistema"
└─ isActive: true
```

### Tabela User:

```sql
User (Admin)
├─ id: "..."
├─ name: "Gustavo Sampaio"
├─ email: "gustavo.sampaio195@gmail.com"
├─ role: "ADMIN"
├─ tenantId: "444aeabf-701e-4a21-9db8-60f2eca11d6d" ← ID do Tenant "Sistema"
└─ isActive: true

User (Cliente)
├─ id: "..."
├─ name: "Gustavo"
├─ email: "teodoziogustavo02@gmail.com"
├─ role: "CLIENT"
├─ tenantId: "cc2fd940-dd69-43e9-89c5-85fb2c072b3c" ← ID do Tenant da empresa dele
└─ isActive: true
```

---

## 💡 Por Que o Admin Precisa de TenantId?

Mesmo sendo admin, o sistema é **multi-tenant**, então:

1. **Toda User precisa de um tenantId** (mesmo que seja NULL em alguns casos)
2. **Admin usa o tenant "Sistema"** para organização
3. **Admin pode acessar todos os tenants** (por ser ADMIN)
4. **Cliente só acessa seu próprio tenant** (por ser CLIENT)

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────┐
│  Sistema Multi-Tenant               │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Tenant: "Sistema"            │  │
│  │ ├─ Admin 1                   │  │
│  │ └─ Admin 2                   │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Tenant: "Empresa ABC"        │  │
│  │ ├─ ClientProfile             │  │
│  │ ├─ User: João (CLIENT)      │  │
│  │ ├─ Campaigns                 │  │
│  │ └─ MediaAssets               │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Tenant: "Empresa XYZ"        │  │
│  │ ├─ ClientProfile             │  │
│  │ ├─ User: Pedro (CLIENT)      │  │
│  │ └─ ...                        │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Para Criar Admin

Você precisa:

1. **Tenant "Sistema"** (pode usar o ID existente ou criar novo)
2. **User com:**
   - `role: 'ADMIN'`
   - `tenantId: <id-do-tenant-sistema>`

---

## 🔧 Script Atualizado

O script que criei verifica se o tenant existe e cria se necessário. Isso garante que o admin sempre tenha um tenant válido!

---

**💡 Em resumo:** O `tenantId` do admin aponta para o tenant "Sistema", que é compartilhado por todos os admins. É como se fosse a "empresa" dos administradores!

