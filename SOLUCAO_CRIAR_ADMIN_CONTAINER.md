# 🔧 Solução: Criar Admin no Container

## ❌ Problema

O arquivo `scripts/create-admin.ts` não estava sendo copiado para o container.

## ✅ Solução Aplicada

Adicionei a cópia da pasta `scripts` no Dockerfile:
```dockerfile
COPY --from=builder /app/scripts ./scripts
```

## 🚀 Como Usar Agora

### Opção 1: Após Novo Deploy (Recomendado)

1. **Faça push das mudanças:**
   ```bash
   git push
   ```

2. **Faça deploy do backend no EasyPanel**

3. **Acesse o terminal do container e execute:**
   ```bash
   npm run create:admin
   ```

### Opção 2: Usar Versão JavaScript (Temporário)

Se `tsx` não estiver disponível no container, use a versão JavaScript:

```bash
node scripts/create-admin.js
```

### Opção 3: Instalar tsx no Container (Temporário)

Se precisar usar o TypeScript, instale tsx temporariamente:

```bash
npm install -g tsx
npm run create:admin
```

## 📋 Verificar se Funcionou

Depois de executar, você deve ver:
```
✅ Administrador criado com sucesso!
   ID: [id]
   Nome: Gustavo Sampaio
   Email: gustavo.sampai195@gmail.com
   Role: ADMIN
```

---

**💡 Dica:** Após fazer o deploy com a correção do Dockerfile, o comando `npm run create:admin` funcionará normalmente!

