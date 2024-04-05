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
import DistributorDashboard from "../../../src/components/Dashboard/DistributoDashboard";



export default function DistributorDashboardScreen() {
    return (
        <ScrollView
            
        >
           <DistributorDashboard />
        </ScrollView>
    );
}