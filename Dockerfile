# Dockerfile na raiz para compatibilidade com EasyPanel
# Este Dockerfile faz build do backend

FROM node:20-alpine AS builder

WORKDIR /app

# ARG para DATABASE_URL durante o build (não precisa ser válida, só não pode estar vazia)
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Copiar arquivos do backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm ci

# Copiar resto do backend
COPY backend/ .

# Build e gerar Prisma Client (DATABASE_URL só precisa existir, não precisa ser válida)
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build
RUN npm run prisma:generate

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar arquivos do build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/generated ./generated

# Copiar script de inicialização
COPY backend/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Criar diretórios necessários
RUN mkdir -p storage/media tmp/uploads

EXPOSE 3333

CMD ["./docker-entrypoint.sh"]

