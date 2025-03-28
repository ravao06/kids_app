
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface ScanResult {
  className: string;
  probability: number;
}

const ObjectScanner: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string>("");
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
        // Make sure TensorFlow is ready
        await tf.ready();
        console.log("TensorFlow.js is ready");
        
        // Load the COCO-SSD model
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log("COCO-SSD model loaded successfully");
      } catch (error) {
        console.error("Failed to load model:", error);
        setScanMessage("Je n'ai pas pu charger mon cerveau d'IA. Vérifie ta connexion internet et recharge la page.");
      } finally {
        setIsModelLoading(false);
      }
    };

    loadModel();
    
    // Cleanup function
    return () => {
      // Dispose of any tensors if needed
    };
  }, []);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResults([]);
      setScanMessage("");
    }
  };

  // Real object detection using TensorFlow
  const scanObject = async () => {
    if (!model || !imageRef.current || !canvasRef.current || !selectedImage) {
      setScanMessage("L'IA n'est pas encore prête ou aucune image n'a été sélectionnée.");
      return;
    }

    setIsScanning(true);
    setScanMessage("Je regarde attentivement...");

    try {
      // Make sure the image is loaded
      if (!imageRef.current.complete) {
        await new Promise((resolve) => {
          const onLoad = () => {
            imageRef.current?.removeEventListener('load', onLoad);
            resolve(true);
          };
          imageRef.current.addEventListener('load', onLoad);
        });
      }

      // Detect objects in the image
      const predictions = await model.detect(imageRef.current);
      
      if (predictions && predictions.length > 0) {
        // Convert to our format
        const scanResults = predictions.map(prediction => ({
          className: prediction.class,
          probability: prediction.score
        })).sort((a, b) => b.probability - a.probability);
        
        setResults(scanResults);
        
        // Display a fun educational message about the detected object
        const topObject = scanResults[0].className;
        setScanMessage(`Super ! Je vois ${topObject === 'person' ? 'une personne' : (topObject === 'car' ? 'une voiture' : `un(e) ${topObject}`)} ! ${getObjectFact(topObject)}`);
      } else {
        setScanMessage("Je ne vois pas clairement d'objet. Essaie avec une autre image ou avec un meilleur éclairage !");
        setResults([]);
      }
    } catch (error) {
      console.error("Erreur pendant la détection:", error);
      setScanMessage("Oups, j'ai eu un problème en analysant l'image. Essayons encore !");
    } finally {
      setIsScanning(false);
    }
  };

  // Generate a fun fact based on the detected object
  const getObjectFact = (objectName: string): string => {
    const facts: {[key: string]: string} = {
      person: "Les humains sont incroyables ! Savais-tu que ton cerveau contient environ 86 milliards de neurones ?",
      car: "Les voitures modernes ont généralement plus de 30 000 pièces différentes !",
      dog: "Les chiens peuvent comprendre jusqu'à 250 mots et gestes, ce qui équivaut à l'intelligence d'un enfant de 2 ans !",
      cat: "Les chats passent environ 70% de leur vie à dormir. Quel chanceux !",
      chair: "Les premières chaises ont été créées en Égypte ancienne il y a près de 5000 ans !",
      bird: "Certains oiseaux peuvent se souvenir où ils ont caché des milliers de graines mois après mois !",
      apple: "Les pommes sont des fruits délicieux pleins de vitamines ! Elles flottent dans l'eau car elles sont composées à 25% d'air.",
      banana: "Les bananes sont courbes car elles poussent à l'envers, vers le soleil !",
      book: "Les livres sont formidables pour apprendre ! Le plus grand livre du monde mesure 5 mètres de haut.",
    };
    
    return facts[objectName] || "C'est vraiment intéressant à observer et à apprendre !";
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border-4 border-kid-blue">
        {selectedImage ? (
          <div className="relative w-full h-full">
            <img 
              ref={imageRef} 
              src={selectedImage} 
              alt="Image à analyser" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <Upload size={64} className="text-gray-400 mb-4" />
            <p className="text-gray-500 text-center px-4">
              Importe une image pour commencer à explorer !
            </p>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isModelLoading}
          />
          <div className="bg-kid-blue hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> 
            Importer une image
          </div>
        </label>
        
        {selectedImage && (
          <Button 
            className="bg-kid-green hover:bg-green-700 text-white" 
            onClick={scanObject} 
            disabled={isScanning || !model}
          >
            {isScanning ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" /> Analyser l'image
              </>
            )}
          </Button>
        )}
      </div>
      
      {isModelLoading && (
        <Card className="w-full bg-kid-blue bg-opacity-20 border-kid-blue">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-5 w-5 border-2 border-kid-blue border-t-transparent rounded-full animate-spin"></div>
              <p>Chargement de l'IA en cours...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {scanMessage && (
        <Card className="w-full bg-kid-yellow bg-opacity-20 border-kid-yellow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-kid-yellow p-2 flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <p>{scanMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {results.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Ce que j'ai détecté :</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <span className="capitalize">{result.className}</span>
                <span className="bg-kid-blue text-white px-2 py-1 rounded-full text-xs">
                  {Math.round(result.probability * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectScanner;
