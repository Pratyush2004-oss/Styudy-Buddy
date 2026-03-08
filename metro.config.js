const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname)

// expo-router imports internal build files (e.g. expo-router/build/qualified-entry).
// Some Metro setups with package exports enabled fail to resolve these deep imports.
config.resolver.unstable_enablePackageExports = false;

// Work around Expo Winter `structuredClone` lazy getter recursion triggered by
// `@ungap/structured-clone` in stream-chat polyfills.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@ungap/structured-clone') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/shims/structuredClone.ts'),
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' })