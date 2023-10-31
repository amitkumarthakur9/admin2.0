import React from "react";
import { PaperProvider, Provider } from "react-native-paper";
import ModalTabs from "./ModalTabs";
import { PaperTheme } from "../../theme/PaperTheme";


export default {
    title: "components/ModalTabs",
    component: ModalTabs,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

export const Basic = (args) => <PaperProvider theme={PaperTheme}><ModalTabs {...args} /></PaperProvider>;

Basic.args = {
    label: "Filter"
};
