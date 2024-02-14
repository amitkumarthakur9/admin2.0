import React from "react";
import { PaperProvider, Provider } from "react-native-paper";
import { PaperTheme } from "../../theme/PaperTheme";
import DatePickerComponent from "./DatePicker";

export default {
    title: "components/DatePicker",
    component: DatePickerComponent,
    argTypes: {
        onPress: { action: "pressed" },
    },
};

export const Basic = (args) => (
    <PaperProvider theme={PaperTheme}>
        <DatePickerComponent {...args} />
    </PaperProvider>
);

Basic.args = {
    title: "Orders List",
    data: [
        {
            customer_name: "KASHINATH NARAYAN MORE",
            client_code: "ZI3G3",
            scheme_name: "Aditya Birla Sun Life Mutual Fund",
            scheme_type: "Switch",
            to_scheme: "Woc Flexi Cap Fund Regular Plan - Growth",
            order_status: "Failed",
            order_no: "498766401",
            amount: "4300",
            units: "53",
            processing_datetime: "24/08/2022  2:30:10 PM",
        },
        // Add more data objects as needed
    ],
};
