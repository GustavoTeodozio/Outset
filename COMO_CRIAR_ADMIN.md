# 🔐 Como Criar Administrador

## ✅ Comando Disponível

Existe um script para criar o administrador inicial:

### No Backend (Local)

```bash
cd backend
npm run create:admin
```

### Ou diretamente com tsx:

```bash
cd backend
npx tsx scripts/create-admin.ts
```

---

## 📋 Dados Padrão do Admin

O script cria um admin com:

- **Nome:** Gustavo Sampaio
- **Email:** gustavo.sampaio195@gmail.com
- **Senha:** ronaldo12
- **Role:** ADMIN

---

## 🔧 Como Executar no EasyPanel

### Opção 1: Via Terminal do Container

1. No EasyPanel, vá no serviço `outset` (backend)
2. Abra o terminal do container
3. Execute:

```bash
npm run create:admin
```

### Opção 2: Via Exec no Docker

Se você tiver acesso SSH ao servidor:

```bash
docker exec -it <nome-do-container-backend> npm run create:admin
```

---

## ⚙️ Personalizar Dados do Admin

Se quiser mudar os dados, edite o arquivo:

`backend/scripts/create-admin.ts`

E altere as linhas 11-13:

```typescript
const name = 'Seu Nome';
const email = 'seu@email.com';
const password = 'sua_senha';
```

Depois execute o script novamente.

---

## 🔍 O Que o Script Faz

1. ✅ Verifica se o usuário já existe
2. ✅ Se existir, atualiza a senha
3. ✅ Se não existir, cria o tenant "Sistema" (se necessário)
4. ✅ Cria o usuário admin com role ADMIN
5. ✅ Ativa o usuário automaticamente

---

## 📝 Nota

O script está configurado para criar/atualizar automaticamente. Se o email já existir, ele apenas atualiza a senha.

