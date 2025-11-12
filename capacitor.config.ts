import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6d10a1abd80c43b483b31b5f3aa2442f',
  appName: 'Declutterify',
  webDir: 'dist',
  server: {
    url: 'https://6d10a1ab-d80c-43b4-83b3-1b5f3aa2442f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    appendUserAgent: 'Declutterify',
    permissions: [
      'READ_MEDIA_IMAGES',
      'ACCESS_MEDIA_LOCATION'
    ]
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#FFF0F5",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
