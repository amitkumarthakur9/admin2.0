import { Dimensions, ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { AUMDetailInterface, AUMDetailResponseInterface } from '../../../src/interfaces/AUMDetailResponseInterface';

export default function AUMDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<AUMDetailInterface>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        async function getOrderDetails() {
            const response: AUMDetailResponseInterface = await RemoteApi.get(`folio/${id}`)
            if (response) {
                setData(response.data)
                setIsLoading(false)
            }
        }

        if (id) {
            getOrderDetails()
        }
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
                <HStack space={2} marginTop={20} marginBottom={20} justifyContent="center">
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
                                    <Text selectable className='text-2xl font-extrabold mb-3'>AUM Report Details</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"../"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/aum"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>AUM Reports</Text>
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
                                {/* <View>
                                    <Pressable marginRight={0} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                        <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                                    </Pressable>

                                </View> */}
                            </View>
                            <View className='flex flex-row m-2'>
                                <View className="w-12/12 lg:w-8/12  p-2">
                                    <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Folio Number</Text>
                                            <Text selectable className='font-bold text-base'>{data.folioNumber}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Distributor CompanyId</Text>
                                            <Text selectable className='font-bold text-base'>{data.distributor.distributorCompanyId}</Text>
                                        </View>

                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Current Value</Text>
                                            <Text selectable className='font-bold text-base'>{data.currentValue}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Category</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.mutualfundSubcategory?.mutualfundCategory.name}</Text>
                                        </View>

                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Subcategory</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.mutualfundSubcategory?.name}</Text>
                                        </View>
                                    </View>

                                </View>
                                <View className="w-12/12 lg:w-4/12 p-2">
                                    <View className='flex flex-col flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        {/* <View className='items-center flex flex-col'>
                                            <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                                <Text selectable className='text-white'>{getInitials(data.account.name)}</Text>
                                            </View>
                                        </View> */}
                                        <View className='flex flex-col mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Customer Name</Text>

                                            <Text selectable className='font-bold text-base'>{data.account.name}</Text>
                                        </View>
                                        <View className='mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Client Code</Text>
                                            <Text selectable className='font-bold text-base'>{data.account.id}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className='flex flex-row m-2'>
                                <View className="w-12/12 lg:w-8/12  p-2">
                                    <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Amount</Text>
                                            <Text selectable className='font-bold text-base'>{data.currentValue}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Units</Text>
                                            <Text selectable className='font-bold text-base'>{data.units}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Bse Demat Scheme Code</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.bseDematSchemeCode}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>RTA Code</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.rtaCode}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>NAV</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.nav}</Text>
                                        </View>



                                    </View>

                                </View>
                                <View className="w-12/12 lg:w-4/12 p-2">
                                    {/* <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
                                        </View>
                                        <View className='w-4/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order No</Text>
                                            <Text selectable className='font-bold text-base'>1202</Text>
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