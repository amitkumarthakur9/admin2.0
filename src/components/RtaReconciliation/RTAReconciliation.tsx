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
import { RTAReconciliationRows } from './RTAReconciliationRows';
import { Pagination } from '../Pagination/Pagination';
import { Box, CheckIcon, HStack, Heading, Pressable, Select, Spinner } from 'native-base';
import DatePickerComponent from '../CustomDatePicker/DatePicker';


const RTAReconciliation = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AUMDataItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = React.useState<any>(undefined);

    async function getDataList(updatedFilterValues = [], applyDirectly = false) {
        setIsLoading(true)
        const response: AUMResponseInterface = await RemoteApi.post("folio/list", {
            "page": currentPageNumber,
            "limit": itemsPerPage,
            "orderBy": {
                "key": "createdAt",
                "direction": "desc"
            },
            "filters": applyDirectly ? updatedFilterValues : appliedFilers
        });

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
            const response: any = await RemoteApi.get("order/schema")
            setFiltersSchema(response.filters)
        }
        getSchema()
    }, [])

    return (
        <ScrollView className={`bg-white`} style={{ height: Dimensions.get("window").height - 100 }} showsVerticalScrollIndicator={true}>
            <View className='bg-white'>
                <View className=''>
                    <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                        <View className='flex flex-col w-6/12'>
                            <Text className='text-2xl font-extrabold mb-3'>RTA Reconciliation</Text>
                            <View className='flex flex-row items-center'>
                                <Link href={""} className='mr-4'>
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

                    <View className='flex flex-row justify-between items-center mt-5'>
                        <View className='flex flex-row w-10/12 items-center pl-2'>
                            <View className='mr-2'>
                                <DatePickerComponent showCalendar={true} fromName='From' toName='To' value={date} handleFilterChange={setDate} />
                            </View>
                            {/* <Box maxW="300" style={{ height: "100%" }} className='ml-2'> */}
                            <Select className='' height={"33.2px"} borderWidth={0.9} style={{ height: "100%", marginRight: 2 }} dropdownIcon={<Icon name="chevron-down" style={{ fontWeight: "100", marginRight: 4 }} color="black" />} selectedValue={service} minWidth="200" accessibilityLabel="Choose" placeholder="Choose" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} onValueChange={itemValue => setService(itemValue)}>
                                <Select.Item label="All" value="all" />
                                <Select.Item label="Reconciled" value="reconciled" />
                                <Select.Item label="Non Reconciled" value="non-reconciled" />
                            </Select>
                            {/* </Box> */}
                            <View className="ml-2 ">

                                <Pressable marginRight={2} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                    <Text className='text-white'>Apply</Text>
                                </Pressable>

                            </View>
                        </View>
                        <View className="flex flex-row w-2/12 justify-end items-center">
                            <Pressable marginRight={4} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                            </Pressable>
                        </View>
                    </View>

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
        </ScrollView >
    );
};



export default RTAReconciliation;







