const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Middleware d'authentification pour vérifier le JWT
const authenticateJWT = (req, res, next) => {
  // Ne pas authentifier les routes d'authentification
  if (req.path.startsWith('/auth')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Routes publiques (pas besoin de JWT)
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxy auth request:', req.method, req.path);
    
    // Si la requête a un corps et des données JSON
    if (req.body && Object.keys(req.body).length > 0) {
      // Convertir le corps en chaîne
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding request body:', bodyData);
      
      // Réinitialiser les en-têtes Content-Length et Content-Type
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      
      // Écrire le corps dans la requête proxy
      proxyReq.write(bodyData);
      proxyReq.end(); // Important pour finaliser la requête
    }
  },
  // Surveiller les réponses
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy auth response:', proxyRes.statusCode);
  },
  // Gérer les erreurs
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Gateway error connecting to auth service' });
  }
}));

// Routes protégées (besoin de JWT)
app.use('/recipes', authenticateJWT, createProxyMiddleware({
  target: process.env.RECIPE_SERVICE_URL || 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: {
    '^/recipes': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxy auth request:', req.method, req.path);
    
    // Si la requête a un corps et des données JSON
    if (req.body && Object.keys(req.body).length > 0) {
      // Convertir le corps en chaîne
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding request body:', bodyData);
      
      // Réinitialiser les en-têtes Content-Length et Content-Type
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      
      // Écrire le corps dans la requête proxy
      proxyReq.write(bodyData);
      proxyReq.end(); // Important pour finaliser la requête
    }
  },
  // Surveiller les réponses
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy auth response:', proxyRes.statusCode);
  },
  // Gérer les erreurs
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Gateway error connecting to auth service' });
  }
}));

app.use('/ai', authenticateJWT, createProxyMiddleware({
  target: process.env.AI_SERVICE_URL || 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: {
    '^/ai': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxy auth request:', req.method, req.path);
    
    // Si la requête a un corps et des données JSON
    if (req.body && Object.keys(req.body).length > 0) {
      // Convertir le corps en chaîne
      const bodyData = JSON.stringify(req.body);
      console.log('Forwarding request body:', bodyData);
      
      // Réinitialiser les en-têtes Content-Length et Content-Type
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      
      // Écrire le corps dans la requête proxy
      proxyReq.write(bodyData);
      proxyReq.end(); // Important pour finaliser la requête
    }
  },
  // Surveiller les réponses
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy auth response:', proxyRes.statusCode);
  },
  // Gérer les erreurs
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ message: 'Gateway error connecting to auth service' });
  }
}));

// Route de vérification de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});