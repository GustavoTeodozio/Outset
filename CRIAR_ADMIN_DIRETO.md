# 🔐 Criar Admin Direto no Container (Solução Rápida)

## ✅ Execute Este Comando no Terminal do Container

No terminal do container backend (`/app`), execute este comando completo:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  try {
    const name = 'Gustavo Sampaio';
    const email = 'gustavo.sampaio195@gmail.com';
    const password = 'ronaldo12';
    
    console.log('🔐 Criando Administrador...\n');
    
    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      console.log('⚠️  Usuário já existe! Atualizando senha...');
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      });
      console.log('✅ Senha atualizada!');
    } else {
      // Criar tenant se não existir
      let tenant = await prisma.tenant.findFirst({ where: { name: 'Sistema' } });
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: { name: 'Sistema', slug: 'sistema', isActive: true }
        });
      }
      
      // Criar admin
      const hashedPassword = await bcrypt.hash(password, 12);
      const admin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
          isActive: true
        }
      });
      
      console.log('✅ Admin criado com sucesso!');
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
    }
    
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await prisma.\$disconnect();
    process.exit(1);
  }
})();
"
```

---

## 📋 Versão em Uma Linha (Mais Fácil de Copiar)

```bash
node -e "const {PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{try{const e='gustavo.sampaio195@gmail.com',s='ronaldo12',n='Gustavo Sampaio';console.log('🔐 Criando Admin...');const u=await p.user.findUnique({where:{email:e}});if(u){console.log('⚠️  Atualizando senha...');await p.user.update({where:{id:u.id},data:{password:await bcrypt.hash(s,12)}});console.log('✅ Senha atualizada!');}else{let t=await p.tenant.findFirst({where:{name:'Sistema'}});if(!t)t=await p.tenant.create({data:{name:'Sistema',slug:'sistema',isActive:true}});const a=await p.user.create({data:{name:n,email:e,password:await bcrypt.hash(s,12),role:'ADMIN',tenantId:t.id,isActive:true}});console.log('✅ Admin criado! Email:',a.email);}await p.\$disconnect();}catch(e){console.error('❌ Erro:',e.message);await p.\$disconnect();process.exit(1);}})();"
```

---

## 🎯 Como Usar

1. No EasyPanel, vá no serviço `outset` (backend)
2. Abra o **Terminal** do container
3. **Cole e execute** o comando acima
4. Pronto! ✅

---

## 🔧 Personalizar Dados

Se quiser mudar os dados, edite no comando:
- `name`: Nome do admin
- `email`: Email do admin  
- `password`: Senha do admin

---

**💡 Esta solução funciona AGORA, sem precisar esperar deploy!**

