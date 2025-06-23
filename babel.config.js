// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Asegúrate de que react-native-reanimated/plugin sea el ÚLTIMO plugin en la lista
    'react-native-reanimated/plugin',
  ],
};
