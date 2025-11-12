import { useState, useEffect } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { PlatformCheck } from "@/components/PlatformCheck";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Heart, Sparkles, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Media } from '@capacitor-community/media';


const Index = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [photosPaths, setPhotosPaths] = useState<string[]>([]);

  const loadDevicePhotos = async () => {
    try {
      setIsLoadingPhotos(true);
      setLoadingProgress({ current: 0, total: 0 });
      
      // Get all photos from the device
      const result = await Media.getMedias({
        quantity: 0, // Get all photos
        types: "photos"
      });
      
      if (result.medias && result.medias.length > 0) {
        const totalPhotos = result.medias.length;
        setLoadingProgress({ current: 0, total: totalPhotos });
        
        const photoUrls: string[] = [];
        const photoPaths: string[] = [];
        
        // Process photos with progress updates
        for (let i = 0; i < result.medias.length; i++) {
          const media = result.medias[i];
          if (media.identifier) {
            // Use the media identifier/uri
            photoUrls.push(media.identifier);
            photoPaths.push(media.identifier);
          }
          setLoadingProgress({ current: i + 1, total: totalPhotos });
          
          // Small delay to show progress for UX
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        setPhotos(photoUrls);
        setPhotosPaths(photoPaths);
        setCurrentIndex(0);
        setSavedCount(0);
        setDeletedCount(0);
        setPhotosToDelete([]);
        setHasStarted(true);
        
        await Haptics.impact({ style: ImpactStyle.Medium });
        
        toast.success(`Loaded ${photoUrls.length} photos!`, {
          icon: <ImagePlus className="w-4 h-4" />,
        });
      } else {
        toast.error("No photos found on device");
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error("Could not access photos. Please check permissions in your device settings.");
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
      // Track photo for deletion
      const photoPath = photosPaths[currentIndex];
      if (photoPath && !photoPath.includes('unsplash')) {
        setPhotosToDelete(prev => [...prev, photoPath]);
      }
      
      await Haptics.impact({ style: ImpactStyle.Heavy });
      setDeletedCount(prev => prev + 1);
      toast.error("Marked for deletion", {
        icon: <Trash2 className="w-4 h-4" />,
        description: "Photo will be removed from your device"
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


  const progress = ((currentIndex + 1) / photos.length) * 100;
  const isComplete = currentIndex >= photos.length;

  if (!hasStarted) {
    return (
      <PlatformCheck>
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
          <div className="max-w-md w-full">
            <div className="text-center mb-12">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl"></div>
                <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-card)]">
                  <Camera className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">
                Declutterify
              </h1>
              <p className="text-xl text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Swipe through your photos and decide what to keep
              </p>
            </div>

            {isLoadingPhotos && loadingProgress.total > 0 ? (
              <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <p className="text-card-foreground font-semibold text-lg">
                    Loading your photos...
                  </p>
                </div>
                <div className="w-full h-4 bg-secondary rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                    style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {loadingProgress.current} of {loadingProgress.total} photos loaded
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Button 
                  onClick={loadDevicePhotos}
                  size="lg"
                  disabled={isLoadingPhotos}
                  className="w-full h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  <ImagePlus className="w-6 h-6 mr-3" />
                  Select Photos to Organize
                </Button>
                
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    <span className="font-semibold text-foreground">Tip:</span> You can select as many photos as you want. Swipe right to keep, left to mark for deletion.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PlatformCheck>
    );
  }

  return (
    <PlatformCheck>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-bg)' }}>
        <header className="p-6 pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-3xl font-bold text-foreground">Declutterify</h1>
              <div className="px-4 py-2 bg-card rounded-full border border-border/50 shadow-sm">
                <span className="text-sm font-semibold text-foreground">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden shadow-inner mb-5">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between gap-3">
              <div className="flex-1 flex items-center gap-2 bg-success/10 px-4 py-3 rounded-xl border border-success/20">
                <Heart className="w-5 h-5 text-success flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Saved</span>
                  <span className="text-lg font-bold text-success">{savedCount}</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">
                <Trash2 className="w-5 h-5 text-destructive flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Deleted</span>
                  <span className="text-lg font-bold text-destructive">{deletedCount}</span>
                </div>
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
              <div className="max-w-md w-full bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center border border-border/50">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-card-foreground mb-3">
                  All Done!
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  You've reviewed all {photos.length} photos
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center p-5 bg-success/10 rounded-2xl border border-success/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-card-foreground font-semibold">Kept</span>
                    </div>
                    <span className="text-success text-3xl font-bold">{savedCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-destructive/10 rounded-2xl border border-destructive/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </div>
                      <span className="text-card-foreground font-semibold">Marked for Deletion</span>
                    </div>
                    <span className="text-destructive text-3xl font-bold">{deletedCount}</span>
                  </div>
                </div>
                {photosToDelete.length > 0 && (
                  <div className="p-5 bg-accent/10 rounded-2xl mb-6 border border-accent/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-card-foreground font-semibold">
                        Next Step
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left leading-relaxed">
                      To permanently remove the {photosToDelete.length} deleted photos, open your device's Photos app and empty the "Recently Deleted" folder.
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setCurrentIndex(0);
                      setSavedCount(0);
                      setDeletedCount(0);
                    }}
                    className="w-full h-14 rounded-2xl text-base font-semibold"
                  >
                    Review Again
                  </Button>
                  <Button
                    onClick={() => {
                      setHasStarted(false);
                      setPhotos([]);
                      setPhotosPaths([]);
                      setCurrentIndex(0);
                      setSavedCount(0);
                      setDeletedCount(0);
                      setPhotosToDelete([]);
                    }}
                    variant="outline"
                    className="w-full h-14 rounded-2xl text-base font-semibold"
                  >
                    Organize More Photos
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PlatformCheck>
  );
};

export default Index;
