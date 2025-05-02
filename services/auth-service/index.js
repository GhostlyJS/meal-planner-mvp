const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import des routes
const authRoutes = require('./routes/auth');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/', authRoutes);

// Route de vérification de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});