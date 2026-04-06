#!/bin/bash

# Script para gerar chaves secretas seguras para deploy
# Uso: ./scripts/generate-secrets.sh

echo "🔐 Gerando chaves secretas para o Adriel..."
echo ""

echo "📝 POSTGRES_PASSWORD:"
openssl rand -base64 24
echo ""

echo "🔑 JWT_SECRET:"
openssl rand -base64 32
echo ""

echo "🔑 REFRESH_TOKEN_SECRET:"
openssl rand -base64 32
echo ""

echo "✅ Chaves geradas! Copie e cole no EasyPanel."
echo ""
echo "💡 Dica: Salve essas chaves em um gerenciador de senhas seguro!"









