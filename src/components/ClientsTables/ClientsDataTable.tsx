import * as React from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import RemoteApi from '../../services/RemoteApi';
import { DynamicFilters } from '../Filters/DynamicFilters';
import { Pagination } from '../Pagination/Pagination';
import { ClientsRows } from './ClientsRows';
import { HStack, Heading, Spinner } from 'native-base';


const ClientsDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AccountItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);

    async function getDataList(updatedFilterValues = [], applyDirectly = false) {
        setIsLoading(true)
        const response: AccountsResponse = await RemoteApi.post("client/list", {
            "page": currentPageNumber,
            "limit": itemsPerPage,
            "orderBy": {
                "key": "name",
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
                            <Text className='text-2xl font-extrabold mb-3'>Clients</Text>
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

                    <DynamicFilters downloadApi={"client/download-report"} filtersSchema={filtersSchema} setCurrentPageNumber={setCurrentPageNumber} getList={getDataList} appliedFilers={appliedFilers} setAppliedFilers={setAppliedFilers} />

                    {
                        !isLoading ? <View className='mt-4 z-[-1]'>
                            <ClientsRows data={data} schema={null} />
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



export default ClientsDataTable;







