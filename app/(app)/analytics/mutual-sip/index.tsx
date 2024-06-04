import {
    ScrollView,
} from "react-native";
import MutualSipAnalytics from "../../../../src/components/Analytics/MutualSipAnalytics";

export default function MutualSipAnalyticsScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <MutualSipAnalytics />
        </ScrollView>
    );
}