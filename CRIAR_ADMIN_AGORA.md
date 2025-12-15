# 🚀 Criar Admin Agora (Sem Rebuild)

## ⚠️ Problema

O container ainda não foi reconstruído com a pasta `scripts`, então os arquivos não estão disponíveis.

## ✅ Solução Rápida

Copie e cole este código diretamente no terminal do container:

```bash
cat > /app/create-admin.js << 'EOF'
require('dotenv/config');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('\n🔐 Criando Administrador Inicial\n');

    const name = 'Gustavo Sampaio';
    const email = 'gustavo.sampai195@gmail.com';
    const password = 'ronaldo12';

    console.log(`Criando admin: ${name} (${email})\n`);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`⚠️  Usuário com email ${email} já existe!`);
      console.log(`   Atualizando senha...\n`);
      
      const hashedPassword = await bcrypt.hash(password, 12);
      
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });
      
      console.log('✅ Senha do administrador atualizada com sucesso!\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let defaultTenant = await prisma.tenant.findFirst({
      where: { name: 'Sistema' },
    });

    if (!defaultTenant) {
      defaultTenant = await prisma.tenant.create({
        data: {
          name: 'Sistema',
          slug: 'sistema',
          isActive: true,
        },
      });
      console.log('✅ Tenant padrão criado');
    }

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: defaultTenant.id,
        isActive: true,
      },
    });

    console.log('\n✅ Administrador criado com sucesso!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}\n`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao criar administrador:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
EOF

node /app/create-admin.js
```

## 📋 Passo a Passo

1. **Acesse o terminal do container `outset` no EasyPanel**
2. **Cole todo o código acima** (do `cat >` até o `EOF`)
3. **Pressione Enter**
4. **O script será criado e executado automaticamente**

## ✅ Resultado Esperado

Você deve ver:
```
✅ Administrador criado com sucesso!
   ID: [id]
   Nome: Gustavo Sampaio
   Email: gustavo.sampai195@gmail.com
   Role: ADMIN
```

---

**💡 Depois:** Quando fizer o próximo deploy do backend, o comando `npm run create:admin` funcionará normalmente!

