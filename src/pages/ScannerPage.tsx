
import React from 'react';
import Header from '@/components/Header';
import ObjectScanner from '@/components/ObjectScanner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ScannerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              ← Retour à l'accueil
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Analyseur d'images</h1>
            <p className="text-gray-600">Importe une image et découvre ce que c'est !</p>
          </div>
          
          <ObjectScanner />
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 bg-white">
        <p>AI Kid Explorer - Apprends en t'amusant !</p>
      </footer>
    </div>
  );
};

export default ScannerPage;
