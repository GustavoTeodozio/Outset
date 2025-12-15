import 'dotenv/config';
import bcrypt from 'bcryptjs';
// Importar o prisma já configurado do projeto (que funciona)
import prisma from '../src/config/prisma';

async function createAdmin() {
  try {
    console.log('\n🔐 Criando Administrador\n');

    // Pegar argumentos da linha de comando ou usar valores padrão
    const name = process.argv[2] || 'Gustavo Sampaio';
    const email = process.argv[3] || 'gustavo.sampai195@gmail.com';
    const password = process.argv[4] || 'ronaldo12';

    // Se passar algum argumento, todos são obrigatórios
    if (process.argv.length > 2 && (!name || !email || !password)) {
      console.error('\n❌ Uso: npm run create:admin [nome] [email] [senha]');
      console.error('   Exemplo: npm run create:admin "João Silva" joao@exemplo.com senha123\n');
      process.exit(1);
    }

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

    // Criar tenant padrão se não existir
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
