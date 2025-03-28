
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-sm rounded-b-xl">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="rounded-full bg-kid-purple p-2 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">🚀</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink text-transparent bg-clip-text">
            AI Kid Explorer
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-kid-blue rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          <span className="text-4xl">👶</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
