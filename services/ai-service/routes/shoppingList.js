const express = require('express');
const Joi = require('joi');
const ShoppingList = require('../models/ShoppingList');
const auth = require('../middleware/auth');
const openaiService = require('../services/openai');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Validation de la création de liste de courses
const shoppingListValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    recipeIds: Joi.array().items(Joi.string()).required()
  });
  return schema.validate(data);
};

// Obtenir toutes les listes de courses d'un utilisateur
router.get('/shopping-lists', auth, async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({ userId: req.user.id });
    res.status(200).json(shoppingLists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir une liste de courses spécifique
router.get('/shopping-lists/:id', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ _id: req.params.id, userId: req.user.id });
    if (!shoppingList) return res.status(404).json({ message: 'Shopping list not found' });
    res.status(200).json(shoppingList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer une nouvelle liste de courses avec l'IA
router.post('/generate-shopping-list', auth, async (req, res) => {
  // Validation des données
  const { error } = shoppingListValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Récupérer les recettes
    const recipes = await openaiService.fetchRecipesFromIds(req.body.recipeIds, req.header('Authorization').split(' ')[1]);
    
    // Générer la liste de courses avec l'IA
    const aiGeneratedList = await openaiService.generateShoppingList(recipes);
    
    // Créer la liste de courses en base de données
    const shoppingList = new ShoppingList({
      userId: req.user.id,
      name: req.body.name,
      recipeIds: req.body.recipeIds,
      items: aiGeneratedList.items
    });
    
    const savedShoppingList = await shoppingList.save();
    res.status(201).json(savedShoppingList);
  } catch (err) {
    console.error('Error generating shopping list:', err);
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour le statut "checked" d'un item
router.patch('/shopping-lists/:listId/items/:itemId', auth, async (req, res) => {
  try {
    const { checked } = req.body;
    if (typeof checked !== 'boolean') {
      return res.status(400).json({ message: 'Checked status must be a boolean' });
    }

    const shoppingList = await ShoppingList.findOne({ _id: req.params.listId, userId: req.user.id });
    if (!shoppingList) return res.status(404).json({ message: 'Shopping list not found' });

    // Trouver et mettre à jour l'item
    const item = shoppingList.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.checked = checked;
    await shoppingList.save();

    res.status(200).json(shoppingList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer une liste de courses
router.delete('/shopping-lists/:id', auth, async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ _id: req.params.id, userId: req.user.id });
    if (!shoppingList) return res.status(404).json({ message: 'Shopping list not found' });

    await ShoppingList.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shopping list deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;