import React from "react";
import { PaperProvider, Provider } from "react-native-paper";
import { PaperTheme } from "../../theme/PaperTheme";
import Button from "./Button";
import { ViewStyle } from "react-native";

export default {
    title: "components/PaperButton",
    component: Button,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

interface args {
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
    style?: ViewStyle;
}

export const Basic = (args: args) => (
    <PaperProvider theme={PaperTheme}>
        <Button {...args} />
    </PaperProvider>
);

Basic.args = {
    label: "Filter",
};
