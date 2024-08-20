import { ScrollView, View } from "react-native";
import MainComponent from "src/components/DsaForm/MainComponent";
import TrainingForArnExam from "src/components/DsaForm/TrainingForArnExam";
export default function TrainingArnExamScreen() {
    return (
        <ScrollView className="bg-gray-100">
            <View className="flex-1 justify-center items-center">
                <TrainingForArnExam />
            </View>
        </ScrollView>
    );
}
