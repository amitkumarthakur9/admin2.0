import { Platform, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import ClientDataTable from '../../../src/components/ClientsTables/ClientsDataTable';

export default function ClientsScreen() {
    let data = {
        customer_name: "KASHINATH NARAYAN MORE",
        client_code: "ZI3G3",
        active_type: "Demat",
        pan: "AAACK3552A",
        kra_status: "Verified",
        client_doi: "10/02/2017 12:00:10 AM",
    }

    return <View className='' style={{}}>
        <ClientDataTable />
    </View>;
}