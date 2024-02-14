export default ({ config }) => ({
    ...config,
    name: "expo-storybook-starter",
    slug: "expo-storybook-starter",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    extra: {
        storybookEnabled: process.env.STORYBOOK_ENABLED,
    },
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#FFFFFF",
        },
    },
    web: {
        favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],

    expo: {
        scheme: "myapp",
        web: {
            bundler: "metro",
        },
        extra: {
            eas: {
                projectId: "7075b93b-272b-4344-8d8d-c095464f6b5d",
            },
        },
        owner: "ranjan_fundexpert",
        android: {
            package: "com.kotak.vision",
        },
    },
});
