
import React from 'react';

interface CharacterProps {
  message?: string;
  animate?: boolean;
}

const Character: React.FC<CharacterProps> = ({ message, animate = true }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`character-container ${animate ? 'animate-float' : ''}`}>
        <div className="w-32 h-32 bg-kid-blue rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          <span className="text-6xl">🤖</span>
        </div>
      </div>
      
      {message && (
        <div className="speech-bubble mt-4 bg-white p-4 rounded-xl shadow-md relative max-w-xs">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
          <p className="text-center text-gray-800">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Character;
