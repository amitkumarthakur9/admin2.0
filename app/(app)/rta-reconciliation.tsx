import { Platform, ScrollView, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import AUMDataTable from '../../src/components/Folio/FolioDataTable';
import RTAReconciliation from '../../src/components/RtaReconciliation/RTAReconciliation';
import { useLocalSearchParams } from 'expo-router';

export default function RTAReconciliationScreen() {


    return <ScrollView className='' style={{ backgroundColor: "white", height: '100%', overflow: "scroll" }}>
        <RTAReconciliation />
    </ScrollView>;
}