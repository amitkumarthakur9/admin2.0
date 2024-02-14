import {
    Animated,
    ButtonProps,
    Dimensions,
    Platform,
    StyleProp,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import OrderDataTable from "../../../src/components/OrdersTables/OrdersDataTable";
import { ScrollView } from "native-base";

export default function OrdersScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <OrderDataTable />
        </ScrollView>
    );
}
