import React, { useEffect, useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import useChat from '@/hooks/useChat';
import Character from '@/components/Character';
import { robotIcons } from '@/lib/utils';
import Header from '@/components/Header';

function App() {
  const {
    messages,
    input,
    isLoading,
    chatContainerRef,
    setInput,
    sendMessage,
    handleKeyPress,
  } = useChat();

  const [icon, setIcon] = useState(robotIcons[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIcon(robotIcons[Math.floor(Math.random() * robotIcons.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Header />
      </div>
      <div className="min-h-screen flex items-center justify-center overflow-scroll">
        <div className="w-full max-w-2xl flex flex-col  mt-20 h-[500px] p-4">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4  mb-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <Character icon={icon} />
                <div className="text-lg text-gray-600">Bienvenue sur notre chat IA !</div>
                <div className="text-sm text-gray-500">N'hésitez pas à poser une question pour démarrer.</div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gray-200'
                      }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-sm p-3 ${message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <div className="flex space-x-2">
              <textarea
                value={input}
                autoFocus
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 resize-none border border-gray-200 bg-white text-gray-800 p-2 focus:outline-none min-h-[60px] max-h-32 placeholder-gray-400"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || input.trim() === ''}
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-2 flex items-center justify-center disabled:opacity-50 cursor-pointer transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Appuyez sur Entrée pour envoyer, Shift + Entrée pour nouvelle ligne</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
