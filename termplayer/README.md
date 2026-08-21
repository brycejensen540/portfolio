# TermPlayer

A minimalist offline music player for Android that looks and feels like a
retro text terminal — bright green text on pure black, monospace font,
no clutter.

## Features

- **Scan & list** all local audio files (MP3, FLAC, WAV, M4A, OGG, etc.)
- **Play / Pause / Next / Previous** with text-based progress bar
- **Zero internet** — works completely offline, no permissions beyond storage
- **Terminal aesthetic** — CRT-green on black, monospace everywhere

## Requirements

- Android Studio Hedgehog (2023.1) or later
- Android SDK 34 (compileSdk / targetSdk)
- Min SDK 26 (Android 8.0 Oreo)

## Open & build in Android Studio

1. **File → Open** and select the `termplayer/` folder.
2. Wait for Gradle sync to finish (may download dependencies on first open).
3. Select the `app` run configuration and click **Run ▶**.

## Generate an APK

### Debug APK

```bash
cd termplayer
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (unsigned — for testing only)

```bash
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release-unsigned.apk
```

To create a signed release APK for Play Store distribution, use Android
Studio's **Build → Generate Signed Bundle / APK** wizard.

## Install the APK on a device (sideload)

1. On your phone: **Settings → Security → Unknown apps → Allow** for your
   file manager or browser.
2. Copy `app-debug.apk` to the device (USB, ADB, or cloud drive).
3. Open the file on the device and tap **Install**.

Or via ADB:

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Usage

1. Open TermPlayer. You'll see the welcome screen.
2. Tap **[SCAN]** — the app requests audio permission, then lists every
   music file on your device.
3. Tap any track to start playing.
4. Use **[PREV]**, **[NEXT]**, **[PLAY/PAUSE]** at the bottom.
5. A text progress bar shows playback position: `[=====>    ] 1:23 / 3:45`.

## Project structure

```
termplayer/
├── build.gradle.kts                # Root Gradle build
├── settings.gradle.kts             # Project settings
├── gradle.properties
├── gradle/wrapper/
│   └── gradle-wrapper.properties
├── app/
│   ├── build.gradle.kts            # App module: Compose + permissions
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml     # READ_MEDIA_AUDIO permission
│       ├── java/com/termplayer/
│       │   ├── MainActivity.kt     # Entry point
│       │   ├── Theme.kt            # Terminal colors + Material3 scheme
│       │   ├── Track.kt            # Track data class
│       │   ├── MediaScanner.kt     # MediaStore audio query
│       │   ├── PlaybackManager.kt  # MediaPlayer wrapper
│       │   └── PlayerScreen.kt     # Full UI (status, list, controls)
│       └── res/
│           ├── values/strings.xml
│           ├── values/themes.xml
│           └── drawable/ic_launcher_foreground.xml
└── README.md
```

## Tech stack

- **Kotlin** + **Jetpack Compose** (no XML layouts)
- **MediaPlayer** for local audio playback
- **MediaStore** API for device audio scanning
- **Material3** dark color scheme (green-on-black)
- No internet, no third-party libraries beyond AndroidX
