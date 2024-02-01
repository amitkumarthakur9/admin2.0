import { Platform, ScrollView, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import FolioDataTable from '../../../src/components/Folio/FolioDataTable';
import MandateDataTable from '../../../src/components/Mandates/MandateDataTable';

export default function MandatesScreen() {

    return <ScrollView className='' style={{ backgroundColor: "white", height: '100%', overflow: "scroll" }}>

        <MandateDataTable />
    </ScrollView>;
}