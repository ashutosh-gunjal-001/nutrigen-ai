import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  IoNutritionOutline, 
  IoHomeOutline, 
  IoCalendarOutline, 
  IoSearchOutline, 
  IoChatbubbleOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoSunnyOutline,
  IoMoonOutline
} from 'react-icons/io5';
import { logout } from '../../app/features/authSlice';
import Button from '../ui/Button';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: IoHomeOutline },
    { name: 'Meal Planner', path: '/meal-planner', icon: IoCalendarOutline },
    { name: 'Insights', path: '/insights', icon: IoSearchOutline },
    { name: 'Coach', path: '/coach', icon: IoChatbubbleOutline },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <IoNutritionOutline className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NutriGen
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  <IoPersonOutline className="h-5 w-5" />
                  <span className="font-medium">{user?.name || 'Profile'}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600"
                >
                  <IoLogOutOutline className="h-5 w-5" />
                  Logout
                </Button>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 mr-2"
                >
                  {theme === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Button as={Link} to="/register" size="sm">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-100 dark:border-gray-700"
          >
            {isAuthenticated ? (
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    <IoPersonOutline className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors duration-200 w-full text-left"
                  >
                    <IoLogOutOutline className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 w-full text-left"
                  >
                    {theme === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
                    <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 bg-primary text-white rounded-lg font-medium text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;