#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
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

async function main() {
  log('\n🔍 Verificando setup do projeto...\n', 'cyan');

  let allOk = true;

  // Verificar Node.js
  if (!checkCommand('node')) {
    log('❌ Node.js não está instalado', 'red');
    allOk = false;
  } else {
    log('✅ Node.js instalado', 'green');
  }

  // Verificar Docker
  if (!checkCommand('docker')) {
    log('❌ Docker não está instalado', 'red');
    allOk = false;
  } else {
    log('✅ Docker instalado', 'green');
    
    try {
      execSync('docker ps', { stdio: 'ignore', shell: true });
      log('✅ Docker está rodando', 'green');
    } catch {
      log('⚠️  Docker não está rodando', 'yellow');
      allOk = false;
    }
  }

  // Verificar containers
  const postgresRunning = checkContainerRunning('adriel-postgres-dev');
  const redisRunning = checkContainerRunning('adriel-redis-dev');

  if (postgresRunning) {
    log('✅ PostgreSQL está rodando', 'green');
  } else {
    log('⚠️  PostgreSQL não está rodando', 'yellow');
    log('   Execute: npm run docker:dev', 'yellow');
  }

  if (redisRunning) {
    log('✅ Redis está rodando', 'green');
  } else {
    log('⚠️  Redis não está rodando', 'yellow');
    log('   Execute: npm run docker:dev', 'yellow');
  }

  // Verificar .env
  const envPath = path.join(__dirname, '../backend/.env');
  if (fs.existsSync(envPath)) {
    log('✅ Arquivo .env existe', 'green');
  } else {
    log('⚠️  Arquivo .env não encontrado', 'yellow');
    log('   Execute: cp backend/env.example backend/.env', 'yellow');
    allOk = false;
  }

  // Verificar Prisma Client
  const prismaClientPath = path.join(__dirname, '../backend/node_modules/.prisma/client');
  if (fs.existsSync(prismaClientPath)) {
    log('✅ Prisma Client gerado', 'green');
  } else {
    log('⚠️  Prisma Client não gerado', 'yellow');
    log('   Execute: npm run db:generate', 'yellow');
    allOk = false;
  }

  // Verificar node_modules
  const backendNodeModules = path.join(__dirname, '../backend/node_modules');
  const frontendNodeModules = path.join(__dirname, '../frontend/node_modules');
  
  if (fs.existsSync(backendNodeModules)) {
    log('✅ Dependências do backend instaladas', 'green');
  } else {
    log('⚠️  Dependências do backend não instaladas', 'yellow');
    log('   Execute: cd backend && npm install', 'yellow');
    allOk = false;
  }

  if (fs.existsSync(frontendNodeModules)) {
    log('✅ Dependências do frontend instaladas', 'green');
  } else {
    log('⚠️  Dependências do frontend não instaladas', 'yellow');
    log('   Execute: cd frontend && npm install', 'yellow');
    allOk = false;
  }

  console.log('');
  if (allOk && postgresRunning && redisRunning) {
    log('✅ Tudo pronto! Execute: npm run dev', 'green');
  } else {
    log('⚠️  Algumas verificações falharam. Corrija os problemas acima.', 'yellow');
  }
  console.log('');
}

main().catch((error) => {
  log(`\n❌ Erro: ${error.message}`, 'red');
  process.exit(1);
});

