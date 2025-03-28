import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DrawingCanvas from '@/components/DrawingCanvas';
import ThreeDRenderer from '@/components/ThreeDRenderer';
import drawingRecognitionService from '@/service/drawingRecognitionService';
import voiceService from '@/service/voiceService';
import Character from "./Character";

const DrawingRecognizer: React.FC = () => {
  const [recognizedObject, setRecognizedObject] = useState<string | null>(null);
  const [characterMessage, setCharacterMessage] = useState<string>("Dessine quelque chose et je vais essayer de deviner ce que c'est !");
  const [isLoading, setIsLoading] = useState(false);

  const handleDrawingComplete = async (imageData: string) => {
    setIsLoading(true);
    try {
      // Utilisation de la reconnaissance réelle avec le modèle Teachable Machine
      const result = await drawingRecognitionService.recognizeDrawing(imageData);
      setRecognizedObject(result);
      
      // Annonce du résultat avec la voix
      voiceService.announceRecognition(result);
    } catch (error) {
      console.error('Error recognizing drawing:', error);
      setRecognizedObject(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <Character message={characterMessage} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Dessinez ici!</CardTitle>
            <CardDescription>
              Dessinez une forme simple (cercle, carré, étoile, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Résultat en 3D</CardTitle>
            <CardDescription>
              {isLoading 
                ? "Analyse en cours..." 
                : recognizedObject 
                  ? `Objet reconnu: ${recognizedObject}` 
                  : "Dessinez quelque chose pour voir le résultat en 3D"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <span className="loader mb-2"></span>
                <p className="text-gray-500">Analyse du dessin...</p>
              </div>
            ) : (
              <ThreeDRenderer modelType={recognizedObject} />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Dessinez une forme, puis cliquez sur "Reconnaitre" pour voir la transformation 3D et entendre la description vocale.
        </p>
      </div>
    </div>
  );
};

export default DrawingRecognizer;
