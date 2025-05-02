import React from 'react';
import { FaUtensils, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FaUtensils className="text-primary-600 mr-2" />
            <span className="font-bold text-gray-800">MealPlanner</span>
          </div>
          
          <div className="text-gray-600 text-sm">
            <p className="flex items-center justify-center">
              Conçu avec <FaHeart className="text-red-500 mx-1" /> pour faciliter votre quotidien
            </p>
            <p className="text-center mt-1">
              &copy; {currentYear} MealPlanner. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;