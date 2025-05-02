import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaCheckCircle, FaRegCircle, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const ShoppingListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  // Définition des nouvelles catégories
  const categoriesAliments = [
    "Fruits",
    "Légumes",
    "Viandes",
    "Poissons et fruits de mer",
    "Produits laitiers",
    "Céréales et féculents",
    "Légumineuses",
    "Noix et graines",
    "Huiles et matières grasses",
    "Épices et herbes",
    "Sucres et édulcorants",
    "Boissons",
    "Produits transformés",
    "Snacks et confiseries",
    "Produits de boulangerie"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listRes = await axios.get(`/ai/shopping-lists/${id}`);
        setShoppingList(listRes.data);
        
        // Récupérer les recettes associées
        if (listRes.data.recipeIds.length > 0) {
          const recipePromises = listRes.data.recipeIds.map(recipeId => 
            axios.get(`/recipes/${recipeId}`)
          );
          const recipeResponses = await Promise.all(recipePromises);
          setRecipes(recipeResponses.map(res => res.data));
        }
      } catch (error) {
        toast.error('Erreur lors du chargement de la liste de courses');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/ai/shopping-lists/${id}`);
      toast.success('Liste de courses supprimée avec succès');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la liste de courses');
    }
  };

  const handleToggleItem = async (itemId, checked) => {
    try {
      const res = await axios.patch(`/ai/shopping-lists/${id}/items/${itemId}`, {
        checked: !checked
      });
      setShoppingList(res.data);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'élément');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Fonction pour grouper les items par catégorie
  const groupItemsByCategory = () => {
    if (!shoppingList || !shoppingList.items) return {};
    
    return shoppingList.items.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {});
  };

  // Obtenir le libellé d'une catégorie - Modifié pour utiliser les nouvelles catégories
  const getCategoryLabel = (category) => {
    const categoriesAlimentsDatabase = [
      "Fruits",
      "Légumes",
      "Viandes",
      "Poissons et fruits de mer",
      "Produits laitiers",
      "Céréales et féculents",
      "Légumineuses",
      "Noix et graines",
      "Huiles et matières grasses",
      "Épices et herbes",
      "Sucres et édulcorants",
      "Boissons",
      "Produits transformés",
      "Snacks et confiseries",
      "Produits de boulangerie"
    ];
    // Mapping des clés de catégories de la base de données vers nos nouvelles catégories
    const categoryMapping = {
      "Fruits": "Fruits",
      "Légumes": "Légumes",
      "Viandes": "Viandes",
      "Poissons et fruits de mer": "Poissons et fruits de mer",
      "Produits laitiers": "Produits laitiers",
      "Céréales et féculents": "Céréales et féculents",
      "Légumineuses": "Légumineuses",
      "Noix et graines": "Noix et graines",
      "Huiles et matières grasses": "Huiles et matières grasses",
      "Épices et herbes": "Épices et herbes",
      "Sucres et édulcorants": "Sucres et édulcorants",
      "Boissons": "Boissons",
      "Produits transformés": "Produits transformés",
      "Snacks et confiseries": "Snacks et confiseries",
      "Produits de boulangerie": "Produits de boulangerie",
      "Autres": "Autres"
    };
    
    return categoryMapping[category] || "Autres";
  };

  // Obtenir le libellé d'une unité
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

  if (!shoppingList) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Liste de courses introuvable</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const groupedItems = groupItemsByCategory();
  const itemCount = shoppingList.items.length;
  const checkedCount = shoppingList.items.filter(item => item.checked).length;

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-gray-800 print:hidden"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{shoppingList.name}</h1>
        </div>
        <div className="flex space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPrint className="mr-2" />
            Imprimer
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <FaTrash className="mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Progression */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 print:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">Progression</span>
          <span className="text-sm text-gray-500">{checkedCount} sur {itemCount} articles</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full" 
            style={{ width: `${itemCount > 0 ? (checkedCount / itemCount) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Contenu de la liste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne principale: liste de courses */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Liste de courses</h2>
            
            {itemCount === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600">Aucun article dans cette liste</p>
              </div>
            ) : (
                <div className="space-y-6">
                {Object.keys(groupedItems).map(category => (
                  <div key={category}>
                    <h3 className="font-medium text-gray-700 mb-3">
                      {getCategoryLabel(category)}
                    </h3>
                    <ul className="space-y-3">
                      {groupedItems[category].map(item => (
                        <li 
                          key={item._id} 
                          className={`flex items-center p-2 rounded-md hover:bg-gray-50 ${
                            item.checked ? 'bg-gray-50' : ''
                          }`}
                        >
                          <button 
                            onClick={() => handleToggleItem(item._id, item.checked)}
                            className="flex-shrink-0 mr-3 text-primary-600 print:hidden"
                          >
                            {item.checked ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
                          </button>
                          <span className="print:ml-0 ml-2 flex-grow font-medium text-gray-800">
                            {item.name}
                          </span>
                          <span className={`text-gray-600 ${item.checked ? 'line-through' : ''}`}>
                            {item.quantity} {getUnitLabel(item.unit)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne secondaire: recettes incluses */}
        <div className="md:col-span-1 print:hidden">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Recettes incluses</h2>
            
            {recipes.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Aucune recette associée</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {recipes.map(recipe => (
                  <li key={recipe._id}>
                    <a 
                      href={`/recipes/${recipe._id}`}
                      className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <h3 className="font-medium text-gray-800">{recipe.title}</h3>
                      <p className="text-sm text-gray-500">
                        {recipe.ingredients.length} ingrédients
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Cette liste a été générée le {new Date(shoppingList.createdAt).toLocaleDateString()} avec l'aide de l'IA pour optimiser vos courses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Version imprimable */}
      <div className="hidden print:block mt-8">
        <h2 className="text-xl font-semibold mb-4">Liste de courses: {shoppingList.name}</h2>
        <div className="space-y-6">
          {Object.keys(groupedItems).map(category => (
            <div key={category}>
              <h3 className="font-medium text-gray-700 mb-3 border-b pb-1">
                {getCategoryLabel(category)}
              </h3>
              <ul className="space-y-2">
                {groupedItems[category].map(item => (
                  <li key={item._id} className="flex items-center">
                    <span className="mr-2">□</span>
                    <span className="flex-grow font-medium">{item.name}</span>
                    <span>{item.quantity} {getUnitLabel(item.unit)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-4 border-t text-sm text-gray-600">
          <p>Généré par MealPlanner • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette liste de courses ? Cette action est irréversible.
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

export default ShoppingListDetail;