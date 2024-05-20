module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            // "expo-router/babel",
            "nativewind/babel",
            "react-native-reanimated/plugin",
            "react-native-paper/babel",
            [
                "babel-plugin-react-docgen-typescript",
                { exclude: "node_modules" },
            ],
            [
                "module:react-native-dotenv",
                {
                    envName: "APP_ENV",
                    moduleName: "@env",
                    path: ".env",
                },
            ],
        ],
    };
};
