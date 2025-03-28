
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ActivityCard from '@/components/ActivityCard';
import Character from '@/components/Character';

const Index = () => {
  const activities = [
    {
      title: "Scanner d'objets",
      description: "Prends un objet en photo et apprends ce que c'est !",
      icon: "📸",
      color: "kid-blue",
      route: "/scanner"
    },
    {
      title: "Assistant vocal",
      description: "Pose-moi des questions et je te répondrai !",
      icon: "🎤",
      color: "kid-purple",
      route: "/voice"
    },
    {
      title: "Reconnaissance de dessins",
      description: "Dessine quelque chose et je devinerai ce que c'est !",
      icon: "🎨",
      color: "kid-pink",
      route: "/drawing"
    },
    {
      title: "Histoires interactives",
      description: "Écoute des histoires et influence l'intrigue !",
      icon: "📚",
      color: "kid-green",
      route: "/stories"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Bienvenue sur AI Kid Explorer !</h1>
            <p className="text-xl text-gray-600">Un monde d'apprentissage t'attend !</p>
          </div>
          
          <div className="flex justify-center mb-12">
            <Character message="Salut ! Je suis Robo, ton compagnon d'exploration. Que veux-tu faire aujourd'hui ?" />
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Activités</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                description={activity.description}
                icon={activity.icon}
                color={activity.color}
                route={activity.route}
              />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 bg-white">
        <p>AI Kid Explorer - Apprends en t'amusant !</p>
      </footer>
    </div>
  );
};

export default Index;
