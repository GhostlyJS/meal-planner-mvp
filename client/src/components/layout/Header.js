import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaShoppingBasket, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-primary-600">
            <FaUtensils className="mr-2 text-xl" />
            <span className="font-bold text-lg">MealPlanner</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600"
                >
                  Tableau de bord
                </Link>
                <Link 
                  to="/recipes" 
                  className="text-gray-700 hover:text-primary-600"
                >
                  Recettes
                </Link>
                <Link 
                  to="/shopping-lists/new" 
                  className="text-gray-700 hover:text-primary-600"
                >
                  Liste de courses
                </Link>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none"
                    onClick={toggleProfileDropdown}
                  >
                    <FaUserCircle className="mr-1" />
                    <span>{user.firstName}</span>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white py-4 px-4 border-t">
          <div className="flex flex-col space-y-3">
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link 
                  to="/recipes" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recettes
                </Link>
                <Link 
                  to="/shopping-lists/new" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Liste de courses
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-primary-600 py-2"
                >
                  Déconnexion
                </button>
              </>
            )}

            {!user && (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;