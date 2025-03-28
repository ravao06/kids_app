import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import Character from "./Character";
import { InferenceClient } from "@huggingface/inference";

// Définition des types pour la Web Speech API
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

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantMessage, setAssistantMessage] = useState(
    "Salut ! Je suis ton assistant. Parle-moi et je te répondrai !"
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Crée une instance du client Hugging Face
  const client = new InferenceClient(import.meta.env.VITE_HF_API_KEY);  

  const cleanTextForSpeech = (text: string) => {
    // Remplacer les caractères spéciaux comme les astérisques (**) et les tirets (-) par des espaces ou les supprimer
    let cleanedText = text.replace(/\*\*/g, ""); // Supprime les ** 
    cleanedText = cleanedText.replace(/-/g, " "); // Remplace les - par un espace
    return cleanedText;
  };

  // Fonction pour faire parler l'assistant
  const speak = (text: string) => {
    const cleanedText = cleanTextForSpeech(text); // Nettoyer le texte avant de le lire
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = "fr-FR";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("La synthèse vocale n'est pas supportée sur ce navigateur.");
    }
  };

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "fr-FR";

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const speechResult = event.results[current][0].transcript;
          setTranscript(speechResult);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcript) {
            respondToSpeech(transcript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Erreur de reconnaissance vocale", event.error);
          setIsListening(false);
          setAssistantMessage("Je n'ai pas bien entendu. Peux-tu réessayer ?");
        };
      }
    } else {
      setAssistantMessage(
        "Ton navigateur ne prend pas en charge la reconnaissance vocale. Essaie avec Chrome ou Edge !"
      );
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (transcript && !isListening) {
      respondToSpeech(transcript);
    }
  }, [transcript, isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Erreur lors du démarrage de la reconnaissance vocale", error);
        setAssistantMessage("Il y a eu un problème avec la reconnaissance vocale. Recharge la page et réessaie.");
      }
    }
  };

  // Fonction de réponse de l'assistant en utilisant l'API Hugging Face
  const respondToSpeech = async (text: string) => {
    const lowerText = text.toLowerCase();
    let response = "C'est une question intéressante ! J'apprends encore beaucoup de choses.";

    try {
      const chatCompletion = await client.chatCompletion({
        provider: "nebius",
        model: "deepseek-ai/DeepSeek-V3-0324", 
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 500,
      });

      if (chatCompletion.choices && chatCompletion.choices[0]) {
        response = chatCompletion.choices[0].message.content;
      } else {
        response = "Je n'ai pas pu trouver une réponse appropriée.";
      }

      setAssistantMessage(response);
      speak(response);

    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Hugging Face", error);
      setAssistantMessage("Je n'ai pas pu obtenir de réponse. Peux-tu réessayer ?");
      speak("Je n'ai pas pu obtenir de réponse. Peux-tu réessayer ?");
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
                isListening ? "bg-kid-red hover:bg-red-700" : "bg-kid-purple hover:bg-purple-700"
              }`}
            >
              {isListening ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
            </Button>

            <p className="mt-4 text-center text-gray-600">
              {isListening ? "J'écoute... Parle-moi !" : "Appuie sur le micro pour me parler"}
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

// Déclaration globale pour SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default VoiceAssistant;
