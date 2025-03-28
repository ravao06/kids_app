
import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-sm rounded-b-xl">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-kid-purple p-2 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">🚀</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink text-transparent bg-clip-text">
          AI Kid Explorer
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-kid-blue hover:text-kid-purple hover:bg-blue-50">
          Aide
        </Button>
        <Button variant="ghost" className="text-kid-blue hover:text-kid-purple hover:bg-blue-50">
          Profil
        </Button>
      </div>
    </header>
  );
};

export default Header;
