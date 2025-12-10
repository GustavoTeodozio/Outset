# Adriel - Sistema de Marketing e Gestão

Sistema completo de gestão de marketing com multi-tenant, integração com Facebook Ads, centro de treinamento e relatórios de performance.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma** + **PostgreSQL**
- **Redis** (ioredis) para cache
- **JWT** + **bcryptjs** para autenticação
- **Zod** para validação
- **Multer** para upload de arquivos

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado servidor
- **Zustand** para estado local
- **Axios** para requisições HTTP

## 📁 Estrutura do Projeto

```
adriel/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (env, prisma, redis, logger)
│   │   ├── server/          # Bootstrap Express e rotas principais
│   │   ├── domain/          # Entidades e value objects
│   │   ├── application/     # Casos de uso e serviços
│   │   │   └── modules/      # Módulos: auth, dashboard, media, training, etc.
│   │   ├── infra/           # Infraestrutura
│   │   │   ├── http/        # Controllers, rotas, middlewares, validators
│   │   │   ├── persistence/ # Repositórios Prisma
│   │   │   ├── cache/       # Cache Redis
│   │   │   ├── integrations/# Integrações externas (Facebook, etc.)
│   │   │   └── storage/     # Storage de arquivos
│   │   └── shared/          # Utils, erros, tipos compartilhados
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   └── storage/              # Arquivos uploadados
│
└── frontend/
    ├── src/
    │   ├── api/             # Cliente HTTP (Axios)
    │   ├── components/       # Componentes reutilizáveis
    │   ├── hooks/            # Custom hooks
    │   ├── modules/          # Módulos por funcionalidade
    │   │   ├── admin/        # Módulos do admin
    │   │   └── client/       # Módulos do cliente
    │   ├── pages/            # Páginas/rotas
    │   ├── store/            # Estado global (Zustand)
    │   ├── types/            # Tipos TypeScript
    │   └── utils/            # Utilitários
    └── public/               # Arquivos estáticos
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- PostgreSQL 16+ (via Docker)
- Redis 7+ (via Docker)

### 🚀 Início Rápido - Desenvolvimento Local

**Primeira vez (setup inicial):**
```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar .env
cd backend
# Com Docker:
cp env.example .env
# OU sem Docker (PostgreSQL/Redis locais):
cp env.local.example .env
# Edite .env com suas configurações
cd ..
```

**Desenvolvimento (todos os dias):**
```bash
# Apenas isso! O script faz tudo automaticamente:
npm run dev
```

O comando `npm run dev` automaticamente:
- Detecta Docker (usa se disponível, senão usa locais)
- Inicia PostgreSQL/Redis no Docker (se disponível)
- Gera Prisma Client se necessário
- Cria .env se não existir
- Inicia backend e frontend

**Acesse:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3333

**Verificar setup:**
```bash
npm run check  # Verifica se tudo está configurado
```

> 💡 **Dica:** Se você tem PostgreSQL e Redis instalados localmente, não precisa do Docker!

### 📦 Instalação Manual

1. **Instale dependências:**
```bash
npm run install:all
```

2. **Inicie banco de dados:**
```bash
npm run docker:dev
```

3. **Configure backend:**
```bash
cd backend
cp env.example .env
# Edite .env com suas configurações
npm run prisma:generate
npm run prisma:migrate
```

4. **Inicie desenvolvimento:**
```bash
npm run dev  # Backend + Frontend juntos
```

### 🌐 Deploy em Produção

Veja o guia completo em [DEPLOY.md](./DEPLOY.md)

**Resumo:**
```bash
# No servidor
cp .env.production.example .env.production
# Edite .env.production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy
```

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/adriel"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-refresh-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server
PORT=3333
NODE_ENV=development

# Storage
STORAGE_PATH="./storage"
```

## 📊 Funcionalidades

### 👤 Tipos de Usuários

1. **Administrador**
   - Gerencia clientes e conteúdo
   - Cria campanhas e controla marketing
   - Gera relatórios e uploads
   - Acesso total ao sistema

2. **Cliente (Empresário)**
   - Acompanha resultados do negócio
   - Download de materiais de marketing
   - Assistência a treinamentos
   - Baixa relatórios e acompanha leads

### 🏠 Dashboard do Cliente
- Crescimento da empresa
- Evolução mensal
- % de fechamento de clientes
- Leads recebidos
- Resultados dos anúncios
- Resumo de conteúdos novos
- Avisos e notificações

### 📁 Conteúdos de Marketing
- Visualização de mídias
- Download de materiais
- Organização por categorias/campanhas
- Banco de mídia interno
- Isolamento por tenant

### 🎓 Centro de Treinamento
- Aulas em vídeo
- Trilhas e módulos organizados
- Progresso do aluno
- Upload automático pelo admin

### 📈 Registro de Resultados
- Registro manual de vendas
- Registro de leads recebidos
- Evolução mês a mês
- Alimenta o Dashboard

### 📊 Relatórios de Performance
- Visualização de relatórios
- Download em PDF/Excel/CSV
- Histórico por mês
- Métricas de investimento, leads, vendas, ROI

### 🧩 Marketing / Facebook Ads
- Gestão de contas e ativos
- Criação e automação de campanhas
- Segmentação e públicos
- Criativos e mídias
- Conversões e eventos
- Relatórios e métricas (BI)
- Otimização automática
- Lead Ads & Webhook

## 🔒 Segurança

- **Multi-tenant**: Isolamento completo de dados por tenant
- **JWT**: Autenticação com tokens de acesso e refresh
- **Bcrypt**: Hash de senhas com salt rounds
- **Validação**: Zod em todas as entradas
- **Auditoria**: Logs de todas as ações críticas
- **Permissões**: Controle granular por role

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate    # Executa migrações
npm run prisma:studio    # Abre Prisma Studio
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

## 🐳 Docker

### Comandos úteis
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild
docker-compose up -d --build

# Executar comandos no container
docker-compose exec backend npm run prisma:migrate
```

## 📚 API Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro (admin)
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Dashboard
- `GET /api/v1/dashboard` - Dados do dashboard

### Mídias
- `GET /api/v1/media` - Listar mídias
- `POST /api/v1/media` - Upload de mídia (admin)
- `GET /api/v1/media/:id/download` - Download de mídia

### Treinamentos
- `GET /api/v1/training` - Listar módulos
- `GET /api/v1/training/:id` - Detalhes do módulo
- `POST /api/v1/training/progress` - Atualizar progresso

### Resultados
- `GET /api/v1/results` - Listar resultados
- `POST /api/v1/results` - Registrar resultado

### Relatórios
- `GET /api/v1/reports` - Listar relatórios
- `GET /api/v1/reports/:id/download` - Download de relatório

### Campanhas (Admin)
- `GET /api/v1/admin/campaigns` - Listar campanhas
- `POST /api/v1/admin/campaigns` - Criar campanha
- `PUT /api/v1/admin/campaigns/:id` - Atualizar campanha

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido para gestão de marketing e campanhas.

