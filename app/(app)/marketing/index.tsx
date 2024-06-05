import {
    ScrollView,
} from "react-native";
import MarketingRedirect from "../../../src/components/Marketing/MarketingRedirect";

export default function MarketingScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <MarketingRedirect />
        </ScrollView>
    );
}