# Script PowerShell para gerar chaves secretas seguras para deploy
# Uso: .\scripts\generate-secrets.ps1

Write-Host "🔐 Gerando chaves secretas para o Adriel..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 POSTGRES_PASSWORD:" -ForegroundColor Yellow
$bytes = New-Object byte[] 24
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
Write-Host ""

Write-Host "🔑 JWT_SECRET:" -ForegroundColor Yellow
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
Write-Host ""

Write-Host "🔑 REFRESH_TOKEN_SECRET:" -ForegroundColor Yellow
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
Write-Host ""

Write-Host "✅ Chaves geradas! Copie e cole no EasyPanel." -ForegroundColor Green
Write-Host ""
Write-Host "💡 Dica: Salve essas chaves em um gerenciador de senhas seguro!" -ForegroundColor Cyan









