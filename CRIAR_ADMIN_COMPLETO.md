# 🔧 Criar Admin Completo (Com Verificação de Tenant)

## ❌ Problema

O `tenantId` não existe na tabela `Tenant`. Precisamos verificar/criar o tenant primeiro.

## ✅ Solução: Script Completo

Cole este comando completo no terminal do container:

```bash
cat > /app/create-admin-completo.js << 'EOF'
require('dotenv/config');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const name = 'Gustavo Sampaio';
  const email = 'gustavo.sampaio195@gmail.com';
  const password = 'ronaldo12';
  const tenantId = '444aeabf-701e-4a21-9db8-60f2eca11d6d';

  console.log(`🔐 Criando/atualizando admin ${email}\n`);

  try {
    // Verificar se tenant existe
    let tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      console.log(`⚠️  Tenant ${tenantId} não existe. Criando tenant "Sistema"...`);
      
      // Criar tenant "Sistema"
      tenant = await prisma.tenant.create({
        data: {
          id: tenantId,
          name: 'Sistema',
          slug: 'sistema',
          isActive: true,
        },
      });
      console.log('✅ Tenant "Sistema" criado\n');
    } else {
      console.log(`✅ Tenant encontrado: ${tenant.name}\n`);
    }

    // Hash da senha
    const hashed = await bcrypt.hash(password, 12);

    // Verificar se usuário existe
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`⚠️  Usuário ${email} já existe. Atualizando...`);
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          password: hashed,
          role: 'ADMIN',
          tenantId: tenant.id,
          isActive: true,
        },
      });
      console.log('✅ Admin atualizado com sucesso!\n');
    } else {
      console.log(`Criando novo admin...`);
      const admin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          role: 'ADMIN',
          tenantId: tenant.id,
          isActive: true,
        },
      });
      console.log('✅ Admin criado com sucesso!');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Nome: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Tenant: ${tenant.name}\n`);
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
EOF

node /app/create-admin-completo.js
```

## 🎯 O Que Este Script Faz

1. ✅ Verifica se o tenant existe
2. ✅ Se não existir, cria o tenant "Sistema"
3. ✅ Verifica se o usuário já existe
4. ✅ Se existir, atualiza (senha + role + tenant)
5. ✅ Se não existir, cria novo admin

---

**🚀 Execute o comando acima e o admin será criado com sucesso!**

