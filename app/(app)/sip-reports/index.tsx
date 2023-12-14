import { Platform, ScrollView, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import SIPDataTable from '../../../src/components/SIP/SIPDataTable';

export default function SIPReportsScreen() {


    return <ScrollView className='' style={{ backgroundColor: "white", height: '100%', overflow: "scroll" }}>

        <SIPDataTable />
    </ScrollView>;
}