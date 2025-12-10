#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '../backend/.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf-8');
let updated = false;

// Corrige JWT_SECRET se for muito curto
if (envContent.match(/JWT_SECRET="[^"]{0,15}"/)) {
  const newSecret = crypto.randomBytes(32).toString('hex');
  envContent = envContent.replace(
    /JWT_SECRET="[^"]*"/,
    `JWT_SECRET="${newSecret}"`
  );
  updated = true;
  console.log('✅ JWT_SECRET atualizado');
}

// Corrige REFRESH_TOKEN_SECRET se for muito curto
if (envContent.match(/REFRESH_TOKEN_SECRET="[^"]{0,15}"/)) {
  const newSecret = crypto.randomBytes(32).toString('hex');
  envContent = envContent.replace(
    /REFRESH_TOKEN_SECRET="[^"]*"/,
    `REFRESH_TOKEN_SECRET="${newSecret}"`
  );
  updated = true;
  console.log('✅ REFRESH_TOKEN_SECRET atualizado');
}

// Remove ADMIN_EMAIL e ADMIN_PASSWORD se estiverem vazios (são opcionais)
if (envContent.includes('ADMIN_EMAIL=""')) {
  envContent = envContent.replace(/ADMIN_EMAIL="".*\n/, '');
  updated = true;
  console.log('✅ ADMIN_EMAIL removido (opcional)');
}

if (envContent.includes('ADMIN_PASSWORD=""')) {
  envContent = envContent.replace(/ADMIN_PASSWORD="".*\n/, '');
  updated = true;
  console.log('✅ ADMIN_PASSWORD removido (opcional)');
}

if (updated) {
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Arquivo .env corrigido!');
} else {
  console.log('✅ Arquivo .env já está correto!');
}


