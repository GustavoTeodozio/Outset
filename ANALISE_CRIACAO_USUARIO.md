# 📊 Análise: Processo de Criação de Usuário

## 🔍 Visão Geral

O sistema tem **2 formas principais** de criar usuários:

1. **Admin** - Criado via script (`create-admin.ts`)
2. **Cliente** - Criado via API (`POST /api/v1/auth/register`)

---

## 1️⃣ Criação de Administrador (Script)

### 📍 Localização
- **Arquivo:** `backend/scripts/create-admin.ts`
- **Comando:** `npm run create:admin`

### 🔄 Processo

```typescript
1. Verifica se usuário já existe (por email)
   ↓
2. Se existe → Atualiza senha
   ↓
3. Se não existe:
   a. Cria Tenant "Sistema" (se não existir)
   b. Cria User com role 'ADMIN'
   c. Vincula ao Tenant "Sistema"
```

### 📋 Dados Necessários

```typescript
{
  name: 'Gustavo Sampaio',
  email: 'gustavo.sampai195@gmail.com',
  password: 'ronaldo12',  // Será hashado com bcrypt (12 rounds)
  role: 'ADMIN',
  tenantId: defaultTenant.id,
  isActive: true
}
```

### 🔐 Segurança

- **Hash da senha:** `bcrypt.hash(password, 12)` - 12 rounds de salt
- **Validação:** Verifica se email já existe antes de criar

---

## 2️⃣ Criação de Cliente (API)

### 📍 Endpoint
- **Rota:** `POST /api/v1/auth/register`
- **Controller:** `backend/src/infra/http/controllers/auth.controller.ts`
- **Service:** `backend/src/application/modules/auth/auth.service.ts`

### 🔄 Processo Completo

```typescript
1. Validação de entrada (Zod Schema)
   ↓
2. Verifica se tenant já existe (por slug)
   ↓
3. Hash da senha
   ↓
4. TRANSACTION (tudo ou nada):
   a. Cria Tenant
   b. Cria ClientProfile
   c. Cria User com role 'CLIENT'
   ↓
5. Cria Session
   ↓
6. Gera Tokens (Access + Refresh)
   ↓
7. Retorna dados do usuário + tokens
```

### 📋 Schema de Validação

```typescript
{
  tenantName: string (min 3)      // Nome da empresa/cliente
  businessName: string (min 3)    // Nome do negócio
  segment?: string                // Segmento (opcional)
  contactName: string (min 3)    // Nome do contato
  contactEmail: string (email)    // Email do usuário
  contactPhone?: string           // Telefone (opcional)
  password: string (min 6)        // Senha
  logoUrl?: string               // Logo (opcional, via upload)
}
```

### 🔄 Fluxo Detalhado

#### Passo 1: Validação
```typescript
// auth.controller.ts
const body = registerSchema.parse(req.body);
```

#### Passo 2: Upload de Logo (se houver)
```typescript
if (req.file) {
  const stored = await storageProvider.save(req.file);
  logoUrl = stored.fileUrl;
}
```

#### Passo 3: Criação em Transaction
```typescript
// auth.service.ts - registerClient()
const result = await prisma.$transaction(async (tx) => {
  // 1. Criar Tenant
  const tenant = await tx.tenant.create({
    data: {
      name: input.tenantName,
      slug: tenantSlug, // gerado automaticamente
    },
  });

  // 2. Criar ClientProfile
  await tx.clientProfile.create({
    data: {
      tenantId: tenant.id,
      businessName: input.businessName,
      segment: input.segment,
      mainContact: input.contactName,
      mainEmail: input.contactEmail,
      mainPhone: input.contactPhone,
      logoUrl: input.logoUrl,
    },
  });

  // 3. Criar User
  const user = await tx.user.create({
    data: {
      name: input.contactName,
      email: input.contactEmail,
      password: passwordHash, // hashado com hashPassword()
      role: 'CLIENT',
      tenantId: tenant.id,
    },
  });

  return { tenant, user };
});
```

#### Passo 4: Criar Sessão
```typescript
const session = await this.createSession(result.user.id, result.tenant.id);
```

#### Passo 5: Gerar Tokens
```typescript
const accessToken = signAccessToken(payload);
const refreshToken = signRefreshToken(payload);
```

#### Passo 6: Retornar Resposta
```typescript
return {
  tenant: result.tenant,
  user: {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
  },
  tokens: {
    accessToken,
    refreshToken,
  },
};
```

---

## 📊 Estrutura do Banco de Dados

### Model User

```prisma
model User {
  id          String    @id @default(uuid())
  name        String
  email       String    @unique
  password    String    // Hashado com bcrypt
  role        UserRole  // ADMIN | CLIENT | DESIGNER
  tenantId    String?
  tenant      Tenant?   @relation(...)
  isActive    Boolean   @default(true)
  lastLoginAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Model Tenant

```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique  // Gerado automaticamente
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Model ClientProfile

```prisma
model ClientProfile {
  id                  String   @id @default(uuid())
  tenantId            String   @unique
  businessName        String
  segment            String?
  mainContact        String
  mainEmail          String
  mainPhone          String?
  logoUrl            String?
  onboardingCompleted Boolean @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

---

## 🔐 Segurança

### Hash de Senha

**Função:** `hashPassword()` em `backend/src/shared/utils/password.ts`

```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // 12 rounds
}
```

**Uso:**
- Admin: `bcrypt.hash(password, 12)` diretamente
- Cliente: `hashPassword(input.password)` via service

### Validação de Senha

**Função:** `comparePassword()` em `backend/src/shared/utils/password.ts`

```typescript
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## 🎯 Diferenças Principais

| Aspecto | Admin | Cliente |
|---------|-------|---------|
| **Método** | Script CLI | API REST |
| **Role** | `ADMIN` | `CLIENT` |
| **Tenant** | "Sistema" (fixo) | Criado dinamicamente |
| **ClientProfile** | Não cria | Cria automaticamente |
| **Session** | Não cria | Cria automaticamente |
| **Tokens** | Não gera | Gera Access + Refresh |
| **Validação** | Manual | Zod Schema |

---

## 📝 Resumo do Fluxo Cliente

```
POST /api/v1/auth/register
  ↓
auth.controller.ts (registerClient)
  ↓
Validação Zod
  ↓
Upload Logo (se houver)
  ↓
auth.service.ts (registerClient)
  ↓
Transaction:
  ├─ Criar Tenant
  ├─ Criar ClientProfile
  └─ Criar User (CLIENT)
  ↓
Criar Session
  ↓
Gerar Tokens (JWT)
  ↓
Retornar { tenant, user, tokens }
```

---

## ✅ Checklist de Criação

### Para Admin:
- [ ] Email único
- [ ] Senha hashada (bcrypt 12 rounds)
- [ ] Tenant "Sistema" existe
- [ ] Role = ADMIN
- [ ] isActive = true

### Para Cliente:
- [ ] Validação de entrada (Zod)
- [ ] Tenant slug único
- [ ] Senha hashada
- [ ] Transaction completa (Tenant + ClientProfile + User)
- [ ] Session criada
- [ ] Tokens gerados
- [ ] Role = CLIENT
- [ ] isActive = true (default)

---

**💡 Observação:** O sistema é **multi-tenant**, então cada cliente tem seu próprio Tenant e ClientProfile, enquanto admins compartilham o Tenant "Sistema".

