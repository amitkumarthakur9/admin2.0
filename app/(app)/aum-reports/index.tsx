import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import ClientDataTable from "../../../src/components/ClientsTables/ClientsDataTable";
import { useNavigation } from "expo-router";
import AUMDataTable from "../../../src/components/AUMTables/AUMDataTable";

export default function AUMTabScreen({ roleID }) {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <AUMDataTable role={roleID}  />
        </ScrollView>
    );
}