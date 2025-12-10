# 📦 Dockerfile na Raiz - Configuração EasyPanel

## ✅ Problema Resolvido

O EasyPanel procura o Dockerfile na **raiz do repositório**. Agora existe um `Dockerfile` na raiz que faz build do backend.

## 📁 Estrutura dos Dockerfiles

```
projeto/
├── Dockerfile              ← NOVO (para EasyPanel - build do backend)
├── backend/
│   ├── Dockerfile          ← Original (para docker-compose)
│   └── docker-entrypoint.sh
└── frontend/
    └── Dockerfile          ← Para frontend separado
```

## 🔧 Como Funciona

O `Dockerfile` na raiz:
1. Copia arquivos do diretório `backend/`
2. Instala dependências
3. Compila o TypeScript
4. Gera o Prisma Client
5. Copia o script de inicialização
6. Executa migrações automaticamente ao iniciar

## 🚀 Deploy no EasyPanel

### Configuração

No EasyPanel, configure a aplicação assim:

**Build Settings:**
- **Type:** Dockerfile
- **Build Context:** `/` (raiz) ou deixe vazio
- **Dockerfile:** `Dockerfile`

**Porta:**
- **Port:** `3333`

**Variáveis de Ambiente:**
```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-redis>:6379/0
JWT_SECRET=<sua-chave>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<sua-chave>
REFRESH_TOKEN_EXPIRES_IN=7d
APP_URL=https://seu-dominio.com
STORAGE_DRIVER=local
```

## ✨ Funcionalidades

- ✅ Build automático do backend
- ✅ Migrações executadas automaticamente ao iniciar
- ✅ Validação de variáveis de ambiente
- ✅ Prisma Client gerado automaticamente
- ✅ Diretórios criados automaticamente

## 📝 Notas

- O Dockerfile na raiz é específico para o **backend**
- Para frontend, crie uma aplicação separada no EasyPanel apontando para `frontend/Dockerfile`
- O script `docker-entrypoint.sh` executa migrações automaticamente, então não precisa executar manualmente

---

**✅ Pronto para deploy!**

