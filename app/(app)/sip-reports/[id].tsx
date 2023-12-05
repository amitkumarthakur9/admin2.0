import { Dimensions, ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { SIPReportDetail, SIPDetailResponseInterface } from '../../../src/interfaces/SIPDetailInterface';
import moment from 'moment';

export default function SIPReportsDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<SIPReportDetail>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        async function getOrderDetails() {
            const response: SIPDetailResponseInterface = await RemoteApi.get(`sip/${id}`)
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
                                    <Text selectable className='text-2xl font-extrabold mb-3'>SIP Report Details</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"../"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/sip-reports"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Sip Reports</Text>
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
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Distributor CompanyId</Text>
                                            <Text selectable className='font-bold text-base'>{data.distributor.distributorCompanyId}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Mandate</Text>
                                            <Text selectable className='font-bold text-base'>{data.mandate?.mandateId || "-"}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Mandate Status</Text>
                                            <Text selectable className='font-bold text-base'>{data.mandate?.mandateStatus.name || "-"}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Order Status</Text>
                                            <Text selectable className='font-bold text-base'>{data.orderStatus.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Category</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.mutualfundSubcategory.mutualfundCategory.name}</Text>
                                        </View>

                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Fund Subcategory</Text>
                                            <Text selectable className='font-bold text-base'>{data.mutualfund.mutualfundSubcategory.name}</Text>
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
                                            <Text selectable className='font-bold text-base'>{data.account.clientId}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className='flex flex-row m-2'>
                                <View className="w-12/12 lg:w-8/12  p-2">
                                    <View className='flex flex-row flex-wrap  border-[0.2px] rounded m-1 p-2 w-12/12'>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Amount</Text>
                                            <Text selectable className='font-bold text-base'>{data.amount}</Text>
                                        </View>
                                        <View className='w-3/12 mb-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Units</Text>
                                            <Text selectable className='font-bold text-base'>{data.units || "-"}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>No Of Installments Executed</Text>
                                            <Text selectable className='font-bold text-base'>{data.noOfInstallmentsExecuted}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Total No Of Installments</Text>
                                            <Text selectable className='font-bold text-base'>{data.totalNoOfInstallments}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Sip Reference Number</Text>
                                            <Text selectable className='font-bold text-base'>{data.sipReferenceNumber}</Text>
                                        </View>


                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Start Date</Text>
                                            <Text selectable className='font-bold text-base'>{data.startDate ? moment(new Date(data.startDate)).format('DD-MM-YYYY') : "-"}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>End Date</Text>
                                            <Text selectable className='font-bold text-base'>{data.endDate ? moment(new Date(data.endDate)).format('DD-MM-YYYY') : "-"}</Text>
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