import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="top-0 left-0 w-full px-5 py-3 bg-gray-800 text-white flex justify-between items-center z-50 shadow-md">
      <h2 className="text-xl font-bold">CountryChallenge</h2>
    </nav>
  );
};

export default Navbar;
