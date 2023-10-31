import React from "react";
import { PaperProvider, Provider } from "react-native-paper";
import { PaperTheme } from "../../theme/PaperTheme";
import LoginScreen from "./LoginScreen";


export default {
    title: "components/LoginScreen",
    component: LoginScreen,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

export const Basic = (args) => <PaperProvider theme={PaperTheme}><LoginScreen {...args} /></PaperProvider>;

Basic.args = {
    label: "Filter"
};
