import {
    ScrollView,
} from "react-native";
import AnalyticsTabs from "../../../src/components/Analytics/AnalyticsTabs";

export default function AnalyticsScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <AnalyticsTabs />
        </ScrollView>
    );
}