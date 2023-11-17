import * as React from 'react';
import { StyleSheet, Image, View, Text, ScrollView, Platform, Dimensions, TextInput } from 'react-native';

import { DataTable, Card, Searchbar, Chip, Avatar, Checkbox, Provider, Button } from 'react-native-paper';

type mutualfundData = Array<{
    name: string;
    mobile: string;
    email: string;
    pan: string;
    tax_status: string;
}>;


export interface DataTableProps {
    title?: string;
    data: {
        name: string;
        mobile: string;
        email: string;
        pan: string;
        tax_status: string;
    }[];

}

const CustomDataTable: React.FC<DataTableProps> = ({ data = [] }) => {
    const [sortAscending, setSortAscending] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(15);
    const [screenDimensions, setScreenDimensions] = React.useState<{ width: number, height: number }>(Dimensions.get('window'));

    // console.log('initial screenDimensions', screenDimensions);

    React.useEffect(() => {
        const updateScreenDimensions = () => {
            const { width, height } = Dimensions.get('window');
            setScreenDimensions({ width, height });
            // console.log('screenDimensions', { width, height });
        };
        // 


        // Subscribe to changes in screen dimensions
        Dimensions.addEventListener('change', updateScreenDimensions);

        // Cleanup the event listener when the component unmounts
        // return () => {
        //   // Dimensions.removeAllListeners('change', updateScreenDimensions);
        // };
    }, []);

    const [items] = React.useState<mutualfundData>(data);
    const [search, setSearch] = React.useState<string>("");

    const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 200]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        page
    );
    const sortedItems = items
        .slice()
        .sort((item1, item2) =>
            sortAscending
                ? item1.name.localeCompare(item2.name)
                : item2.name.localeCompare(item1.name)
        );
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);
    const [isFocused, setIsFocused] = React.useState(false);

    const onChangeSearch = (e) => {
        setSearch(e.value)
    }
    return (

        <ScrollView horizontal={Platform.OS == "web" ? (screenDimensions.width <= 600 ? true : false) : true} >
            <DataTable >
                <DataTable.Header className='bg-zinc-200' >
                    <DataTable.Title style={{ width: 50, flexBasis: "auto" }} >
                        <Checkbox status='checked' />
                    </DataTable.Title>
                    <DataTable.Title style={{ width: 120, flexBasis: "auto" }}>
                        Customer
                    </DataTable.Title>
                    <DataTable.Title
                        sortDirection={sortAscending ? 'ascending' : 'descending'}
                        onPress={() => setSortAscending(!sortAscending)}
                        style={{ width: 120, flexBasis: "auto" }}
                    >
                        Mobile
                    </DataTable.Title>

                    <DataTable.Title style={{ width: 150, flexBasis: "auto" }}>
                        Email
                    </DataTable.Title>
                    <DataTable.Title style={{ width: 125, flexBasis: "auto" }}>Pan</DataTable.Title>
                    <DataTable.Title style={{ width: 120, flexBasis: "auto" }}>Tax Status</DataTable.Title>
                    <DataTable.Title style={{ width: 20, flexBasis: "auto" }}>Action</DataTable.Title>
                </DataTable.Header>

                {sortedItems.slice(from, to).map((item, index) => (
                    <DataTable.Row key={index} centered>
                        <DataTable.Cell style={{ width: 50, flexBasis: "auto" }}>
                            <View>
                                <Checkbox status="unchecked" />
                            </View>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 120, flexBasis: "auto" }}>
                            <View className="flex-row items-center">
                                <Avatar.Image size={24} source={require('../../../assets/images/avatar.png')} /><Text> John Doe</Text>
                            </View>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ width: 120, flexBasis: "auto" }}>{item.mobile}</DataTable.Cell>
                        <DataTable.Cell style={{ width: 150, flexBasis: "auto" }}>{item.email}</DataTable.Cell>
                        <DataTable.Cell style={{ width: 125, flexBasis: "auto" }}>{item.pan} <Text selectable className='text-green-500'>KYC</Text></DataTable.Cell>
                        <DataTable.Cell style={{ width: 120, flexBasis: "auto" }}>{item.tax_status}</DataTable.Cell>
                        <DataTable.Cell style={{ width: 20, flexBasis: "auto" }}>
                            <Button style={{ width: 30, }} icon="dots-vertical" mode="text" onPress={() => console.log('Pressed')}>

                            </Button>
                        </DataTable.Cell>
                        {/* <DataTable.Cell numeric style={{ width: 120, flexBasis: "auto" }}>{item.fat}</DataTable.Cell> */}
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(sortedItems.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${sortedItems.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </ScrollView>
    );
};

// CustomDataTable.title = 'Data Table';

const styles = StyleSheet.create({
    content: {
        padding: 8,
    },
    first: {
        flex: 2,
    },
});

export default CustomDataTable;
