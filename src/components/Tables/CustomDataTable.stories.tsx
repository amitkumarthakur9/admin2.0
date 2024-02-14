import React from "react";
import { PaperProvider, Provider } from "react-native-paper";
import { PaperTheme } from "../../theme/PaperTheme";
import CustomDataTable from "./CustomDataTable";

export default {
    title: "components/CustomDataTable",
    component: CustomDataTable,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

export const Basic = (args) => (
    <PaperProvider theme={PaperTheme}>
        <CustomDataTable {...args} />
    </PaperProvider>
);

Basic.args = {
    data: [
        {
            name: "John Doe",
            mobile: "123-456-7890",
            email: "john@example.com",
            pan: "ABCDE1234F",
            tax_status: "Taxable",
        },
        // Add more data objects as needed
    ],
};
