const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields = [
    "sbmodern",
    "react-native",
    "browser",
    "main",
    ...defaultConfig.resolver.resolverMainFields,
];

// defaultConfig.resolver.assetExts.push(
//   // Adds support for .db files for SQLite databases
//   'mjs'
// );

defaultConfig.resolver.sourceExts.push("mjs", "cjs");

defaultConfig.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
        // babelTransformerPath: require.resolve("react-native-bundle-visualizer/lib/transformer"),
    },
});

defaultConfig.watchFolders = [...defaultConfig.watchFolders, "./.ondevice"];

module.exports = defaultConfig;
