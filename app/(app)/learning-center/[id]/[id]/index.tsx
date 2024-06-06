import { ScrollView } from "react-native";
import ChapterLearning from "src/components/LearningManagement/ChapterLearning";
import { useLocalSearchParams } from "expo-router";

export default function ChapterLearningCenter() {
    const { id } = useLocalSearchParams();
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <ChapterLearning name={id} />
        </ScrollView>
    );
}
