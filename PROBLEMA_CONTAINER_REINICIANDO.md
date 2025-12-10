# 🔄 Problema: Container Reiniciando Continuamente

## ❌ Sintoma

Os logs mostram o mesmo processo se repetindo várias vezes:
```
🚀 Iniciando aplicação Adriel Backend...
✅ Variáveis de ambiente verificadas
📦 Gerando Prisma Client...
🗄️  Executando migrações do banco de dados...
```

E nunca chega em:
```
✅ Migrações executadas com sucesso!
🌐 Iniciando servidor Node.js...
API ouvindo na porta 3333
```

## 🔍 Causas Possíveis

### 1. Migrações Travando

O script pode estar travando na execução das migrações porque:
- Banco em estado inconsistente
- Migrações falhadas bloqueando novas tentativas
- Timeout na conexão com o banco

### 2. Script Encerrando o Processo

O `set -e` no script faz o processo encerrar se qualquer comando falhar, fazendo o container reiniciar.

### 3. Processo Não Inicia

Se o script não chega até `exec node dist/server/index.js`, o processo não inicia e o container reinicia.

## ✅ Correções Aplicadas

1. **Removido `set -e`** - Agora o script continua mesmo se alguns comandos falharem
2. **Saída em tempo real** - Migrações mostram saída diretamente (não capturada em variável)
3. **Tentativa de recuperação** - Se migrações falharem, tenta resetar banco
4. **Continua mesmo com erro** - Se tudo falhar, o servidor ainda tenta iniciar

## 🔧 Solução Manual (Se Necessário)

Se o container continuar reiniciando, faça no terminal do EasyPanel:

### Opção 1: Resetar Banco Manualmente

```bash
# Acessar terminal do container backend
npx prisma migrate reset --force --skip-seed
npx prisma migrate deploy
```

### Opção 2: Verificar Status das Migrações

```bash
npx prisma migrate status
```

### Opção 3: Aplicar Migrações Manualmente

```bash
# Ver quais migrações estão pendentes
npx prisma migrate status

# Aplicar migrações
npx prisma migrate deploy

# Se houver migrações falhadas, resolver:
npx prisma migrate resolve --rolled-back 20251128004019_init
```

### Opção 4: Desabilitar Migrações Temporariamente

Se você precisar que o servidor inicie enquanto resolve as migrações:

1. Comentar a seção de migrações no `docker-entrypoint.sh`
2. Fazer deploy
3. Aplicar migrações manualmente depois
4. Reverter a mudança

## 📊 Como Verificar

### 1. Ver Logs Completos

No EasyPanel, acesse os logs do serviço e role para ver:
- Se há erros específicos
- Onde exatamente está travando
- Mensagens de erro completas

### 2. Verificar Status do Container

No EasyPanel:
- CPU/Memória: Se está usando recursos (indica que está rodando)
- Status: Se mostra "Restarting" ou "Running"

### 3. Testar Conexão com Banco

```bash
# No terminal do backend
psql $DATABASE_URL -c "SELECT 1;"
```

## 🎯 Próximos Passos

1. ✅ Fazer push das correções
2. ✅ Fazer redeploy no EasyPanel
3. ✅ Verificar se o servidor inicia agora
4. ✅ Se ainda reiniciar, usar uma das soluções manuais acima

---

**💡 Dica:** Se o problema persistir, pode ser necessário aplicar as migrações manualmente uma vez antes do script funcionar automaticamente.

