import * as React from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import { OrdersRows } from './OrdersRows';
import { OrderInterface } from '../../interfaces/OrderInterface';
import RemoteApi from '../../services/RemoteApi';
import { OrdersResponse } from '../../interfaces/OrdersResposeInterface';
import { DynamicFilters } from '../Filters/DynamicFilters';
import { Pagination } from '../Pagination/Pagination';
import { HStack, Heading, Spinner } from 'native-base';


const OrderDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<OrderInterface[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);

    async function getDataList(updatedFilterValues = [], applyDirectly = false) {
        setIsLoading(true)
        const response: OrdersResponse = await RemoteApi.post("order/list", {
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
        <View className='bg-white'>
            <View className=''>
                <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                    <View className='flex flex-col w-6/12'>
                        <Text selectable className='text-2xl font-extrabold mb-3'>Orders</Text>
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

                <DynamicFilters downloadApi={"order/download-report"} filtersSchema={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />

                {
                    !isLoading ? <View className='mt-4 z-[-1]'>
                        <OrdersRows data={data} schema={null} />
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



export default OrderDataTable;







