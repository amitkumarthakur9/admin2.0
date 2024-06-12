import {
    ScrollView,
} from "react-native";
import DsaRequestTabs from "src/components/DsaForm/DsaRequestTabs";

export default function DsaRequestScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <DsaRequestTabs />
        </ScrollView>
    );
}