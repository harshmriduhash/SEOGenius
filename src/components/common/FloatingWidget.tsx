import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { BiCoffeeTogo } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

const FloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center gap-3 animate-fade-in z-50">
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close widget"
      >
        <IoMdClose size={20} />
      </button>
      
      <a
        href="https://github.com/mintahandrews"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:text-black transition-colors"
        aria-label="Visit GitHub profile"
      >
        <FaGithub size={24} />
      </a>
      
      <a
        href="https://buymeacoffee.com/codemintah"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-600 hover:text-amber-700 transition-colors"
        aria-label="Buy me a coffee"
      >
        <BiCoffeeTogo size={24} />
      </a>
    </div>
  );
};

export default FloatingWidget;
