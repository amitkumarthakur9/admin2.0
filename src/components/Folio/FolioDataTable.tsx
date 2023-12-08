import * as React from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import { OrderInterface } from '../../interfaces/OrderInterface';
import RemoteApi from '../../services/RemoteApi';
import { OrdersResponse } from '../../interfaces/OrdersResposeInterface';
import { DynamicFilters } from '../Filters/DynamicFilters';
import { FolioRows } from './FolioRows';
import { Pagination } from '../Pagination/Pagination';
import { HStack, Heading, Spinner } from 'native-base';
import { TableBreadCrumb } from '../BreadCrumbs/TableBreadCrumb';


const FolioDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AUMDataItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({ key: "", direction: "" });

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

        const response: AUMResponseInterface = await RemoteApi.post("folio/list", data);

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
            const response: any = await RemoteApi.get("folio/schema")
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
                <TableBreadCrumb name={"Folio"} />
            </View>
            <View className='border-[0.2px] border-[#e4e4e4]'>

                <DynamicFilters appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} fileName="Folio" downloadApi={"folio/download-report"} schemaResponse={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />

                {
                    !isLoading ? <View className={'mt-4 z-[-1] ' + (Dimensions.get("screen").width < 770 ? "overflow-scroll" : "")}>
                        <FolioRows data={data} schema={null} />
                    </View> : <HStack space={2} marginTop={20} marginBottom={20} justifyContent="center">
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



export default FolioDataTable;






