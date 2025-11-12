import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { PlatformCheck } from "@/components/PlatformCheck";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Heart, Sparkles, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

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
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  const loadDevicePhotos = async () => {
    try {
      setIsLoadingPhotos(true);
      setLoadingProgress({ current: 0, total: 0 });
      
      // Use pickImages - user can select multiple/all photos
      const result = await CapCamera.pickImages({
        quality: 90,
        limit: 0, // No limit
      });
      
      if (result.photos && result.photos.length > 0) {
        const totalPhotos = result.photos.length;
        setLoadingProgress({ current: 0, total: totalPhotos });
        
        const photoUrls: string[] = [];
        
        // Process photos with progress updates
        for (let i = 0; i < result.photos.length; i++) {
          const photo = result.photos[i];
          if (photo.webPath) {
            photoUrls.push(photo.webPath);
          }
          setLoadingProgress({ current: i + 1, total: totalPhotos });
          
          // Small delay to show progress for UX
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        setPhotos(photoUrls);
        setCurrentIndex(0);
        setSavedCount(0);
        setDeletedCount(0);
        setHasStarted(true);
        
        await Haptics.impact({ style: ImpactStyle.Medium });
        
        toast.success(`Loaded ${photoUrls.length} photos!`, {
          icon: <ImagePlus className="w-4 h-4" />,
        });
      } else {
        toast.error("No photos selected");
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error("Could not access photos. Please check permissions.");
    } finally {
      setIsLoadingPhotos(false);
      setLoadingProgress({ current: 0, total: 0 });
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    // Haptic feedback based on direction
    if (direction === "right") {
      await Haptics.impact({ style: ImpactStyle.Light });
      setSavedCount(prev => prev + 1);
      toast.success("Photo saved!", {
        icon: <Heart className="w-4 h-4" />,
      });
    } else {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      setDeletedCount(prev => prev + 1);
      toast.error("Photo deleted", {
        icon: <Trash2 className="w-4 h-4" />,
      });
    }

    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      await Haptics.notification({ type: NotificationType.Success });
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
              <p className="text-lg text-muted-foreground">
                Swipe to organize your photos
              </p>
            </div>

            {isLoadingPhotos && loadingProgress.total > 0 && (
              <div className="mb-6 bg-card rounded-2xl p-6 shadow-[var(--shadow-card)]">
                <p className="text-card-foreground font-semibold mb-3">
                  Loading photos...
                </p>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {loadingProgress.current} / {loadingProgress.total} photos
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                onClick={loadDevicePhotos}
                size="lg"
                disabled={isLoadingPhotos}
                className="w-full h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ImagePlus className="w-5 h-5 mr-2" />
                {isLoadingPhotos ? "Loading..." : "Load Photos"}
              </Button>
              
              <Button 
                onClick={handleStart}
                size="lg"
                variant="outline"
                className="w-full h-14 text-lg rounded-full"
              >
                Try Demo
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
