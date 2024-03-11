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
import IFADashboard from "../../../src/components/Dashboard/IFADashboard";



export default function DashboardIFA() {
    return (
        <ScrollView
            
        >
           <IFADashboard />
        </ScrollView>
    );
}