import { useEffect, useState } from "react";
import { Smartphone, AlertCircle } from "lucide-react";

export const PlatformCheck = ({ children }: { children: React.ReactNode }) => {
  const [isAndroid, setIsAndroid] = useState(true);

  useEffect(() => {
    const checkPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroidDevice = /android/.test(userAgent);
      setIsAndroid(isAndroidDevice);
    };

    checkPlatform();
  }, []);

  if (!isAndroid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-card-foreground mb-4">
            Android Only
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Declutterify is exclusively designed for Android devices. Please access this app from an Android phone or tablet.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Android Required</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
