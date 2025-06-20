import React from 'react';
import { Link } from 'react-router-dom';
import { IoNutritionOutline, IoHeartOutline } from 'react-icons/io5';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
                <IoNutritionOutline className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">NutriGen</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advancing nutrition science through AI-powered insights, personalized meal planning, and virtual coaching.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/meal-planner" className="hover:text-white transition-colors duration-200">Meal Planner</Link></li>
              <li><Link to="/insights" className="hover:text-white transition-colors duration-200">Nutrition Insights</Link></li>
              <li><Link to="/coach" className="hover:text-white transition-colors duration-200">Virtual Coach</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/help" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link></li>
              <li><Link to="/guides" className="hover:text-white transition-colors duration-200">User Guides</Link></li>
              <li><Link to="/api" className="hover:text-white transition-colors duration-200">API Docs</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} NutriGen. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <IoHeartOutline className="h-4 w-4 text-red-500" />
            <span>for healthier living</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;