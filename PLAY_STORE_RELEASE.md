# Declutterify - Play Store Release Guide

## App Icon Setup

The app icon has been generated at `public/app-icon.png`. For Android, you'll need multiple sizes:

### Required Icon Sizes for Android
After running `npx cap sync`, copy the icon to these directories in your `android/app/src/main/res/` folder:

- `mipmap-mdpi/ic_launcher.png` - 48x48
- `mipmap-hdpi/ic_launcher.png` - 72x72
- `mipmap-xhdpi/ic_launcher.png` - 96x96
- `mipmap-xxhdpi/ic_launcher.png` - 144x144
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192

You can use an online tool like [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate all sizes from the base icon.

## Permissions & Requirements

**Minimum Android Version:** Android 13 (API Level 33)

Add these permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Read and delete photos (Android 13+) -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION"/>
```

**Set minimum SDK version** in `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        minSdkVersion 33  // Android 13+
        targetSdkVersion 34  // Android 14
    }
}
```

**Important:** After making these changes, run:
```bash
npx cap sync android
```

The app will request permission to access and delete photos on first launch. Photos are permanently deleted when you tap the "Delete Permanently" button on the completion screen.

## Before Publishing

1. **Update version in android/app/build.gradle**
   - Change `versionCode` and `versionName`

2. **Update app name and package** (if needed)
   - Edit `capacitor.config.ts`
   - Update `appId` if you want a different package name

3. **Generate signed APK/AAB**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

4. **Test thoroughly**
   - Test on multiple Android versions
   - Test with large photo libraries
   - Verify permissions work correctly

## Play Store Listing Information

**App Name:** Declutterify

**Short Description:** 
Organize your photos with simple swipe gestures. Keep or delete photos quickly.

**Full Description:**
Declutterify helps you organize your photo library with an intuitive swipe interface. Simply load your photos, swipe right to keep them, or swipe left to mark for deletion. 

Features:
• Fast photo organization with swipe gestures
• Beautiful, modern interface
• Track saved and deleted photos
• Works offline
• No ads or subscriptions

Perfect for anyone looking to declutter their photo library quickly and efficiently.

**Category:** Photography

**Content Rating:** Everyone

**Privacy Policy:** 
All photos are processed locally on your device. No data is sent to external servers. No personal information is collected.

## Screenshots Needed
- At least 2 phone screenshots (1080x1920 recommended)
- Optional: 1 tablet screenshot
- Optional: Feature graphic (1024x500)

Take screenshots of:
1. Welcome screen
2. Photo swiping interface
3. Statistics/completion screen
