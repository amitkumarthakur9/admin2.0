import * as React from 'react';
import { View, Text, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import RemoteApi from '../../services/RemoteApi';
import { RTAReconciliationRows } from './RTAReconciliationRows';
import { Pagination } from '../Pagination/Pagination';
import { Box, Button, CheckIcon, HStack, Heading, Pressable, Select, Spinner } from 'native-base';
import DatePickerComponent from '../CustomDatePicker/DatePicker';
import { RTAReconcilation, RTAResponseResponseInterface } from '../../interfaces/RTAResponseInterface';
import DatePickerNew from '../CustomDatePicker/DatePickerNew';
import CalendarPicker from '../CustomDatePicker/CalendarPicker';
import { DynamicFilters } from '../Filters/DynamicFilters';
import { TableBreadCrumb } from '../BreadCrumbs/TableBreadCrumb';


const RTAReconciliation = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<RTAReconcilation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = React.useState<any>(undefined);
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({ key: "", direction: "" });

    const downloadReport = async () => {
        setIsDownloadProcessing(true)
        const response: any = await RemoteApi.downloadFile({ endpoint: "", fileName: "Rta", data: [] });
        console.log(response);
        setIsDownloadProcessing(false)
    }


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


        const response: RTAResponseResponseInterface = await RemoteApi.post("transaction/list", data);
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
            const response: any = await RemoteApi.get("transaction/schema")
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
                <TableBreadCrumb name={"Tranasactions"} />

            </View>
            <View className='border-[0.2px]  border-[#e4e4e4]'>

                <DynamicFilters appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} fileName="Aum" downloadApi={"aum/download-report"} schemaResponse={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />


                {
                    !isLoading ? <View className={'mt-4 z-[-1] ' + (Dimensions.get("screen").width < 770 ? "overflow-scroll" : "")}>
                        <RTAReconciliationRows data={data} schema={null} />
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



export default RTAReconciliation;







