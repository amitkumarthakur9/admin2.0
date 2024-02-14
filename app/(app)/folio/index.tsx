import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import FolioDataTable from "../../../src/components/Folio/FolioDataTable";

export default function AUMReportsScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <FolioDataTable />
        </ScrollView>
    );
}
