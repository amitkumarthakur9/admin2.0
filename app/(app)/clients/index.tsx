import { Platform, ScrollView, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import ClientDataTable from '../../../src/components/ClientsTables/ClientsDataTable';
import { useNavigation } from 'expo-router';

export default function ClientsScreen() {

    return <ScrollView className='' style={{ backgroundColor: "white", height: '100%', overflow: "scroll" }}>
        <ClientDataTable />
    </ScrollView>;
}