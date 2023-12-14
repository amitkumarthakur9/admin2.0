import * as React from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import RemoteApi from '../../services/RemoteApi';
import { DynamicFilters } from '../Filters/DynamicFilters';
import { Pagination } from '../Pagination/Pagination';
import { ClientsRows } from './ClientsRows';
import { HStack, Heading, Spinner } from 'native-base';
import { TableBreadCrumb } from '../BreadCrumbs/TableBreadCrumb';
import { MobileClientsRows } from './MobileClientsRows';


const ClientsDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AccountItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({ key: "", direction: "" });
    const { height, width } = useWindowDimensions();

    async function getDataList(updatedFilterValues = [], applyDirectly = false) {
        setIsLoading(true)
        let data: any = {
            "page": currentPageNumber,
            "limit": itemsPerPage,
            "filters": applyDirectly ? updatedFilterValues : appliedFilers
        }

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting
        }

        const response: AccountsResponse = await RemoteApi.post("client/list", data);

        if (response.code == 200) {
            setData(response.data)
            // setItemsPerPage(response.count)
            setTotalItems(response.filterCount)
            setIsLoading(false)
            setTotalPages(Math.ceil((response.filterCount || response.data.length) / itemsPerPage));
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("client/schema")
            setFiltersSchema(response)
            setSorting(response.sort)
        }
        getSchema()
    }, [])

    React.useEffect(() => {
        if ((appliedSorting.direction != "" && appliedSorting.key != "") || (appliedSorting.direction == "" && appliedSorting.key == "")) {
            getDataList()
        }
    }, [appliedSorting])


    return (
        <View className='bg-white'>
            <View className=''>
                <TableBreadCrumb name={"Clients"} />
            </View>
            <View className='border-[0.2px]  border-[#e4e4e4]'>

                <DynamicFilters appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} fileName="Clients" downloadApi={"client/download-report"} schemaResponse={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />

                {
                    !isLoading ? <ScrollView className={'mt-4 z-[-1] '}>
                        {width < 830 ? <MobileClientsRows data={data} schema={null} /> : <ClientsRows data={data} schema={null} />}
                    </ScrollView> : <HStack space={"md"} marginTop={20} marginBottom={20} justifyContent="center">
                        <Spinner color={"black"} accessibilityLabel="Loading order" />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                }


            </View>

            <Pagination itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} getDataList={getDataList} currentPageNumber={currentPageNumber} totalPages={totalPages} setCurrentPageNumber={setCurrentPageNumber} />
        </View >
    );
};



export default ClientsDataTable;







