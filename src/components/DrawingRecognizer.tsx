
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Character from './Character';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

interface Prediction {
  className: string;
  probability: number;
}

const DrawingRecognizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [characterMessage, setCharacterMessage] = useState<string>("Dessine quelque chose et je vais essayer de deviner ce que c'est !");
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [hasDrawnSomething, setHasDrawnSomething] = useState(false);
  
  // Load TensorFlow MobileNet model
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      try {
        // Make sure TensorFlow is ready
        await tf.ready();
        console.log("TensorFlow.js is ready");
        
        // Load MobileNet model
        const loadedModel = await mobilenet.load({
          version: 2,
          alpha: 1.0
        });
        setModel(loadedModel);
        console.log("MobileNet model loaded successfully");
      } catch (error) {
        console.error("Failed to load model:", error);
        setCharacterMessage("Je n'ai pas pu charger mon cerveau d'IA. Vérifie ta connexion internet et recharge la page.");
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
  
  // Initialiser le canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        setCtx(context);
      }
      
      // Ajuster la taille du canvas
      function resizeCanvas() {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          
          // Réinitialiser le contexte après redimensionnement
          if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = 'black';
            context.lineWidth = 5;
            // Fill canvas with white background
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, []);
  
  // Gérer le dessin
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawnSomething(true);
    
    if (ctx) {
      let x, y;
      
      if ('touches' in e) {
        // Event de toucher
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }
      } else {
        // Event de souris
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      if (x !== undefined && y !== undefined) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    if (ctx) {
      let x, y;
      
      if ('touches' in e) {
        // Event de toucher
        e.preventDefault(); // Empêcher le scroll pendant le dessin
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }
      } else {
        // Event de souris
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      if (x !== undefined && y !== undefined) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.closePath();
  };
  
  // Fonction pour effacer le dessin
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setPredictions([]);
      setHasDrawnSomething(false);
      setCharacterMessage("Dessine quelque chose et je vais essayer de deviner ce que c'est !");
    }
  };
  
  // Fonction pour analyser le dessin avec TensorFlow
  const analyzeDrawing = async () => {
    if (!model || !canvasRef.current) {
      setCharacterMessage("Je ne suis pas encore prêt à analyser ton dessin, attends un peu.");
      return;
    }
    
    setCharacterMessage("Hmm, je réfléchis à ce que tu as dessiné...");
    
    try {
      // Create a tensor from the canvas with correct typing for MobileNet
      const imageTensor = tf.browser.fromPixels(canvasRef.current)
        .resizeNearestNeighbor([224, 224]) // resize to mobilenet input size
        .toFloat()
        .expandDims();
      
      // Get predictions - ensure we're passing a tensor that MobileNet can process
      const mobilenetPredictions = await model.classify(imageTensor as tf.Tensor3D);
      
      // Cleanup tensor
      imageTensor.dispose();
      
      if (mobilenetPredictions && mobilenetPredictions.length > 0) {
        setPredictions(mobilenetPredictions);
        
        // Get the top prediction
        const topPrediction = mobilenetPredictions[0];
        const formattedPrediction = formatPredictionName(topPrediction.className);
        
        setCharacterMessage(`Je pense que tu as dessiné ${formattedPrediction} ! ${getRandomEncouragement()} Tu veux essayer de dessiner autre chose ?`);
      } else {
        setCharacterMessage("Je n'arrive pas bien à voir ce que c'est. Peux-tu ajouter plus de détails ?");
      }
    } catch (error) {
      console.error("Error analyzing drawing:", error);
      setCharacterMessage("Oups ! J'ai eu un problème en analysant ton dessin. Essayons encore !");
    }
  };

  // Format prediction name to be more kid-friendly
  const formatPredictionName = (name: string): string => {
    // Extract the main part of the prediction (remove technical descriptions)
    const mainName = name.split(',')[0].toLowerCase();
    
    // Add French article
    const vowels = ['a', 'e', 'i', 'o', 'u', 'é', 'è', 'ê', 'à'];
    const startsWithVowel = vowels.some(vowel => mainName.startsWith(vowel));
    
    return startsWithVowel ? `un ${mainName}` : `un ${mainName}`;
  };

  // Get random encouragement message
  const getRandomEncouragement = (): string => {
    const encouragements = [
      "C'est magnifique ! 🎨",
      "Tu dessines super bien !",
      "Quel talent artistique !",
      "C'est très impressionnant !",
      "J'adore ton style !",
      "Tu es vraiment créatif(ve) !",
      "Bravo pour ton dessin !"
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };
  
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <Character message={characterMessage} />
      
      <div className="w-full relative">
        <canvas
          ref={canvasRef}
          className="border-4 border-kid-pink rounded-lg bg-white w-full aspect-square touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        ></canvas>

        {isModelLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-kid-purple border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-kid-purple font-medium">Chargement de mon cerveau d'IA...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 w-full">
        <Button
          onClick={clearCanvas}
          variant="outline"
          className="border-2 border-kid-red text-kid-red hover:bg-kid-red hover:text-white flex-1"
        >
          Effacer
        </Button>
        
        <Button
          onClick={analyzeDrawing}
          className="bg-kid-green hover:bg-green-700 text-white flex-1"
          disabled={!hasDrawnSomething || !model || isModelLoading}
        >
          Devine ce que j'ai dessiné !
        </Button>
      </div>
      
      {predictions.length > 0 && (
        <Card className="w-full bg-kid-purple bg-opacity-20 border-kid-purple">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-kid-purple p-2 flex-shrink-0">
                <span className="text-xl">✨</span>
              </div>
              <div className="w-full">
                <p className="font-semibold">Je pense que c'est...</p>
                <p className="text-lg capitalize">{formatPredictionName(predictions[0].className)} !</p>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Autres possibilités :</p>
                  {predictions.slice(1, 3).map((pred, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{formatPredictionName(pred.className)}</span>
                      <span className="bg-kid-purple bg-opacity-20 text-kid-purple px-2 py-0.5 rounded-full text-xs">
                        {Math.round(pred.probability * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DrawingRecognizer;
