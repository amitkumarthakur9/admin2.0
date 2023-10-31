import { MD3LightTheme } from "react-native-paper";

const DefaultTheme = MD3LightTheme;

DefaultTheme.colors.background = "#ffffff";

export const PaperTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
    },
};