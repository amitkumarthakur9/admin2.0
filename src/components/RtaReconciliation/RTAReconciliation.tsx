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
            setFiltersSchema(response.filters)
            setFiltersSchema(response.filters)
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
                <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                    <View className='flex flex-col w-6/12'>
                        <Text selectable className='text-2xl font-extrabold mb-3'>RTA Reconciliation</Text>
                        <View className='flex flex-row items-center'>
                            <Link href={"../"} className='mr-4'>
                                {/* <Icon name="home" size={18} color="black" /> */}
                                <Text>Dashboard</Text>
                            </Link>
                            <View className='mr-4'>
                                <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                            </View>
                        </View>
                    </View>
                    <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                        <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                            // flex: 1,
                            // justifyContent: 'center',
                        }}>

                        </ImageBackground>
                    </View>
                </View>

            </View>
            <View className='border-[0.2px]  border-[#e4e4e4]'>

                <DynamicFilters appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} fileName="Aum" downloadApi={"aum/download-report"} filtersSchema={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />


                {
                    !isLoading ? <View className={'mt-4 z-[-1] ' + (Dimensions.get("screen").width < 770 ? "overflow-scroll" : "")}>
                        <RTAReconciliationRows data={data} schema={null} />
                    </View> : <HStack space={2} marginTop={20} justifyContent="center">
                        <Spinner color={"black"} accessibilityLabel="Loading order" />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                }


            </View>

            <Pagination getDataList={getDataList} currentPageNumber={currentPageNumber} totalPages={totalPages} setCurrentPageNumber={setCurrentPageNumber} />

        </View >
    );
};



export default RTAReconciliation;







