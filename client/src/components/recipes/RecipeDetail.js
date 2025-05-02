import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaShoppingBasket, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (error) {
        toast.error('Erreur lors du chargement de la recette');
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/recipes/${id}`);
      toast.success('Recette supprimée avec succès');
      navigate('/recipes');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la recette');
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      dessert: 'Dessert',
      snack: 'Collation',
      other: 'Autre'
    };
    return categories[category] || 'Autre';
  };

  const getUnitLabel = (unit) => {
    const units = {
      g: 'g',
      kg: 'kg',
      ml: 'ml',
      l: 'l',
      cup: 'tasse(s)',
      tbsp: 'cuillère(s) à soupe',
      tsp: 'cuillère(s) à café',
      pinch: 'pincée(s)',
      unit: 'unité(s)'
    };
    return units[unit] || unit;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Recette introuvable</p>
        <Link to="/recipes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{recipe.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/shopping-lists/new"
            state={{ selectedRecipes: [recipe._id] }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FaShoppingBasket className="mr-2" />
            Liste de courses
          </Link>
          <Link
            to={`/recipes/edit/${id}`}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FaEdit className="mr-2" />
            Modifier
          </Link>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash className="mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Contenu de la recette */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* En-tête avec image */}
        <div className={`bg-primary-100 h-48 flex items-center justify-center`}>
          {recipe.imageUrl ? (
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUtensils className="text-6xl text-primary-300" />
          )}
        </div>

        {/* Détails */}
        <div className="p-6">
          {/* Métadonnées */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="px-3 py-1 bg-primary-50 text-primary-800 rounded-full">
              {getCategoryLabel(recipe.category)}
            </div>
            {(recipe.prepTime > 0 || recipe.cookTime > 0) && (
              <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                Temps total: {recipe.prepTime + recipe.cookTime} min
              </div>
            )}
            <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
              {recipe.servings} portion{recipe.servings > 1 ? 's' : ''}
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <div className="mb-6">
              <p className="text-gray-700">{recipe.description}</p>
            </div>
          )}

          {/* Section ingrédients et instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ingrédients */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Ingrédients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-800">{ingredient.name}</span>
                    <span className="text-gray-600 font-medium">
                      {ingredient.quantity} {getUnitLabel(ingredient.unit)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la recette "{recipe.title}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;