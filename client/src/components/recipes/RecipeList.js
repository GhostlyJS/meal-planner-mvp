import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('/recipes');
        setRecipes(res.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des recettes');
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || recipe.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'breakfast', label: 'Petit-déjeuner' },
    { value: 'lunch', label: 'Déjeuner' },
    { value: 'dinner', label: 'Dîner' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'snack', label: 'Collation' },
    { value: 'other', label: 'Autre' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Mes recettes</h1>
        <Link 
          to="/recipes/new" 
          className="flex items-center justify-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <FaPlus className="mr-2" />
          Ajouter une recette
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="md:w-64">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
          {recipes.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Vous n'avez pas encore de recettes.</p>
              <Link 
                to="/recipes/new" 
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Créer ma première recette
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">
              Aucune recette ne correspond à votre recherche. Essayez d'autres critères.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-primary-100 h-32 flex items-center justify-center`}>
                {recipe.imageUrl ? (
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUtensils className="text-4xl text-primary-300" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{recipe.title}</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                  </span>
                  <span>{recipe.ingredients.length} ingrédients</span>
                </div>
                {recipe.prepTime && recipe.cookTime && (
                  <div className="mt-2 text-sm text-gray-500">
                    Temps total: {recipe.prepTime + recipe.cookTime} min
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;