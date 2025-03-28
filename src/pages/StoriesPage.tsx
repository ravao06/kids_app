
import React, { useState } from 'react';
import Header from '@/components/Header';
import Character from '@/components/Character';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const StoriesPage = () => {
  const [storyState, setStoryState] = useState<'start' | 'in-progress' | 'choice'>('start');
  const [storyContent, setStoryContent] = useState<string>("Il était une fois un petit robot curieux qui voulait explorer le monde...");
  const [choices, setChoices] = useState<string[]>([]);
  
  const startStory = () => {
    setStoryState('in-progress');
    setStoryContent("Il était une fois un petit robot curieux qui voulait explorer le monde. Un jour, il découvrit une porte magique qui brillait de mille feux. Il hésita un moment, ne sachant pas ce qui l'attendait de l'autre côté.");
    
    setTimeout(() => {
      setStoryState('choice');
      setChoices([
        "Le robot décide d'ouvrir la porte",
        "Le robot cherche d'abord un ami pour l'accompagner"
      ]);
    }, 5000);
  };
  
  const makeChoice = (index: number) => {
    setStoryState('in-progress');
    
    if (index === 0) {
      setStoryContent("Le petit robot rassembla tout son courage et ouvrit lentement la porte. Une lumière aveuglante l'enveloppa, et quand il put voir à nouveau, il se trouvait dans un magnifique jardin rempli de fleurs multicolores et d'étranges créatures amicales qui l'invitèrent à jouer.");
    } else {
      setStoryContent("Le petit robot décida qu'il serait plus sage de ne pas y aller seul. Il trouva son ami, un petit oiseau mécanique, et ensemble, ils ouvrirent la porte. Ils se retrouvèrent dans une forêt enchantée où les arbres chantaient doucement et où des papillons lumineux volaient autour d'eux.");
    }
    
    setTimeout(() => {
      setStoryState('choice');
      setChoices([
        "Explorer le nouvel endroit",
        "Revenir à la maison pour raconter cette découverte"
      ]);
    }, 6000);
  };
  
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
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Histoires interactives</h1>
            <p className="text-gray-600">Écoute et influence l'histoire par ta voix !</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <Character 
              message={storyState === 'start' 
                ? "Je peux te raconter une histoire et tu pourras choisir ce qui se passe ensuite !" 
                : undefined
              } 
            />
          </div>
          
          <Card className="bg-white shadow-lg border-2 border-kid-green mb-6">
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed">{storyContent}</p>
            </CardContent>
          </Card>
          
          {storyState === 'start' && (
            <div className="flex justify-center">
              <Button 
                onClick={startStory}
                className="bg-kid-green hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                Commencer l'histoire
              </Button>
            </div>
          )}
          
          {storyState === 'choice' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-4">Que doit faire notre héros ?</h3>
              <div className="flex flex-col gap-3">
                {choices.map((choice, index) => (
                  <Button 
                    key={index}
                    onClick={() => makeChoice(index)}
                    variant="outline"
                    className="border-2 border-kid-purple text-kid-purple hover:bg-kid-purple hover:text-white py-4 text-md"
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 bg-white">
        <p>AI Kid Explorer - Apprends en t'amusant !</p>
      </footer>
    </div>
  );
};

export default StoriesPage;
