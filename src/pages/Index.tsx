import { useState } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { PlatformCheck } from "@/components/PlatformCheck";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Heart, Sparkles, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
];

const Index = () => {
  const [photos, setPhotos] = useState(DEMO_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  const loadDevicePhotos = async () => {
    try {
      setIsLoadingPhotos(true);
      
      // Request multiple photos from gallery
      const images = await CapCamera.pickImages({
        quality: 90,
        limit: 50, // Allow selecting up to 50 photos
      });
      
      if (images.photos && images.photos.length > 0) {
        const photoUrls = images.photos.map(photo => photo.webPath || '');
        setPhotos(photoUrls.filter(url => url !== ''));
        setCurrentIndex(0);
        setSavedCount(0);
        setDeletedCount(0);
        setHasStarted(true);
        
        toast.success(`Loaded ${images.photos.length} photos from your device!`, {
          icon: <ImagePlus className="w-4 h-4" />,
        });
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error("Could not access photos. Please allow photo permissions.");
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setSavedCount(prev => prev + 1);
      toast.success("Photo saved!", {
        icon: <Heart className="w-4 h-4" />,
      });
    } else {
      setDeletedCount(prev => prev + 1);
      toast.error("Photo deleted", {
        icon: <Trash2 className="w-4 h-4" />,
      });
    }

    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      toast.success("All photos reviewed!", {
        icon: <Sparkles className="w-4 h-4" />,
      });
    }
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  const progress = ((currentIndex + 1) / photos.length) * 100;
  const isComplete = currentIndex >= photos.length;

  if (!hasStarted) {
    return (
      <PlatformCheck>
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Camera className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-4">
                Declutterify
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Swipe through your photos and decide what to keep or delete
              </p>
            </div>

            <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] mb-8">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                How it works
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Swipe Right</h3>
                    <p className="text-muted-foreground">Keep photos you love</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Swipe Left</h3>
                    <p className="text-muted-foreground">Delete unwanted photos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={loadDevicePhotos}
                size="lg"
                disabled={isLoadingPhotos}
                className="w-full h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ImagePlus className="w-5 h-5 mr-2" />
                {isLoadingPhotos ? "Loading Photos..." : "Load My Photos"}
              </Button>
              
              <Button 
                onClick={handleStart}
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Use Demo Photos
              </Button>
            </div>
          </div>
        </div>
      </PlatformCheck>
    );
  }

  return (
    <PlatformCheck>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-bg)' }}>
        <header className="p-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground">Declutterify</h1>
              <div className="text-sm text-muted-foreground">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Saved: {savedCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">Deleted: {deletedCount}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative">
          {!isComplete ? (
            <SwipeCard
              key={currentIndex}
              imageUrl={photos[currentIndex]}
              imageName={`Photo ${currentIndex + 1}`}
              imagePath={photos[currentIndex].includes('unsplash') ? 'Demo Photo' : 'Device Photo'}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4">
                  All Done!
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  You've reviewed all your photos
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-success/10 rounded-2xl">
                    <span className="text-card-foreground font-semibold">Photos Saved</span>
                    <span className="text-success text-2xl font-bold">{savedCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-destructive/10 rounded-2xl">
                    <span className="text-card-foreground font-semibold">Photos Deleted</span>
                    <span className="text-destructive text-2xl font-bold">{deletedCount}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setCurrentIndex(0);
                    setSavedCount(0);
                    setDeletedCount(0);
                  }}
                  className="w-full h-12 rounded-full mb-3"
                >
                  Review Again
                </Button>
                <Button
                  onClick={() => {
                    setHasStarted(false);
                    setPhotos(DEMO_PHOTOS);
                    setCurrentIndex(0);
                    setSavedCount(0);
                    setDeletedCount(0);
                  }}
                  variant="outline"
                  className="w-full h-12 rounded-full"
                >
                  Load New Photos
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </PlatformCheck>
  );
};

export default Index;
