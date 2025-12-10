#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    // Tenta executar o comando diretamente (funciona em todos os sistemas)
    execSync(`${command} --version`, { stdio: 'ignore', shell: true });
    return true;
  } catch {
    return false;
  }
}

function checkDockerRunning() {
  try {
    execSync('docker ps', { stdio: 'ignore', shell: true });
    return true;
  } catch {
    return false;
  }
}

function checkContainerRunning(containerName) {
  try {
    const output = execSync(`docker ps --filter "name=${containerName}" --format "{{.Names}}"`, {
      encoding: 'utf-8',
      shell: true,
    });
    return output.trim() === containerName;
  } catch {
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '../backend/.env');
  return fs.existsSync(envPath);
}

function checkPrismaGenerated() {
  const prismaClientPath = path.join(__dirname, '../backend/node_modules/.prisma/client');
  return fs.existsSync(prismaClientPath);
}

async function main() {
  log('\n🚀 Iniciando Adriel...\n', 'cyan');

  // 1. Verificar Docker (opcional)
  const dockerAvailable = checkCommand('docker') && checkDockerRunning();
  const useDocker = dockerAvailable;
  
  if (!dockerAvailable) {
    log('ℹ️  Docker não detectado. Usando PostgreSQL/Redis locais.', 'yellow');
    log('   Certifique-se de que PostgreSQL e Redis estão rodando localmente.\n', 'yellow');
  }

  // 2. Verificar e corrigir .env
  const envPath = path.join(__dirname, '../backend/.env');
  
  if (!checkEnvFile()) {
    log('📝 Arquivo .env não encontrado. Criando a partir do exemplo...', 'yellow');
    
    // Escolhe qual exemplo usar baseado na disponibilidade do Docker
    let envExample;
    if (useDocker) {
      envExample = path.join(__dirname, '../backend/env.example');
    } else {
      envExample = path.join(__dirname, '../backend/env.local.example');
    }
    
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envPath);
      log('✅ Arquivo .env criado!', 'green');
    } else {
      log('❌ Arquivo de exemplo não encontrado!', 'red');
      process.exit(1);
    }
  }
  
  // Verifica e corrige valores inválidos no .env
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const crypto = require('crypto');
    let needsFix = false;
    let fixedContent = envContent;
    
    // Corrige JWT_SECRET se for muito curto
    if (fixedContent.match(/JWT_SECRET="[^"]{0,15}"/)) {
      const newSecret = crypto.randomBytes(32).toString('hex');
      fixedContent = fixedContent.replace(
        /JWT_SECRET="[^"]*"/,
        `JWT_SECRET="${newSecret}"`
      );
      needsFix = true;
    }
    
    // Corrige REFRESH_TOKEN_SECRET se for muito curto
    if (fixedContent.match(/REFRESH_TOKEN_SECRET="[^"]{0,15}"/)) {
      const newSecret = crypto.randomBytes(32).toString('hex');
      fixedContent = fixedContent.replace(
        /REFRESH_TOKEN_SECRET="[^"]*"/,
        `REFRESH_TOKEN_SECRET="${newSecret}"`
      );
      needsFix = true;
    }
    
    // Remove ADMIN_EMAIL e ADMIN_PASSWORD vazios (são opcionais)
    fixedContent = fixedContent.replace(/ADMIN_EMAIL="".*\n/g, '');
    fixedContent = fixedContent.replace(/ADMIN_PASSWORD="".*\n/g, '');
    
    if (needsFix) {
      fs.writeFileSync(envPath, fixedContent);
      log('✅ Arquivo .env corrigido automaticamente!', 'green');
    }
  } catch (error) {
    log('⚠️  Não foi possível verificar/corrigir .env', 'yellow');
  }

  // 3. Verificar e gerar Prisma Client
  log('🔧 Verificando Prisma Client...', 'yellow');
  try {
    execSync('npm run db:generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      shell: true,
    });
    log('✅ Prisma Client verificado/gerado!\n', 'green');
  } catch (error) {
    log('⚠️  Aviso: Erro ao gerar Prisma Client (continuando...)\n', 'yellow');
  }

  // 4. Verificar e iniciar containers Docker (se disponível)
  if (useDocker) {
    const postgresRunning = checkContainerRunning('adriel-postgres-dev');
    const redisRunning = checkContainerRunning('adriel-redis-dev');

    if (!postgresRunning || !redisRunning) {
      log('🐳 Iniciando PostgreSQL e Redis no Docker...', 'yellow');
      try {
        execSync('npm run docker:dev', {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..'),
          shell: true,
        });
        log('⏳ Aguardando serviços iniciarem...', 'yellow');
        await new Promise(resolve => setTimeout(resolve, 5000));
        log('✅ Serviços iniciados!\n', 'green');
      } catch (error) {
        log('❌ Erro ao iniciar containers Docker', 'red');
        log('   Continuando sem Docker...\n', 'yellow');
      }
    } else {
      log('✅ PostgreSQL e Redis já estão rodando no Docker\n', 'green');
    }
  } else {
    log('ℹ️  Usando PostgreSQL/Redis locais (sem Docker)\n', 'yellow');
  }

  // 5. Iniciar desenvolvimento
  log('🎯 Iniciando backend e frontend...\n', 'cyan');
  log('   Frontend: http://localhost:3000', 'blue');
  log('   Backend:  http://localhost:3333\n', 'blue');
  log('   Pressione Ctrl+C para parar\n', 'yellow');

  // Iniciar com concurrently (dev:simple para evitar loop)
  const devProcess = spawn('npm', ['run', 'dev:simple'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..'),
  });

  // Tratar saída
  process.on('SIGINT', () => {
    log('\n\n🛑 Parando serviços...', 'yellow');
    devProcess.kill();
    process.exit(0);
  });

  devProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main().catch((error) => {
  log(`\n❌ Erro: ${error.message}`, 'red');
  process.exit(1);
});

