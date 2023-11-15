import { Dimensions, ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { Order, OrderDataInterface } from '../../../src/interfaces/OrderDataInterface';

export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<Order>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        async function getOrderDetails() {
            const response: OrderDataInterface = await RemoteApi.get(`order/${id}`)
            setData(response.data)
            setIsLoading(false)
        }

        getOrderDetails()
    }, [id])

    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            const firstWord = words[0];
            const secondWord = words[1];
            return `${firstWord[0]}${secondWord[0]}`;
        } else if (words.length === 1) {
            return words[0][0];
        } else {
            return '';
        }
    }

    return (<>
        {
            isLoading ? <Center>
                <HStack space={2} marginTop={20} justifyContent="center">
                    <Spinner color={"black"} accessibilityLabel="Loading order" />
                    <Heading color="black" fontSize="md">
                        Loading
                    </Heading>
                </HStack>
            </Center>
                :
                <ScrollView className={`bg-white`} showsVerticalScrollIndicator={true}>
                    <View className='bg-white'>
                        <View className=''>
                            <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                                <View className='flex flex-col w-6/12'>
                                    <Text className='text-2xl font-extrabold mb-3'>Order Details</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"/"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/orders"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Orders</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={""} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>{id}</Text>
                                        </Link>
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
                        <View>
                            <View className='flex flex-row justify-between mx-5'>
                                <View>

                                </View>
                                <View>
                                    <Pressable marginRight={4} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                        <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                                    </Pressable>

                                </View>
                            </View>
                            <View className='flex flex-row m-2'>
                                <View className="w-12/12 lg:w-8/12  p-2">
                                    <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-3/12 mb-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Account Type</Text>
                                            <Text className='font-bold text-base'>{data.account.accountType.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Demat Account UserID</Text>
                                            <Text className='font-bold text-base'>{data.account.dematAccount.userId}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order Status</Text>
                                            <Text className='font-bold text-base'>{data.orderStatus.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order Reference Number</Text>
                                            <Text className='font-bold text-base'>{data.orderReferenceNumber}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund House</Text>
                                            <Text className='font-bold text-base'>{data.mutualFund.fundhouse.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Category</Text>
                                            <Text className='font-bold text-base'>{data.mutualFund.mutualfundSubcategory.mutualfundCategory.name}</Text>
                                        </View>

                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Subcategory</Text>
                                            <Text className='font-bold text-base'>{data.mutualFund.mutualfundSubcategory.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>RTA</Text>
                                            <Text className='font-bold text-base'>{data.mutualFund.fundhouse.rta}</Text>
                                        </View>
                                    </View>

                                </View>
                                <View className="w-12/12 lg:w-4/12 p-2">
                                    <View className='flex flex-col flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        {/* <View className='items-center flex flex-col'>
                                            <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                                <Text className='text-white'>{getInitials(data.account.name)}</Text>
                                            </View>
                                        </View> */}
                                        <View className='flex flex-col mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Customer Name</Text>

                                            <Text className='font-bold text-base'>{data.customerName}</Text>
                                        </View>
                                        <View className='mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Client Code</Text>
                                            <Text className='font-bold text-base'>{data.clientCode}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className='flex flex-row m-2'>
                                <View className="w-12/12 lg:w-8/12  p-2">
                                    <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-3/12 mb-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Amount</Text>
                                            <Text className='font-bold text-base'>{data.amount}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Units</Text>
                                            <Text className='font-bold text-base'>{data.units}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>ISIN</Text>
                                            <Text className='font-bold text-base'>{data.isin}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Sip Reference Number</Text>
                                            <Text className='font-bold text-base'>{data.sipReferenceNumber}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Demat Account</Text>
                                            <Text className='font-bold text-base'>{data.account.dematAccount.id}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>First Order!</Text>
                                            <Text className='font-bold text-base'>{data.firstOrder}</Text>
                                        </View>

                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Start Date</Text>
                                            <Text className='font-bold text-base'>{data.startDate}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>End Date</Text>
                                            <Text className='font-bold text-base'>{data.endDate}</Text>
                                        </View>
                                    </View>

                                </View>
                                <View className="w-12/12 lg:w-4/12 p-2">
                                    {/* <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text className='font-bold text-base'>1202</Text>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView >
        }
    </>
    )


}