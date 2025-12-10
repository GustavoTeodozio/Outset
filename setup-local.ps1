# Script de setup para desenvolvimento local (PowerShell)
# Uso: .\setup-local.ps1

Write-Host "🚀 Configurando ambiente de desenvolvimento local..." -ForegroundColor Green

# Verifica se Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não está instalado. Por favor, instale Node.js 20+ primeiro." -ForegroundColor Red
    exit 1
}

# Verifica se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado. Por favor, instale Docker primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "🐳 Iniciando PostgreSQL e Redis com Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d

Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🗄️ Configurando banco de dados..." -ForegroundColor Yellow
Set-Location backend

# Copia env.example se .env não existir
if (-not (Test-Path .env)) {
    Write-Host "📝 Criando arquivo .env a partir do exemplo..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "⚠️  IMPORTANTE: Edite backend/.env com suas configurações!" -ForegroundColor Red
}

Write-Host "🔧 Gerando cliente Prisma..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host "📊 Executando migrações..." -ForegroundColor Yellow
npm run prisma:migrate

Set-Location ..

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o desenvolvimento:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Ou inicie separadamente:" -ForegroundColor Cyan
Write-Host "  Backend:  npm run dev:backend"
Write-Host "  Frontend: npm run dev:frontend"
Write-Host ""
Write-Host "Acesse:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Backend:  http://localhost:3333"
Write-Host "  Prisma Studio: npm run db:studio"

