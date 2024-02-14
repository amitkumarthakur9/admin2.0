import { ScrollView } from "react-native";

import RTAReconciliation from "../../../src/components/RtaReconciliation/RTAReconciliation";

export default function RTAReconciliationScreen() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <RTAReconciliation />
        </ScrollView>
    );
}
