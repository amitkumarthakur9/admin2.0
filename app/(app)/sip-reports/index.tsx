import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import SIPDataTable from "../../../src/components/SIP/SIPDataTable";
import SIPReportTable from "../../../src/components/SIP/SIPReportTable";

export default function SIPReportsScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <SIPReportTable />
        </ScrollView>
    );
}
