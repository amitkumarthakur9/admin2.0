import { ScrollView } from "react-native";
import LearningManagement from "src/components/LearningManagement/LearningManagement";

export default function LearningCenter() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <LearningManagement />
        </ScrollView>
    );
}
