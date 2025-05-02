import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('Prénom requis'),
    lastName: Yup.string()
      .required('Nom requis'),
    email: Yup.string()
      .email('Email invalide')
      .required('Email requis'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .required('Mot de passe requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('Confirmation du mot de passe requise')
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = values;
      await register(userData);
      toast.success('Inscription réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Échec de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-2">Prénom</label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 mt-1 text-sm" />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-2">Nom</label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 mt-1 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Mot de passe</label>
              <Field
                type="password"
                id="password"
                name="password"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 mt-1 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-primary-600 hover:text-primary-800">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;