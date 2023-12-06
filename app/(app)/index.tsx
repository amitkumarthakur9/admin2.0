import { Animated, ButtonProps, Dimensions, Platform, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import OrderDataTable from '../../src/components/OrdersTables/OrdersDataTable';

export default function Dashboard() {

    return <View className='' style={{ backgroundColor: "white", height: '100%', overflow: "scroll" }}>

        <OrderDataTable />
    </View>;
}

const buttonStyle: StyleProp<ViewStyle> = { width: 120, borderColor: "black", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, backgroundColor: "white" }

const labelStyle: StyleProp<TextStyle> = { textAlign: "center", color: "black", fontWeight: "400", fontSize: 12 }
