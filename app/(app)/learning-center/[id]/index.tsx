import { ScrollView } from "react-native";
import ModuleLearningManagement from "src/components/LearningManagement/ModuleLearningManagement";

export default function ModuleLearningCenter() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <ModuleLearningManagement />
        </ScrollView>
    );
}
