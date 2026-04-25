// babel.config.js
// ─────────────────────────────────────────────────────────────────────────────
// Enables process.env.VARIABLE_NAME to work in React Native
// via the react-native-dotenv Babel plugin
//
// Without this, all Firebase config values will be undefined and the app crashes
//
// After editing this file, always restart with: npx expo start --clear
// ─────────────────────────────────────────────────────────────────────────────

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName:     '@env',
          path:           '.env',
          safe:           false,
          allowUndefined: false,
        },
      ],
    ],
  };
};