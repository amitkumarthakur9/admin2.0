const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
    const mode = argv.mode || 'development';
    const config = await createExpoWebpackConfigAsync(
        {
            ...env,
            mode, // Pass the mode to @expo/webpack-config
            babel: {
                dangerouslyAddModulePathsToTranspile: ["nativewind"],
            },
            externals: {
                "react-native": true,
            },
        },
        argv
    );

    // Add devtool configuration
    config.devtool = 'source-map';

    // Add BundleAnalyzerPlugin
    config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-analysis-report.html',
        openAnalyzer: false,
    }));

    const imageLoaderConfiguration = {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
            loader: "url-loader",
            options: {
                name: "[name].[ext]",
                esModule: false,
            },
        },
    };

    config.module.rules.push(imageLoaderConfiguration);

    config.module.rules.push({
        test: /\.css$/i,
        use: ["postcss-loader"],
    });

    return config;
};
