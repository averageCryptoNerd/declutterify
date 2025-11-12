import { useState, useRef } from "react";
import { X, Heart } from "lucide-react";

interface SwipeCardProps {
  imageUrl: string;
  imageName?: string;
  imagePath?: string;
  onSwipe: (direction: "left" | "right") => void;
}

export const SwipeCard = ({ imageUrl, imageName, imagePath, onSwipe }: SwipeCardProps) => {
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
    
    const threshold = 100; // Fixed threshold instead of percentage
    
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

  const opacity = Math.abs(position.x) / 100;
  const showKeep = position.x > 50;
  const showDelete = position.x < -50;

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="flex-1 relative">
        <div
          ref={cardRef}
          className="absolute inset-0 transition-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full bg-card">
            <img
              src={imageUrl}
              alt="Photo to review"
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          
            {showKeep && (
              <div 
                className="absolute top-12 right-8 border-[6px] border-success rounded-3xl px-8 py-4 rotate-12 shadow-2xl bg-card/20 backdrop-blur-sm"
                style={{ opacity: Math.min(opacity, 1) }}
              >
                <span className="text-success text-5xl font-black tracking-wider">KEEP</span>
              </div>
            )}
          
            {showDelete && (
              <div 
                className="absolute top-12 left-8 border-[6px] border-destructive rounded-3xl px-8 py-4 -rotate-12 shadow-2xl bg-card/20 backdrop-blur-sm"
                style={{ opacity: Math.min(opacity, 1) }}
              >
                <span className="text-destructive text-5xl font-black tracking-wider">DELETE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {(imageName || imagePath) && (
        <div className="absolute bottom-32 left-0 right-0 px-6 z-10 pointer-events-none">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-border/50">
            {imageName && (
              <div className="text-card-foreground font-semibold truncate text-base">
                {imageName}
              </div>
            )}
            {imagePath && (
              <div className="text-muted-foreground text-sm truncate mt-1">
                {imagePath}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 z-10">
        <button
          onClick={() => handleButtonClick("left")}
          className="w-20 h-20 rounded-full bg-card shadow-[0_10px_40px_-10px_rgba(239,68,68,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-destructive/30 hover:border-destructive/50"
          aria-label="Delete photo"
        >
          <X className="w-10 h-10 text-destructive" strokeWidth={3} />
        </button>
        <button
          onClick={() => handleButtonClick("right")}
          className="w-20 h-20 rounded-full bg-card shadow-[0_10px_40px_-10px_rgba(34,197,94,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-success/30 hover:border-success/50"
          aria-label="Keep photo"
        >
          <Heart className="w-10 h-10 text-success fill-success" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
