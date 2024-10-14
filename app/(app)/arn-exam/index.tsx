import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import ClientDataTable from "../../../src/components/ClientsTables/ClientsDataTable";
import { useNavigation } from "expo-router";
import AUMDataTable from "../../../src/components/AUMTables/AUMDataTable";
import ARNDataTable from "../../../src/components/ARNTransfer/ARNDataTable";
import ARNRequest from "../../../src/components/ARNTransfer/ARNRequest";
import TrainingArnExamScreen from "../dsa-form/training-arn-exam";

export default function ArnExamScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            
            <TrainingArnExamScreen />
        </ScrollView>
    );
}