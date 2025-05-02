import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUtensils, FaShoppingBasket } from 'react-icons/fa';
import axios from '../../utils/axios';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, shoppingListsRes] = await Promise.all([
          axios.get('/recipes'),
          axios.get('/ai/shopping-lists')
        ]);
        setRecipes(recipesRes.data);
        setShoppingLists(shoppingListsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue, {user?.firstName} !</h1>
        <p className="text-gray-600">Gérez vos repas et listes de courses facilement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Section recettes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Mes recettes</h2>
            <Link 
              to="/recipes/new" 
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <FaPlus className="mr-1" /> Ajouter
            </Link>
          </div>
          
          {recipes.length === 0 ? (
            <div className="text-center py-8">
              <FaUtensils className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">Vous n'avez pas encore de recettes.</p>
              <Link 
                to="/recipes/new" 
                className="mt-3 inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
              >
                Créer ma première recette
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recipes.slice(0, 5).map(recipe => (
                <Link 
                  key={recipe._id} 
                  to={`/recipes/${recipe._id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-800">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">
                    {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)} • {recipe.ingredients.length} ingrédients
                  </p>
                </Link>
              ))}
              
              {recipes.length > 5 && (
                <Link 
                  to="/recipes" 
                  className="block text-center text-primary-600 hover:text-primary-700 mt-2"
                >
                  Voir toutes mes recettes ({recipes.length})
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Section listes de courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Mes listes de courses</h2>
            <Link 
              to="/shopping-lists/new" 
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <FaPlus className="mr-1" /> Créer
            </Link>
          </div>
          
          {shoppingLists.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBasket className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">Vous n'avez pas encore de liste de courses.</p>
              <Link 
                to="/shopping-lists/new" 
                className="mt-3 inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
              >
                Créer ma première liste
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {shoppingLists.slice(0, 5).map(list => (
                <Link 
                  key={list._id} 
                  to={`/shopping-lists/${list._id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <h3 className="font-medium text-gray-800">{list.name}</h3>
                  <p className="text-sm text-gray-500">
                    {list.items.length} articles • {new Date(list.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
              
              {shoppingLists.length > 5 && (
                <Link 
                  to="/shopping-lists" 
                  className="block text-center text-primary-600 hover:text-primary-700 mt-2"
                >
                  Voir toutes mes listes ({shoppingLists.length})
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section création rapide */}
      <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Créez rapidement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/recipes/new" 
            className="flex items-center justify-center p-4 bg-white border border-primary-200 rounded-md hover:bg-primary-100"
          >
            <FaUtensils className="mr-2 text-primary-600" />
            <span>Ajouter une recette</span>
          </Link>
          <Link 
            to="/shopping-lists/new" 
            className="flex items-center justify-center p-4 bg-white border border-primary-200 rounded-md hover:bg-primary-100"
          >
            <FaShoppingBasket className="mr-2 text-primary-600" />
            <span>Créer une liste de courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;