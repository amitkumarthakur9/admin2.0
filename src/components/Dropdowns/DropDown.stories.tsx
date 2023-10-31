import React from "react";
import { PaperProvider, Provider } from "react-native-paper";;
import { PaperTheme } from "../../theme/PaperTheme";
import DropdownComponent from "./DropDown";



export default {
    title: "components/DropDown",
    component: DropdownComponent,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

export const Basic = (args) => <PaperProvider theme={PaperTheme}><DropdownComponent {...args} /></PaperProvider>;

Basic.args = {
    label: "Filter",
    data: [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ]
};
