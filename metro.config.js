const { withNativeWind } = require('nativewind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname)

// expo-router imports internal build files (e.g. expo-router/build/qualified-entry).
// Some Metro setups with package exports enabled fail to resolve these deep imports.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' })