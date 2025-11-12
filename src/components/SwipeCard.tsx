import { useState, useRef } from "react";
import { X, Heart } from "lucide-react";

interface SwipeCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
}

export const SwipeCard = ({ imageUrl, onSwipe }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startPos.current = {
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const newX = e.touches[0].clientX - startPos.current.x;
    const newY = e.touches[0].clientY - startPos.current.y;
    
    setPosition({ x: newX, y: newY });
    setRotation(newX * 0.1);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.3;
    
    if (Math.abs(position.x) > threshold) {
      const direction = position.x > 0 ? "right" : "left";
      animateSwipeOut(direction);
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const animateSwipeOut = (direction: "left" | "right") => {
    const exitX = direction === "right" ? window.innerWidth : -window.innerWidth;
    setPosition({ x: exitX, y: position.y });
    setRotation(direction === "right" ? 30 : -30);
    
    setTimeout(() => {
      onSwipe(direction);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }, 300);
  };

  const handleButtonClick = (direction: "left" | "right") => {
    animateSwipeOut(direction);
  };

  const opacity = Math.abs(position.x) / (window.innerWidth * 0.3);
  const showKeep = position.x > 50;
  const showDelete = position.x < -50;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={cardRef}
        className="absolute w-[90%] max-w-md h-[70vh] transition-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[var(--shadow-card)] bg-card">
          <img
            src={imageUrl}
            alt="Photo to review"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
          
          {showKeep && (
            <div 
              className="absolute top-8 right-8 border-4 border-success rounded-2xl px-6 py-3 rotate-12"
              style={{ opacity: Math.min(opacity, 1) }}
            >
              <span className="text-success text-4xl font-bold">KEEP</span>
            </div>
          )}
          
          {showDelete && (
            <div 
              className="absolute top-8 left-8 border-4 border-destructive rounded-2xl px-6 py-3 -rotate-12"
              style={{ opacity: Math.min(opacity, 1) }}
            >
              <span className="text-destructive text-4xl font-bold">DELETE</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-10">
        <button
          onClick={() => handleButtonClick("left")}
          className="w-16 h-16 rounded-full bg-card shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border-2 border-destructive/20"
        >
          <X className="w-8 h-8 text-destructive" />
        </button>
        <button
          onClick={() => handleButtonClick("right")}
          className="w-16 h-16 rounded-full bg-card shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border-2 border-success/20"
        >
          <Heart className="w-8 h-8 text-success fill-success" />
        </button>
      </div>
    </div>
  );
};
