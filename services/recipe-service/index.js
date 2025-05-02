const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import des routes
const recipeRoutes = require('./routes/recipes');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;

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
app.use('/', recipeRoutes);

// Route de vérification de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Recipe service running on port ${PORT}`);
});