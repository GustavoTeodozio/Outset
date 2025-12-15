import 'dotenv/config';
import bcrypt from 'bcryptjs';
// Importar o prisma já configurado do projeto (que funciona)
import prisma from '../src/config/prisma';

async function createAdmin() {
  try {
    console.log('\n🔐 Criando Administrador Inicial\n');

    // Dados do administrador
    const name = 'Gustavo Sampaio';
    const email = 'gustavo.sampai195@gmail.com';
    const password = 'ronaldo12';

    console.log(`Criando admin: ${name} (${email})\n`);

    // Verificar se já existe
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

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // ID FIXO para o tenant do admin
    const ADMIN_TENANT_ID = '00000000-0000-0000-0000-000000000001';
    const ADMIN_TENANT_SLUG = 'sistema-admin';

    // Criar ou buscar tenant admin com ID fixo
    let defaultTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: ADMIN_TENANT_ID },
          { slug: ADMIN_TENANT_SLUG }
        ]
      },
    });

    if (!defaultTenant) {
      defaultTenant = await prisma.tenant.create({
        data: {
          id: ADMIN_TENANT_ID, // ID FIXO
          name: 'Sistema Admin',
          slug: ADMIN_TENANT_SLUG,
          isActive: true,
        },
      });
      console.log('✅ Tenant admin criado com ID fixo');
    } else {
      console.log(`✅ Tenant admin encontrado (ID: ${defaultTenant.id})`);
    }

    // Criar usuário admin
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
  } catch (error: any) {
    console.error('\n❌ Erro ao criar administrador:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
