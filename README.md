AssureDex React Native Pokémon App
Welcome to AssureDex, a React Native application designed to provide a comprehensive guide to the Pokémon universe. This app aims to be a functional Pokédex, along with sections for Moves, Abilities, Items, Parties, Locations, Natures, and Type Charts.

Table of Contents
Features

Prerequisites

Installation

Running the App

Project Structure

Visuals (Adding Images to README)

Dependencies

Troubleshooting

Features
Pokédex: Browse and search for Pokémon.

Moves: Explore various Pokémon moves.

Abilities: Learn about different Pokémon abilities.

Items: Discover items in the Pokémon world.

Parties: (Coming Soon) Manage your Pokémon teams.

Locations: (Coming Soon) Explore different regions and places.

Natures: Understand the effects of Pokémon natures.

Type Chart: A detailed guide on Pokémon type effectiveness.

Clean User Interface: A modern and intuitive design with gradients and custom icons.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (>=18): Download Node.js

npm (comes with Node.js) or Yarn

React Native CLI:

npm install -g react-native-cli

Xcode (for iOS development): Install from the Mac App Store. Ensure Command Line Tools are installed (xcode-select --install).

CocoaPods (for iOS native dependencies):

sudo gem install cocoapods

Installation
Follow these steps to set up the project locally:

Clone the repository:

git clone https://github.com/legs30011/Assuresoft-ReactNative-App.git
cd Assuresoft-ReactNative-App

Install JavaScript dependencies:
This command will install all packages listed in your package.json.

npm install
# OR if using Yarn:
# yarn install

Install iOS native dependencies (CocoaPods):

cd ios
pod install
cd ..

Configure react-native-vector-icons (Crucial for Icons):
This library requires linking its font files to your native iOS project.

a.  Create/Verify react-native.config.js:
In the root directory of your project (where package.json is located), ensure you have a file named react-native.config.js with the following content:
javascript module.exports = { assets: ['./node_modules/react-native-vector-icons/Fonts/'], }; 

b.  Run Autolinking:
From the root directory of your project, run:
bash npx react-native link 

c.  Manual iOS Linking Steps in Xcode (Highly Recommended if icons don't appear):
Even with autolinking, sometimes manual steps are needed for iOS.

i.  Open your project in Xcode. Navigate to `ios/YourProjectName.xcworkspace`.
ii. In the Project Navigator (left pane), right-click on your project's main folder (e.g., `AssureDex`) and select `Add Files to "AssureDex..."`.
iii. Navigate to `node_modules/react-native-vector-icons/Fonts/` and select **all `.ttf` font files** (e.g., `MaterialCommunityIcons.ttf`, `FontAwesome5_Solid.ttf`, etc., depending on which icon sets you use). Click "Add". Ensure "Copy items if needed" is checked.
iv. Select your project target (usually named `AssureDex`) in the Xcode sidebar. Go to `Build Phases` -> `Copy Bundle Resources`. Verify that all the `.ttf` files you just added are listed here. If not, add them.
v.  Go to the `Info` tab (or open `Info.plist`). Add a new row to `Information Property List`. The key should be `UIAppFonts` (or select "Fonts provided by application"). This will create an array.
vi. For each `.ttf` file, add an item to this array with its **exact filename** (e.g., `MaterialCommunityIcons.ttf`).
vii. In Xcode, clean the build folder (`Product` > `Clean Build Folder`) and then build (`Product` > `Build`).

Running the App
After installation and linking, you can run the app:

Start the Metro Bundler:
This command starts the development server. Use --reset-cache to clear any old caches, which is useful after dependency changes.

npx react-native start --reset-cache

Run on iOS Simulator/Device:
Open a new terminal window (keep the Metro Bundler running in the first one) and run:

npx react-native run-ios

Project Structure
The project follows a standard React Native structure:

src/
├── assets/                  # Static assets like images (icons, backgrounds, trainers)
│   ├── backgrounds/
│   ├── icons/
│   └── trainers/
├── components/              # Reusable UI components (e.g., CustomAlertDialog)
├── navigation/              # Navigation setup and utilities (e.g., RootNavigation.ts)
├── sections/                # Contains individual app screens/features
│   ├── abilities/           # AbilitiesScreen.tsx
│   ├── common/              # Common screens like ComingSoonScreen
│   ├── homeScreen/          # HomeScreen.tsx (your main screen)
│   ├── items/               # ItemsScreen.tsx
│   ├── locationDetailScreen/
│   ├── moves/               # MovesScreen.tsx
│   ├── natures/             # NaturesScreen.tsx
│   ├── pokemonDetailScreen/
│   ├── pokemoninfo/
│   └── typeChart/           # TypeChartScreen.tsx
└── types/                   # TypeScript type definitions (e.g., navigation.d.ts)


Dependencies
Key dependencies used in this project (as per package.json):

@react-navigation/native

@react-navigation/native-stack

@react-navigation/stack

axios

react

react-native

react-native-gesture-handler

react-native-linear-gradient

react-native-progress

react-native-reanimated

react-native-reanimated-carousel

react-native-safe-area-context

react-native-screens

react-native-vector-icons

react-native-svg (if you were using SVG images directly)

Troubleshooting
"Error: Text string must be rendered within a <Text> component":
This means you have plain text directly in a <View> or other component that isn't a <Text> component. Wrap all text content in <Text>.

Icons showing as ? or squares:
This is the most common issue with react-native-vector-icons and indicates that the font files are not correctly linked to your native project. Carefully re-check all steps in the "Configure react-native-vector-icons" section above, especially the manual steps for iOS in Xcode. A clean build folder (Product > Clean Build Folder in Xcode) and a fresh pod install (cd ios && pod install) are often required.

"Invariant Violation: requireNativeComponent: 'RNCWebView' was not found" / Similar native module errors:
Often fixed by re-running npm install, cd ios && pod install, and then npx react-native start --reset-cache. Ensure your npx react-native link step was successful if manual linking is not applicable for a specific library.

Build failures after npm install or pod install:
Try cleaning your project:

iOS: In Xcode, Product > Clean Build Folder. Then, cd ios && pod install && cd ...

General: Delete node_modules and Podfile.lock (if on iOS), clear caches, and reinstall:

rm -rf node_modules
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
npm cache clean --force
watchman watch-del-all
npm install
cd ios && rm Podfile.lock && pod install && cd .. # For iOSAssureDex React Native Pokémon App
Welcome to AssureDex, a React Native application designed to provide a comprehensive guide to the Pokémon universe. This app aims to be a functional Pokédex, along with sections for Moves, Abilities, Items, Parties, Locations, Natures, and Type Charts.

Table of Contents
Features

Prerequisites

Installation

Running the App

Project Structure

Visuals (Adding Images to README)

Dependencies

Troubleshooting

Features
Pokédex: Browse and search for Pokémon.

Moves: Explore various Pokémon moves.

Abilities: Learn about different Pokémon abilities.

Items: Discover items in the Pokémon world.

Parties: (Coming Soon) Manage your Pokémon teams.

Locations: (Coming Soon) Explore different regions and places.

Natures: Understand the effects of Pokémon natures.

Type Chart: A detailed guide on Pokémon type effectiveness.

Clean User Interface: A modern and intuitive design with gradients and custom icons.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (>=18): Download Node.js

npm (comes with Node.js) or Yarn

React Native CLI:

npm install -g react-native-cli

Xcode (for iOS development): Install from the Mac App Store. Ensure Command Line Tools are installed (xcode-select --install).

CocoaPods (for iOS native dependencies):

sudo gem install cocoapods

Installation
Follow these steps to set up the project locally:

Clone the repository:

git clone https://github.com/legs30011/Assuresoft-ReactNative-App.git
cd Assuresoft-ReactNative-App

Install JavaScript dependencies:
This command will install all packages listed in your package.json.

npm install
# OR if using Yarn:
# yarn install

Install iOS native dependencies (CocoaPods):

cd ios
pod install
cd ..

Configure react-native-vector-icons (Crucial for Icons):
This library requires linking its font files to your native iOS project.

a.  Create/Verify react-native.config.js:
In the root directory of your project (where package.json is located), ensure you have a file named react-native.config.js with the following content:
javascript module.exports = { assets: ['./node_modules/react-native-vector-icons/Fonts/'], }; 

b.  Run Autolinking:
From the root directory of your project, run:
bash npx react-native link 

c.  Manual iOS Linking Steps in Xcode (Highly Recommended if icons don't appear):
Even with autolinking, sometimes manual steps are needed for iOS.

i.  Open your project in Xcode. Navigate to `ios/YourProjectName.xcworkspace`.
ii. In the Project Navigator (left pane), right-click on your project's main folder (e.g., `AssureDex`) and select `Add Files to "AssureDex..."`.
iii. Navigate to `node_modules/react-native-vector-icons/Fonts/` and select **all `.ttf` font files** (e.g., `MaterialCommunityIcons.ttf`, `FontAwesome5_Solid.ttf`, etc., depending on which icon sets you use). Click "Add". Ensure "Copy items if needed" is checked.
iv. Select your project target (usually named `AssureDex`) in the Xcode sidebar. Go to `Build Phases` -> `Copy Bundle Resources`. Verify that all the `.ttf` files you just added are listed here. If not, add them.
v.  Go to the `Info` tab (or open `Info.plist`). Add a new row to `Information Property List`. The key should be `UIAppFonts` (or select "Fonts provided by application"). This will create an array.
vi. For each `.ttf` file, add an item to this array with its **exact filename** (e.g., `MaterialCommunityIcons.ttf`).
vii. In Xcode, clean the build folder (`Product` > `Clean Build Folder`) and then build (`Product` > `Build`).

Running the App
After installation and linking, you can run the app:

Start the Metro Bundler:
This command starts the development server. Use --reset-cache to clear any old caches, which is useful after dependency changes.

npx react-native start --reset-cache

Run on iOS Simulator/Device:
Open a new terminal window (keep the Metro Bundler running in the first one) and run:

npx react-native run-ios

Project Structure
The project follows a standard React Native structure:

src/
├── assets/                  # Static assets like images (icons, backgrounds, trainers)
│   ├── backgrounds/
│   ├── icons/
│   └── trainers/
├── components/              # Reusable UI components (e.g., CustomAlertDialog)
├── navigation/              # Navigation setup and utilities (e.g., RootNavigation.ts)
├── sections/                # Contains individual app screens/features
│   ├── abilities/           # AbilitiesScreen.tsx
│   ├── common/              # Common screens like ComingSoonScreen
│   ├── homeScreen/          # HomeScreen.tsx (your main screen)
│   ├── items/               # ItemsScreen.tsx
│   ├── locationDetailScreen/
│   ├── moves/               # MovesScreen.tsx
│   ├── natures/             # NaturesScreen.tsx
│   ├── pokemonDetailScreen/
│   ├── pokemoninfo/
│   └── typeChart/           # TypeChartScreen.tsx
└── types/                   # TypeScript type definitions (e.g., navigation.d.ts)

Visuals (Adding Images to README)
You can easily embed images in your README.md file using Markdown syntax. This is great for showcasing screenshots of your app!

Image Syntax
To embed an image, use the following format:

![Alt text for the image](URL_del_imagen "Título opcional del imagen")

Alt text for the image: This is important for accessibility. It describes the image if it cannot be displayed (e.g., slow internet, screen reader). Make it descriptive!

URL_del_imagen: This is the direct link to your image. This can be:

A URL to an image hosted online (e.g., https://example.com/screenshot.png). This is the most common and reliable method for GitHub README files.

A relative path to an image within your GitHub repository (e.g., ./screenshots/home.png). This works well if you store your screenshots directly in your repo.

"Título opcional del imagen": (Optional) This text appears when a user hovers over the image.

Examples
Here's how you might add a screenshot of your home screen:

![Screenshot of the AssureDex Home Screen](https://placehold.co/600x400/E73B5B/FFFFFF?text=HOME+SCREEN+HERE "AssureDex Home Screen")

Result:


You can add more images to illustrate different features or screens. Remember to replace the placeholder URL with your actual image URLs.

Dependencies
Key dependencies used in this project (as per package.json):

@react-navigation/native

@react-navigation/native-stack

@react-navigation/stack

axios

react

react-native

react-native-gesture-handler

react-native-linear-gradient

react-native-progress

react-native-reanimated

react-native-reanimated-carousel

react-native-safe-area-context

react-native-screens

react-native-vector-icons

react-native-svg (if you were using SVG images directly)

Troubleshooting
"Error: Text string must be rendered within a <Text> component":
This means you have plain text directly in a <View> or other component that isn't a <Text> component. Wrap all text content in <Text>.

Icons showing as ? or squares:
This is the most common issue with react-native-vector-icons and indicates that the font files are not correctly linked to your native project. Carefully re-check all steps in the "Configure react-native-vector-icons" section above, especially the manual steps for iOS in Xcode. A clean build folder (Product > Clean Build Folder in Xcode) and a fresh pod install (cd ios && pod install) are often required.

"Invariant Violation: requireNativeComponent: 'RNCWebView' was not found" / Similar native module errors:
Often fixed by re-running npm install, cd ios && pod install, and then npx react-native start --reset-cache. Ensure your npx react-native link step was successful if manual linking is not applicable for a specific library.

Build failures after npm install or pod install:
Try cleaning your project:

iOS: In Xcode, Product > Clean Build Folder. Then, cd ios && pod install && cd ...

General: Delete node_modules and Podfile.lock (if on iOS), clear caches, and reinstall:

rm -rf node_modules
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
npm cache clean --force
watchman watch-del-all
npm install
cd ios && rm Podfile.lock && pod install && cd .. # For iOS
