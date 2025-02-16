import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      id="sidebar"
      className={`fixed right-0 w-64 h-screen bg-gray-800 text-white p-5 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg"
      >
        <i className="fas fa-times"></i>
      </button>

      <h2 className="text-center text-xl font-bold mb-4">لوحة التحكم</h2>
      <nav className="space-y-2">
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
          <i className="fas fa-tachometer-alt"></i> لوحة التحكم
        </Link>
        <Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
          <i className="fas fa-shopping-cart"></i> الطلبات
        </Link>
        <a href="#products" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
          <i className="fas fa-box"></i> المنتجات
        </a>
        <a href="#settings" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
          <i className="fas fa-cog"></i> إعدادات
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;