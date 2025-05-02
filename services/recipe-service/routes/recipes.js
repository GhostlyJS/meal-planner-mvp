const express = require('express');
const Joi = require('joi');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation de la recette
const recipeValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    prepTime: Joi.number().min(0),
    cookTime: Joi.number().min(0),
    servings: Joi.number().min(1).required(),
    ingredients: Joi.array().items(
      Joi.object({
        _id: Joi.string(),
        name: Joi.string().required(),
        quantity: Joi.number().min(0).required(),
        unit: Joi.string().required()
      })
    ).required(),
    instructions: Joi.array().items(Joi.string()).required(),
    category: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other'),
    imageUrl: Joi.string().allow(''),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    __v: Joi.number()
  });
  return schema.validate(data);
};

// Obtenir toutes les recettes d'un utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir une recette spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Créer une nouvelle recette
router.post('/', auth, async (req, res) => {
  // Validation des données
  const { error } = recipeValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const recipe = new Recipe({
      ...req.body,
      userId: req.user.id
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour une recette
router.put('/:id', auth, async (req, res) => {
  // Validation des données
  const { error } = recipeValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Mise à jour de la recette
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer une recette
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;