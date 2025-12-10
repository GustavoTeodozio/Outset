import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import env from '../config/env';
import routes from '../infra/http/routes';
import errorHandler from '../infra/http/middlewares/error-handler';

const app = express();

// CORS configurado para aceitar requisições do frontend
const corsOptions = {
  origin: env.NODE_ENV === 'production' 
    ? env.APP_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));

// Helmet com configurações mais permissivas para desenvolvimento
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false, // Desabilitado para permitir imagens
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Permite recursos cross-origin
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Servir arquivos estáticos com CORS habilitado
app.use('/static', (req, res, next) => {
  // Aplicar CORS manualmente para arquivos estáticos
  const origin = req.headers.origin;
  if (origin && (corsOptions.origin === '*' || 
      (Array.isArray(corsOptions.origin) && corsOptions.origin.includes(origin)) ||
      corsOptions.origin === origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
}, express.static(path.resolve(process.cwd(), 'storage')));

// Rota de health check na raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Adriel Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;

