import { Animated, ButtonProps, Platform, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import OrderDataTable from '../../../src/components/OrdersTables/OrdersDataTable';

export default function OrdersScreen() {
    let data = {
        customer_name: "KASHINATH NARAYAN MORE",
        client_code: "ZI3G3",
        scheme_name: "Aditya Birla Sun Life Mutual Fund",
        scheme_type: "Switch",
        to_scheme: "Woc Flexi Cap Fund Regular Plan - Growth",
        order_status: "Failed",
        order_no: "498766401",
        amount: "4300",
        units: "53",
        processing_datetime: "24/08/2022  2:30:10 PM"
    }

    return <View className='' style={{ backgroundColor: "white" }}>

        <OrderDataTable />
    </View>;
}

const buttonStyle: StyleProp<ViewStyle> = { width: 120, borderColor: "black", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, backgroundColor: "white" }

const labelStyle: StyleProp<TextStyle> = { textAlign: "center", color: "black", fontWeight: "400", fontSize: 12 }
