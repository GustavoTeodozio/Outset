import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma';
import setupService from '../src/application/modules/auth/setup.service';

async function createAdmin() {
  try {
    console.log('\n🔐 Criando/Atualizando Administrador\n');

    // Dados do administrador (pode ser alterado aqui ou via variáveis de ambiente)
    const name = process.env.ADMIN_NAME || 'Gustavo Sampaio';
    const email = process.env.ADMIN_EMAIL || 'gustavo.sampaio195@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'ronaldo12';

    console.log(`Email: ${email}`);
    console.log(`Nome: ${name}\n`);

    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`⚠️  Usuário com email ${email} já existe!`);
      
      // Se já é admin, atualizar senha
      if (existingUser.role === 'ADMIN') {
        console.log(`   Atualizando senha do admin...\n`);
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { 
            password: hashedPassword,
            name, // Atualizar nome também
            isActive: true,
          },
        });
        
        console.log('✅ Senha do administrador atualizada com sucesso!\n');
        await prisma.$disconnect();
        process.exit(0);
      } else {
        console.log(`   ⚠️  Este usuário não é admin (role: ${existingUser.role})`);
        console.log(`   Use o endpoint /api/v1/auth/setup para criar um novo admin\n`);
        await prisma.$disconnect();
        process.exit(1);
      }
    }

    // Verificar se já existe admin (para não criar múltiplos)
    const hasAdmin = await setupService.hasAdmin();
    
    if (hasAdmin) {
      console.log('⚠️  Já existe um administrador no sistema!');
      console.log('   Use o endpoint /api/v1/auth/setup para criar um novo admin');
      console.log('   ou faça login com um admin existente.\n');
      await prisma.$disconnect();
      process.exit(1);
    }

    // Criar admin usando o serviço de setup
    console.log('📝 Criando primeiro administrador...\n');
    const admin = await setupService.setupFirstAdmin({
      name,
      email,
      password,
    });

    console.log('\n✅ Administrador criado com sucesso!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Tenant: ${admin.tenantId}\n`);

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
