import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Save } from 'lucide-react';

interface DrawingCanvasProps {
  onDrawingComplete: (imageData: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match parent with a 1:1 aspect ratio
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const size = Math.min(container.clientWidth, container.clientHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Set display size
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      // Initialize context
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        contextRef.current = context;
      }
    };

    // Handle resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(nativeEvent, canvas);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { offsetX, offsetY } = getCoordinates(nativeEvent, canvas);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const getCoordinates = (event: any, canvas: HTMLCanvasElement) => {
    if (event.touches) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      return { 
        offsetX: touch.clientX - rect.left, 
        offsetY: touch.clientY - rect.top 
      };
    } else {
      // Mouse event
      return { 
        offsetX: event.offsetX, 
        offsetY: event.offsetY 
      };
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    contextRef.current.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert to data URL and pass to parent
    const dataUrl = canvas.toDataURL('image/png');
    onDrawingComplete(dataUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white cursor-crosshair touch-none"
        />
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={clearCanvas}
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          Effacer
        </Button>
        <Button 
          onClick={saveDrawing}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Save size={16} />
          Reconnaitre
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
