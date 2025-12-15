# 🔧 Corrigir Enum UserRole Sem psql

## ❌ Problema

O `psql` não está instalado no container. Vamos usar Prisma diretamente.

## ✅ Solução: Script Node.js

No terminal do container, execute este comando completo:

```bash
cat > /app/fix-enum.js << 'EOF'
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixEnum() {
  try {
    console.log('🔧 Corrigindo enum UserRole...\n');

    // Criar enum UserRole
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
              CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');
          END IF;
      END $$;
    `);

    console.log('✅ Enum UserRole criado');

    // Converter coluna role
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" 
          ALTER COLUMN "role" TYPE "UserRole" 
          USING "role"::text::"UserRole";
    `);

    console.log('✅ Coluna role convertida para UserRole\n');
    console.log('✅ Correção concluída! Agora você pode criar usuários.\n');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixEnum();
EOF

node /app/fix-enum.js
```

## 🚀 Depois de Executar

Depois de executar o script acima, tente criar o admin novamente:

```bash
node /app/create-admin.js
```

---

**💡 Este script usa Prisma diretamente, então não precisa do psql!**

