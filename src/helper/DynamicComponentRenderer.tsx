import React from 'react';
import ClientBox from "../components/Client/ClientBox";
import { ClientsRows } from '../components/ClientsTables/ClientsRows';
import { OrdersRows } from '../components/OrdersTables/OrdersRows';
import { ReportRows } from '../components/ReportTables/ReportRows';
import { Text } from 'react-native';
import ClientOrderBox from '../components/Client/ClientOrderBox';
import ClientReportBox from '../components/Client/ClientReportBox';
const componentMap = {
    ClientBox,
    ClientsRows,
    OrdersRows,
    ReportRows,
    ClientOrderBox,
    ClientReportBox
    // Add other components here
};

function DynamicComponentRenderer({ componentName, data, schema }: { componentName: string, data: any, schema?: any }) {
    const Component = componentMap[componentName];
    if (!Component) {
        // Handle the case where the component name is not valid
        return <Text>Component not found</Text>;
    }
    return <Component data={data} schema={schema} />;
}

export default DynamicComponentRenderer;