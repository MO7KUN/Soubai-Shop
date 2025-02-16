import React from 'react';

const Header = ({ title, icon }) => {
  return (
    <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
      <i className={`fas ${icon}`}></i> {title}
    </h1>
  );
};

export default Header;