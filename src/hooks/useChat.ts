import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
    text: string;
    sender: 'user' | 'gemini';
}

const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const API_KEY: string = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY as string;
    const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const sendMessage = async (): Promise<void> => {
        if (input.trim() === '') return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chat.sendMessage(input);
            const response = await result.response;
            const text = response.text();
            const geminiMessage: Message = { text: text, sender: 'gemini' };
            setMessages((prevMessages) => [...prevMessages, geminiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = { text: "Une erreur est survenue.", sender: "gemini" };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return {
        messages,
        input,
        isLoading,
        chatContainerRef,
        setInput,
        sendMessage,
        handleKeyPress,
    };
};

export default useChat;
