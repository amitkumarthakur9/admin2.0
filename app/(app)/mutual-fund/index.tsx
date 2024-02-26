import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { useNavigation } from "expo-router";
import MutualfundDataTable from "../../../src/components/MutualfundTable/MutualFundDataTable";

export default function ClientsScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <MutualfundDataTable />
        </ScrollView>
    );
}
