# 🔐 Como Criar Administrador

## ✅ Comando Pronto!

O script já está configurado com seus dados:
- **Email:** `gustavo.sampai195@gmail.com`
- **Senha:** `ronaldo12`
- **Nome:** Gustavo Sampaio

## 🚀 Como Usar

### Opção 1: Localmente (Desenvolvimento)

```bash
cd backend
npm run create:admin
```

### Opção 2: No EasyPanel (Produção)

1. **Acesse o terminal do serviço `outset` (backend) no EasyPanel**
2. Execute:
   ```bash
   npm run create:admin
   ```

### Opção 3: Via Docker (se estiver rodando localmente)

```bash
docker-compose exec backend npm run create:admin
```

## 📋 O Que o Script Faz

1. ✅ Verifica se o usuário já existe
2. ✅ Se existir, atualiza a senha
3. ✅ Se não existir, cria o tenant "Sistema" (se necessário)
4. ✅ Cria o usuário administrador com role `ADMIN`

## ⚠️ Importante

- O script usa as variáveis de ambiente do `.env` (especialmente `DATABASE_URL`)
- Certifique-se de que o banco de dados está configurado corretamente
- O usuário será criado no tenant "Sistema"

## 🔄 Para Mudar os Dados

Edite o arquivo `backend/scripts/create-admin.ts` e altere:
```typescript
const name = 'Seu Nome';
const email = 'seu@email.com';
const password = 'sua_senha';
```

Depois execute o comando novamente.

---

**✅ Pronto!** O comando está configurado e pronto para usar!

