# 🔌 Configuração da Porta do PostgreSQL

## 📌 Importante: Porta Interna vs Porta Externa

No Docker/EasyPanel, existem **2 tipos de porta**:

### 1. Porta Interna (do Container)
- Sempre é **5432** para PostgreSQL
- É usada na `DATABASE_URL` quando containers se comunicam
- **Esta é a que você usa na conexão!**

### 2. Porta Externa (exposta para fora)
- Pode ser qualquer porta (ex: 5433, 5434, etc.)
- Só importa se você quiser conectar de FORA do servidor
- **NÃO é usada na DATABASE_URL entre containers**

---

## ✅ Configuração Correta para DATABASE_URL

Quando os serviços estão na mesma rede Docker (EasyPanel), você usa:

```
postgres://usuario:senha@NOME_DO_SERVICO:5432/nome_do_banco
                                    ↑
                        SEMPRE 5432 (porta interna)
```

**Exemplo:**
```env
DATABASE_URL=postgres://postgres:senha@marketing_postgres:5432/marketing?sslmode=disable
                                              ↑                    ↑
                                    Nome do serviço        Sempre 5432
```

---

## 🔍 Como Verificar o Nome do Serviço PostgreSQL

1. No EasyPanel, veja a lista de serviços
2. O nome do serviço PostgreSQL aparece lá (ex: `postgres`, `marketing_postgres`)
3. Use esse nome na `DATABASE_URL`

---

## ⚠️ Se a Porta Externa for Diferente

**Não importa!** 

Mesmo que a porta externa seja `5433` ou outra, na `DATABASE_URL` você SEMPRE usa `5432`:

```env
# ✅ CORRETO (sempre porta 5432)
DATABASE_URL=postgres://postgres:senha@marketing_postgres:5432/marketing

# ❌ ERRADO (não use a porta externa)
DATABASE_URL=postgres://postgres:senha@marketing_postgres:5433/marketing
```

---

## 📋 Resumo

| Item | Valor |
|------|-------|
| **Porta Interna (DATABASE_URL)** | `5432` (sempre) |
| **Porta Externa** | Qualquer uma (não importa) |
| **Formato DATABASE_URL** | `postgres://user:pass@NOME_SERVICO:5432/db` |

---

**💡 Dica:** Se o PostgreSQL estiver funcionando, a configuração atual (`5432`) está correta!

