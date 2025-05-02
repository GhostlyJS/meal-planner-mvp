const { OpenAI } = require('openai');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Initialisation du client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fonction pour récupérer les recettes depuis le service des recettes
const fetchRecipesFromIds = async (recipeIds, token) => {
  try {
    const recipePromises = recipeIds.map(id => 
      axios.get(`${process.env.RECIPE_SERVICE_URL || 'http://recipe-service:4001'}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );
    
    const responses = await Promise.all(recipePromises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
};

// Fonction pour générer une liste de courses à partir de recettes
const generateShoppingList = async (recipes) => {
  // Préparer les données des recettes pour l'IA
  const recipesData = recipes.map(recipe => ({
    title: recipe.title,
    ingredients: recipe.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit
    }))
  }));

  try {
    // Appel à l'API d'OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant culinaire chargé de générer des listes de courses optimisées. Tu dois:
          1. Combiner les ingrédients similaires et ajuster les quantités
          2. Organiser les ingrédients par catégorie (fruits, légumes, produits laitiers, viande, épicerie, etc.)
          3. Retourner la liste au format JSON avec la structure suivante:
          {
            "items": [
              {
                "name": "nom de l'ingrédient",
                "quantity": quantité totale,
                "unit": "unité de mesure",
                "category": "catégorie de l'ingrédient"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Génère une liste de courses optimisée pour les recettes suivantes: ${JSON.stringify(recipesData)}`
        }
      ],
      temperature: 0.2,
    });

    // Parser la réponse JSON de l'IA
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/({[\s\S]*})/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating shopping list with AI:', error);
    throw new Error('Failed to generate shopping list');
  }
};

module.exports = {
  fetchRecipesFromIds,
  generateShoppingList
};