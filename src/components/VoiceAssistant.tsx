
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import Character from './Character';

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

// Create constructor type
interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("Salut ! Je suis ton assistant. Parle-moi et je te répondrai !");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize Web Speech API
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Browser supports speech recognition
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition as SpeechRecognitionConstructor;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR'; // Set French as the language
        
        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const speechResult = event.results[current][0].transcript;
          setTranscript(speechResult);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          // Respond to speech if we have a transcript
          if (transcript) {
            respondToSpeech(transcript);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setAssistantMessage("Je n'ai pas bien entendu. Peux-tu réessayer ?");
        };
      }
    } else {
      // Browser doesn't support speech recognition
      setAssistantMessage("Ton navigateur ne prend pas en charge la reconnaissance vocale. Essaie avec Chrome ou Edge !");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Handle transcript changes to respond to speech
  useEffect(() => {
    if (transcript && !isListening) {
      respondToSpeech(transcript);
    }
  }, [transcript, isListening]);
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript("");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Error starting speech recognition', error);
          setAssistantMessage("Il y a eu un problème avec la reconnaissance vocale. Recharge la page et réessaie.");
        }
      }
    }
  };
  
  // Respond to speech with educational content
  const respondToSpeech = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("ciel") && lowerText.includes("bleu")) {
      setAssistantMessage("Le ciel est bleu parce que la lumière du soleil est composée de toutes les couleurs, mais l'air diffuse davantage la couleur bleue que les autres couleurs. C'est un peu comme si l'air jouait à attraper les rayons bleus !");
    } 
    else if (lowerText.includes("bébés") && lowerText.includes("grenouille")) {
      setAssistantMessage("Les bébés grenouilles s'appellent des têtards ! Ils ressemblent à de petits poissons avec une grosse tête et une queue. Puis ils se transforment peu à peu en grenouilles !");
    }
    else if (lowerText.includes("planète") && (lowerText.includes("grande") || lowerText.includes("grosse"))) {
      setAssistantMessage("La plus grande planète de notre système solaire est Jupiter ! Elle est tellement immense qu'on pourrait y faire tenir plus de 1300 Terres !");
    }
    else if (lowerText.includes("dinosaure")) {
      setAssistantMessage("Les dinosaures sont fascinants ! Ils ont vécu il y a très longtemps, certains étaient énormes comme le Diplodocus, d'autres féroces comme le T-Rex. Quel est ton dinosaure préféré ?");
    }
    else {
      setAssistantMessage("C'est une question intéressante ! J'apprends encore beaucoup de choses. Peux-tu me demander autre chose ?");
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <Character message={assistantMessage} />
      
      <Card className="w-full border-2 border-kid-purple">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Button
              onClick={toggleListening}
              className={`rounded-full p-6 transition-colors ${
                isListening 
                  ? "bg-kid-red hover:bg-red-700" 
                  : "bg-kid-purple hover:bg-purple-700"
              }`}
            >
              {isListening ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </Button>
            
            <p className="mt-4 text-center text-gray-600">
              {isListening 
                ? "J'écoute... Parle-moi !" 
                : "Appuie sur le micro pour me parler"
              }
            </p>
            
            {transcript && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full">
                <p className="italic text-gray-700">"{transcript}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Update the TypeScript interface to correctly reference our defined types
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default VoiceAssistant;
