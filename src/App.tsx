
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScannerPage from "./pages/ScannerPage";
import VoicePage from "./pages/VoicePage";
import DrawingPage from "./pages/DrawingPage";
import StoriesPage from "./pages/StoriesPage";
import NotFound from "./pages/NotFound";
import TalkAIPage from "./pages/TalkAIPage";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/drawing" element={<DrawingPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/talk-ai" element={<TalkAIPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
