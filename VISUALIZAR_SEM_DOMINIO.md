# 🌐 Como Visualizar o Projeto sem Domínio Configurado

## 🎯 Métodos para Acessar sem Domínio

### Método 1: Usar IP Público + Porta (Mais Simples)

1. **Obter o IP Público do Servidor:**
   - No EasyPanel, vá para as configurações do servidor
   - Ou use o terminal do servidor:
   ```bash
   curl ifconfig.me
   ```

2. **Acessar a Aplicação:**
   - Backend: `http://SEU_IP_PUBLICO:3333`
   - Frontend: `http://SEU_IP_PUBLICO:PORTA_DO_FRONTEND`

### Método 2: Port Forwarding no EasyPanel

1. No EasyPanel, vá para a aplicação
2. Configure **Port Mapping** ou **Expose Port**
3. Mapeie a porta interna para uma porta externa
4. Acesse pelo IP + porta mapeada

### Método 3: Usar Tunnel (Cloudflare Tunnel, ngrok, etc.)

#### Usando Cloudflare Tunnel (Gratuito)

1. Instale cloudflared no servidor:
   ```bash
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   dpkg -i cloudflared-linux-amd64.deb
   ```

2. Execute o tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3333
   ```

3. Você receberá uma URL temporária como: `https://xxxxx.trycloudflare.com`

#### Usando ngrok (Gratuito)

1. Instale ngrok:
   ```bash
   # Linux
   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
   tar xvzf ngrok-v3-stable-linux-amd64.tgz
   
   # Ou via snap
   snap install ngrok
   ```

2. Execute:
   ```bash
   ngrok http 3333
   ```

3. Você receberá uma URL como: `https://xxxxx.ngrok.io`

---

## ⚙️ Configuração no EasyPanel

### Para o Backend

1. Vá para a aplicação do Backend no EasyPanel
2. Procure por **Ports** ou **Networking**
3. Configure:
   - **Internal Port:** `3333`
   - **External Port:** `3333` (ou outra porta disponível)
   - **Protocol:** `HTTP`

4. Acesse: `http://SEU_IP:3333`

### Para o Frontend

1. Vá para a aplicação do Frontend no EasyPanel
2. Configure:
   - **Internal Port:** `80`
   - **External Port:** `3000` (ou outra porta disponível)

3. Acesse: `http://SEU_IP:3000`

---

## 🔒 Configurar CORS para Aceitar IP

Se estiver usando IP ao invés de domínio, você precisa ajustar o CORS no backend:

### Opção 1: Permitir Qualquer Origem (Apenas para Testes)

No arquivo `backend/src/server/app.ts`, altere:

```typescript
const corsOptions = {
  origin: '*', // ⚠️ Apenas para testes!
  credentials: true,
};
```

### Opção 2: Adicionar IP Específico

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://SEU_IP_PUBLICO:3000',
    'http://SEU_IP_PUBLICO:PORTA_FRONTEND'
  ],
  credentials: true,
};
```

---

## 📝 Variáveis de Ambiente

### Backend

Se estiver usando IP, configure:

```env
APP_URL=http://SEU_IP_PUBLICO:3333
```

### Frontend

```env
VITE_API_URL=http://SEU_IP_PUBLICO:3333/api/v1
```

---

## 🎯 Recomendações

### Para Desenvolvimento/Testes:
- ✅ Use IP público + porta (mais simples)
- ✅ Use ngrok ou Cloudflare Tunnel (URLs mais amigáveis)

### Para Produção:
- ⚠️ **Configure um domínio** (obrigatório)
- ⚠️ Configure SSL/HTTPS
- ⚠️ Configure CORS corretamente

---

## 🔍 Verificar se Está Funcionando

### Testar Backend:

```bash
curl http://SEU_IP:3333/api/v1/health
# ou
curl http://SEU_IP:3333/
```

### Testar Frontend:

Acesse no navegador:
```
http://SEU_IP:PORTA_FRONTEND
```

---

## 🆘 Troubleshooting

### Erro de CORS
- Ajuste as configurações de CORS no backend
- Verifique se a URL no frontend está correta

### Porta não acessível
- Verifique o firewall do servidor
- Verifique se a porta está mapeada no EasyPanel
- Verifique se o serviço está rodando

### Conectado mas não carrega
- Verifique os logs no EasyPanel
- Verifique se o frontend está configurado para usar a URL correta do backend

---

**💡 Dica:** Para testes rápidos, o método mais simples é usar o IP público + porta diretamente!

