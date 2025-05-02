import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    category: 'other',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    ingredients: [{ name: '', quantity: 0, unit: 'g' }],
    instructions: ['']
  });

  // Mode édition ou création
  const isEditMode = !!id;

  useEffect(() => {
    // Charger la recette en mode édition
    if (isEditMode) {
      const fetchRecipe = async () => {
        try {
          const res = await axios.get(`/recipes/${id}`);
          setInitialValues(res.data);
        } catch (error) {
          toast.error('Erreur lors du chargement de la recette');
          navigate('/recipes');
        }
      };
      
      fetchRecipe();
    }
  }, [id, isEditMode, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Le titre est requis'),
    description: Yup.string(),
    category: Yup.string().required('La catégorie est requise'),
    prepTime: Yup.number().min(0, 'Le temps doit être positif').required('Le temps de préparation est requis'),
    cookTime: Yup.number().min(0, 'Le temps doit être positif').required('Le temps de cuisson est requis'),
    servings: Yup.number().min(1, 'Minimum 1 portion').required('Le nombre de portions est requis'),
    ingredients: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Le nom est requis'),
        quantity: Yup.number().min(0, 'La quantité doit être positive').required('La quantité est requise'),
        unit: Yup.string().required('L\'unité est requise')
      })
    ).min(1, 'Au moins un ingrédient est requis'),
    instructions: Yup.array().of(
      Yup.string().required('L\'instruction est requise')
    ).min(1, 'Au moins une instruction est requise')
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await axios.put(`/recipes/${id}`, values);
        toast.success('Recette mise à jour avec succès !');
      } else {
        await axios.post('/recipes', values);
        toast.success('Recette créée avec succès !');
      }
      navigate('/recipes');
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.message || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'breakfast', label: 'Petit-déjeuner' },
    { value: 'lunch', label: 'Déjeuner' },
    { value: 'dinner', label: 'Dîner' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'snack', label: 'Collation' },
    { value: 'other', label: 'Autre' }
  ];

  const units = [
    { value: 'g', label: 'grammes (g)' },
    { value: 'kg', label: 'kilogrammes (kg)' },
    { value: 'ml', label: 'millilitres (ml)' },
    { value: 'l', label: 'litres (l)' },
    { value: 'cup', label: 'tasses' },
    { value: 'tbsp', label: 'cuillères à soupe' },
    { value: 'tsp', label: 'cuillères à café' },
    { value: 'pinch', label: 'pincée' },
    { value: 'unit', label: 'unité(s)' }
  ];

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Modifier la recette' : 'Créer une nouvelle recette'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 mb-2">Titre</label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.title && touched.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom de la recette"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 mt-1 text-sm" />
                </div>

                <div>
                  <label htmlFor="category" className="block text-gray-700 mb-2">Catégorie</label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Description de la recette (optionnel)"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Temps et portions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="prepTime" className="block text-gray-700 mb-2">Temps de préparation (min)</label>
                  <Field
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.prepTime && touched.prepTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="prepTime" component="div" className="text-red-500 mt-1 text-sm" />
                </div>

                <div>
                  <label htmlFor="cookTime" className="block text-gray-700 mb-2">Temps de cuisson (min)</label>
                  <Field
                    type="number"
                    id="cookTime"
                    name="cookTime"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.cookTime && touched.cookTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="cookTime" component="div" className="text-red-500 mt-1 text-sm" />
                </div>

                <div>
                  <label htmlFor="servings" className="block text-gray-700 mb-2">Nombre de portions</label>
                  <Field
                    type="number"
                    id="servings"
                    name="servings"
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.servings && touched.servings ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="servings" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </div>

              {/* Ingrédients */}
              <div>
                <label className="block text-gray-700 mb-2">Ingrédients</label>
                <FieldArray name="ingredients">
                  {({ remove, push }) => (
                    <div className="space-y-3">
                      {values.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center space-x-2">
                        <div className="flex-grow">
                          <Field
                            type="text"
                            name={`ingredients.${index}.name`}
                            placeholder="Nom de l'ingrédient"
                            className={`w-full px-3 py-2 border rounded-md ${
                              errors.ingredients?.[index]?.name && touched.ingredients?.[index]?.name
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage
                            name={`ingredients.${index}.name`}
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>
                        
                        <div className="w-24">
                          <Field
                            type="number"
                            name={`ingredients.${index}.quantity`}
                            placeholder="Qté"
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-md ${
                              errors.ingredients?.[index]?.quantity && touched.ingredients?.[index]?.quantity
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage
                            name={`ingredients.${index}.quantity`}
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>
                        
                        <div className="w-36">
                          <Field
                            as="select"
                            name={`ingredients.${index}.unit`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            {units.map(unit => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={values.ingredients.length === 1}
                          className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => push({ name: '', quantity: 0, unit: 'g' })}
                      className="flex items-center text-primary-600 hover:text-primary-700 mt-2"
                    >
                      <FaPlus className="mr-1" /> Ajouter un ingrédient
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-gray-700 mb-2">Instructions</label>
              <FieldArray name="instructions">
                {({ remove, push }) => (
                  <div className="space-y-3">
                    {values.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="flex-shrink-0 pt-2 w-6 text-center">
                          {index + 1}.
                        </div>
                        <div className="flex-grow">
                          <Field
                            as="textarea"
                            name={`instructions.${index}`}
                            rows="2"
                            placeholder={`Étape ${index + 1}`}
                            className={`w-full px-3 py-2 border rounded-md ${
                              errors.instructions?.[index] && touched.instructions?.[index]
                                ? 'border-red-500'
                                : 'border-gray-300'
                            }`}
                          />
                          <ErrorMessage
                            name={`instructions.${index}`}
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={values.instructions.length === 1}
                          className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => push('')}
                      className="flex items-center text-primary-600 hover:text-primary-700 mt-2"
                    >
                      <FaPlus className="mr-1" /> Ajouter une instruction
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/recipes')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? isEditMode ? 'Enregistrement...' : 'Création...'
                  : isEditMode ? 'Mettre à jour' : 'Créer la recette'
                }
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);
};

export default RecipeForm;