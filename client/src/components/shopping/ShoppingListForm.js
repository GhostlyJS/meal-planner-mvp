import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaShoppingBasket } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const ShoppingListForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(location.state?.selectedRecipes || []);
  const [name, setName] = useState('Liste de courses');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('/recipes');
        setRecipes(res.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des recettes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRecipes.length === 0) {
      toast.error('Veuillez sélectionner au moins une recette');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await axios.post('/ai/generate-shopping-list', {
        name,
        recipeIds: selectedRecipes
      });
      
      toast.success('Liste de courses générée avec succès !');
      navigate(`/shopping-lists/${res.data._id}`);
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.message || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecipe = (recipeId) => {
    if (selectedRecipes.includes(recipeId)) {
      setSelectedRecipes(selectedRecipes.filter(id => id !== recipeId));
    } else {
      setSelectedRecipes([...selectedRecipes, recipeId]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Créer une liste de courses</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Nom de la liste */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 mb-2">Nom de la liste</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Sélection des recettes */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Sélectionnez des recettes</h2>
            
            {recipes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <FaShoppingBasket className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">Aucune recette disponible pour créer une liste de courses.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map(recipe => (
                  <div
                    key={recipe._id}
                    onClick={() => toggleRecipe(recipe._id)}
                    className={`p-4 border rounded-md cursor-pointer ${
                      selectedRecipes.includes(recipe._id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                        selectedRecipes.includes(recipe._id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200'
                      }`}>
                        {selectedRecipes.includes(recipe._id) && <FaCheck size={12} />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{recipe.title}</h3>
                        <p className="text-sm text-gray-500">
                          {recipe.ingredients.length} ingrédients
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Comment ça marche :</strong> Sélectionnez les recettes que vous souhaitez cuisiner, puis cliquez sur "Générer" pour créer automatiquement une liste de courses optimisée avec l'IA.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedRecipes.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <FaShoppingBasket className="mr-2" />
                  Générer la liste de courses
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShoppingListForm;