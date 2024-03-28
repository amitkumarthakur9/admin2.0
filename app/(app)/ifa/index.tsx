import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import IFADataTable from "../../../src/components/IfaTable/IFADataTable";


export default function IFAReportsScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <IFADataTable />
        </ScrollView>
    );
}
