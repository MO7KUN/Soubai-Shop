import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-20"> {/* Increased z-index */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Soubai Shop
        </Link>

        {/* Notifications and User Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Notifications Area */}
          <div className="relative">
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <i className="fas fa-user-circle text-2xl"></i>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul>
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-edit mr-2"></i> تعديل البيانات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> تسجيل الخروج
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;