# AssureDex: A Comprehensive React Native Pokémon Guide

Welcome to **AssureDex**, a robust and feature-rich React Native application designed to serve as your ultimate companion in the Pokémon universe. This app provides a modern and intuitive interface to explore various aspects of the Pokémon world, from detailed creature data to move sets, abilities, and locations.

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Running the App](#running-the-app)
* [Project Structure](#project-structure)
* [Visuals](#visuals)
* [Dependencies](#dependencies)
* [Acknowledgements](#acknowledgements)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## Features

AssureDex offers a range of functionalities to enhance your Pokémon journey:

* **Pokédex:** Comprehensive browsing and search capabilities for Pokémon, including detailed information such as IDs, types, and images.
* **Moves:** An extensive database to explore various Pokémon moves.
* **Abilities:** Detailed insights into different Pokémon abilities.
* **Items:** A catalog of items found within the Pokémon world.
* **Evolution Lines:** Dedicated section to understand Pokémon evolution paths.
* **Locations:** (Coming Soon) A guide to various regions and significant places.
* **Natures:** Information on how different natures affect Pokémon stats.
* **Type Chart:** A detailed reference for Pokémon type effectiveness.
* **Universal Search:** A powerful search bar allowing queries across multiple categories (Pokémon, Moves, Abilities, Items).
* **Clean User Interface:** Features a modern and intuitive design with vibrant gradients, custom icons, and fluid animations powered by `react-native-reanimated`.
* **Persistent Bottom Navigation:** A reusable footer component for consistent navigation across key sections (Home, Notifications, User Profile).

## Prerequisites

Before setting up the project, ensure your development environment meets the following requirements:

* **Node.js (LTS version, `>=18`):** Download from [Node.js official website](https://nodejs.org/).
* **npm** (comes with Node.js) or **Yarn**.
* **React Native CLI:**
    ```bash
    npm install -g react-native-cli
    # OR if using Yarn:
    # yarn global add react-native-cli
    ```
* **Xcode (for iOS development):** Install from the Mac App Store.
    * Ensure **Command Line Tools** are installed:
        ```bash
        xcode-select --install
        ```
* **CocoaPods (for iOS native dependencies):**
    ```bash
    sudo gem install cocoapods
    ```
* **Android Studio (for Android development):** Required for Android SDK, platform tools, and setting up an emulator. Refer to the [React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup) for detailed Android configurations.

## Installation

Follow these steps to get AssureDex up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/legs30011/Assuresoft-ReactNative-App.git](https://github.com/legs30011/Assuresoft-ReactNative-App.git)
    cd Assuresoft-ReactNative-App
    ```

2.  **Install JavaScript dependencies:**
    This command will install all packages listed in your `package.json`.
    ```bash
    npm install
    # OR if using Yarn:
    # yarn install
    ```

3.  **Install iOS native dependencies (CocoaPods):**
    ```bash
    cd ios
    pod install
    cd ..
    ```

4.  **Configure `react-native-vector-icons` (Crucial for Icons):**
    This library requires linking its font files to your native iOS and Android projects.

    a.  **Create/Verify `react-native.config.js`:**
        In the root directory of your project (where `package.json` is located), ensure you have a file named `react-native.config.js` with the following content. This configuration tells React Native where to find your custom assets and linked libraries' assets.

        ```javascript
        // react-native.config.js
        module.exports = {
          assets: [
            './node_modules/react-native-vector-icons/Fonts/', // Required for react-native-vector-icons
            './assets/fonts/', // If you have custom fonts in this directory
            // Add other asset folders here if they need explicit linking, e.g., './assets/images/'
          ],
        };
        ```

    b.  **Verify `babel.config.js`:**
        Ensure your `babel.config.js` does **NOT** contain an `assets` array. It should only define presets and plugins, with `react-native-reanimated/plugin` being the last one.

        ```javascript
        // babel.config.js
        module.exports = {
          presets: ['module:@react-native/babel-preset'],
          plugins: [
            'react-native-reanimated/plugin',
          ],
        };
        ```

    c.  **Run Autolinking:**
        From the root directory of your project, run:
        ```bash
        npx react-native link
        ```

    d.  **Manual iOS Linking Steps in Xcode (Highly Recommended if icons don't appear):**
        Even with autolinking, sometimes manual steps are needed for iOS due to caching or specific Xcode setups.

        i.  Open your project in Xcode. Navigate to `ios/YourProjectName.xcworkspace` (replace `YourProjectName` with your actual project's name, e.g., `AssureDex.xcworkspace`).
        ii. In the Project Navigator (left pane), right-click on your project's main folder (e.g., `AssureDex`) and select `Add Files to "AssureDex..."`.
        iii. Navigate to `node_modules/react-native-vector-icons/Fonts/` and select **all `.ttf` font files** (e.g., `MaterialCommunityIcons.ttf`, `FontAwesome5_Solid.ttf`, etc., depending on which icon sets you use). Click "Add". Ensure "Copy items if needed" is checked.
        iv. Select your project target (usually named `AssureDex`) in the Xcode sidebar. Go to `Build Phases` -> `Copy Bundle Resources`. Verify that all the `.ttf` files you just added are listed here. If not, add them.
        v.  Go to the `Info` tab (or open `Info.plist`). Add a new row to `Information Property List`. The key should be `UIAppFonts` (or select "Fonts provided by application"). This will create an array.
        vi. For each `.ttf` file you added, add an item to this array with its **exact filename** (e.g., `MaterialCommunityIcons.ttf`).
        vii. In Xcode, clean the build folder (`Product` > `Clean Build Folder`) and then build (`Product` > `Build`).

## Running the App

After completing the installation and linking steps, you can run the application on an emulator/simulator or a physical device:

1.  **Start the Metro Bundler:**
    This command starts the development server. Use `--reset-cache` to clear any old caches, which is highly recommended after dependency or configuration changes.
    ```bash
    npx react-native start --reset-cache
    ```

2.  **Run on iOS Simulator/Device:**
    Open a **new terminal window** (keep the Metro Bundler running in the first one) and execute:
    ```bash
    npx react-native run-ios
    ```

3.  **Run on Android Emulator/Device:**
    Open a **new terminal window** (keep the Metro Bundler running in the first one) and execute:
    ```bash
    npx react-native run-android
    ```

## Project Structure

The project adheres to a standard React Native architecture, promoting modularity and maintainability:

AssureDex/
├── src/                                  # Source code
│   ├── assets/                           # Static assets (images, fonts)
│   │   ├── backgrounds/
│   │   ├── icons/
│   │   └── trainers/
│   ├── components/                       # Reusable UI components (e.g., Footer.tsx, CustomAlertDialog.tsx)
│   ├── navigation/                       # Navigation setup and utilities (e.g., RootNavigation.ts)
│   ├── sections/                         # Individual app screens/features
│   │   ├── abilities/                    # AbilitiesScreen.tsx
│   │   ├── common/                       # Common/Utility screens (e.g., ComingSoonScreen.tsx, SearchScreen.tsx, NotificationsScreen.tsx, UserScreen.tsx)
│   │   ├── evolution/                    # EvolutionScreen.tsx
│   │   ├── homeScreen/                   # HomeScreen.tsx (Your main landing screen)
│   │   ├── items/                        # ItemsScreen.tsx
│   │   ├── locationDetailScreen/         # LocationDetailScreen.tsx
│   │   ├── moves/                        # MovesScreen.tsx
│   │   ├── natures/                      # NaturesScreen.tsx
│   │   ├── pokemonDetailScreen/          # PokemonDetailScreen.tsx
│   │   ├── pokemonList/                  # PokemonListScreen.tsx (previously named Pokemon.tsx)
│   │   └── typeChart/                    # TypeChartScreen.tsx
│   └── types/                            # TypeScript type definitions (e.g., navigation.d.ts)
├── App.tsx                               # Root component of the application (or your primary navigator setup)
├── index.js                              # Entry point for React Native
├── babel.config.js                       # Babel configuration for JavaScript transpilation
├── package.json                          # Project dependencies and scripts
├── Podfile                               # iOS dependency management (CocoaPods)
├── react-native.config.js                # React Native CLI configuration for linking native modules/assets
└── tsconfig.json                         # TypeScript configuration


## Visuals

You can easily embed screenshots or GIFs of your application within this README to provide a visual overview of its features and design.

### Image Syntax

To embed an image, use the standard Markdown syntax. It's recommended to place your screenshot images in a dedicated folder (e.g., `screenshots/`) at the root of your repository, or use a consistent path relative to your `README.md`.

```markdown
![Alt text for the image](path/to/your/image.png "Optional title on hover")
Examples
Here are the direct displays of your screenshots. These paths assume your README.md file is located at the root of your repository and your images are in src/assets/screenShots/ relative to that root.

Home Screen:

Pokédex Start (List View):

Pokémon Detail Information:

Search by Number:

Search by Word (Name):

Dependencies
Key dependencies utilized in this project (as per package.json):

@react-navigation/native: Core navigation utilities.
@react-navigation/native-stack: Native stack navigator for iOS and Android.
@react-navigation/stack: Deprecated in favor of native-stack but often used for common patterns or older projects. (Consider migrating to native-stack if not already fully done).
axios: Promise-based HTTP client for making API requests (e.g., to PokeAPI).
react: The core React library.
react-native: The core React Native framework.
react-native-gesture-handler: Provides native-driven gesture management.
react-native-linear-gradient: For customizable gradient backgrounds.
react-native-progress: For progress indicators.
react-native-reanimated: For highly performant native-driven animations.
react-native-reanimated-carousel: For animated carousel components.
react-native-safe-area-context: Provides utilities to handle safe area insets.
react-native-screens: Optimizes memory usage and performance for screens.
react-native-vector-icons: Customizable icons.
react-native-svg: If you are using SVG images directly in your components.
Acknowledgements
PokeAPI: This project heavily relies on data provided by PokeAPI, a free and open-source RESTful API that provides access to a vast amount of Pokémon data. We extend our gratitude for their invaluable resource.
Troubleshooting
Encountering issues during development is common. Here are solutions for frequently observed problems:

"Error: Text string must be rendered within a <Text> component"
Problem: You have plain text content directly inside a View or another component that is not a Text component. React Native requires all textual content to be encapsulated within a <Text> component.
Solution: Wrap all text strings in a <Text> component.

JavaScript

// Incorrect:
<View>My text here</View>

// Correct:
<View><Text>My text here</Text></View>
Icons showing as ? or squares
Problem: This is a common issue with react-native-vector-icons and indicates that the font files are not correctly linked to your native iOS or Android project.
Solution: Carefully re-check all steps in the "Configure react-native-vector-icons" section above, especially the manual steps for iOS in Xcode. After making changes, a thorough clean and rebuild are essential.

Bash

cd ios && pod install && cd .. # Reinstall pods for iOS
# Then perform a full clean and restart (see below)
Invariant Violation: requireNativeComponent: 'RNCWebView' was not found / Similar native module errors
Problem: This error occurs when a native module (like react-native-webview or others) is not correctly linked or compiled into your native app.
Solution:

Ensure the library is properly installed (npm install your-library).
Verify react-native.config.js is correctly configured for the library (though many newer libraries autolink without explicit entries).
Often fixed by a full clean and cache reset:
Bash

# Perform the full clean and restart steps (see below)
Build failures after npm install or pod install
Problem: Corrupted caches or inconsistent dependency states can lead to build failures.
Solution: Execute a comprehensive clean and reinstall process. This is the most reliable way to ensure a fresh state for your project.

Bash

# 1. Close all running Metro Bundler terminals and Xcode/Android Studio instances.
# 2. Navigate to your project's root directory in your terminal.

# 3. Clean node_modules
rm -rf node_modules

# 4. Clear Metro Bundler caches
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# 5. Clear npm/Yarn cache
npm cache clean --force # Or 'yarn cache clean --all' if using Yarn

# 6. Reset Watchman (if used)
watchman watch-del-all

# 7. Reinstall JavaScript dependencies
npm install # Or 'yarn install'

# 8. For iOS: Clean Pods and reinstall
cd ios
rm Podfile.lock # Delete Podfile.lock to force a fresh install
rm -rf Pods     # Delete Pods directory
pod install     # Reinstall pods
cd ..

# 9. For Android: Clean Android build
cd android
./gradlew clean # On Windows: 'gradlew clean'
cd ..

# 10. Start the Metro Bundler with a fresh cache
npx react-native start --reset-cache

# 11. Rebuild and run your app
# For iOS: npx react-native run-ios
# For Android: npx react-native run-android
License
This project is licensed under the MIT License - see the LICENSE file for details.
&lt;/immersive>