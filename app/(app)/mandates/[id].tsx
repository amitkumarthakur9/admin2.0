import { Dimensions, ImageBackground, View, StyleSheet, Platform } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Avatar, Button, Center, HStack, Heading, Image, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { Order, OrderDataInterface } from '../../../src/interfaces/OrderDataInterface';
import { BorderShadow, BorderShadowPhone, HeaderShadow } from '../../../src/components/Styles/Shadow';
import moment from 'moment';
import { RupeeSymbol } from '../../../src/helper/helper';
import { AUMDetailInterface, AUMDetailResponseInterface } from '../../../src/interfaces/AUMDetailResponseInterface';
import { useWindowDimensions } from 'react-native';
import { MandateDetailInterface, MandateDetailInterfaceResponse } from '../../../src/interfaces/MandateDetailResponseInterface';


export default function MandateDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<MandateDetailInterface>()
    const [isLoading, setIsLoading] = useState(true)
    const { height, width } = useWindowDimensions();


    useEffect(() => {
        setIsLoading(true)
        async function getOrderDetails() {
            const response: MandateDetailInterfaceResponse = await RemoteApi.get(`mandate/${id}`)
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

    const getColorCode = (status: string) => {
        let color = "#ece09d";
        if (status == "Cancelled" || status == "Failed") {
            color = "#ffd5d5";
        } else if (status == "Success") {
            color = "#afc9a2";
        }

        return color
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
                                    <Text selectable className='text-2xl font-extrabold mb-3'>Mandate #{data.mandateId}</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"../"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/mandates"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Mandate</Text>
                                        </Link>
                                        {/* <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View> */}
                                        {/* <Link href={""} className='mr-4'>
                                            <Text>{id}</Text>
                                        </Link> */}
                                    </View>
                                </View>
                                <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                                    <Image className='' source={require('../../../assets/images/ChatBc.png')} style={{
                                        // flex: 1,
                                        // justifyContent: 'end',
                                    }} />
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
                            <View className="flex flex-row p-2 mx-2 items-center rounded" style={Platform.OS == "web" ? BorderShadow : BorderShadowPhone}>
                                <View className='flex flex-row items-center p-2'>
                                    <View className='flex flex-col '>
                                        {/* <Link href={`/clients/${data.account.user.id}`} className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                            <Text selectable className='text-white text-center'>{getInitials(data.account.name)}</Text>
                                        </Link> */}
                                        <Pressable onPress={() => router.push(`/clients/${data.account.id}`)} className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                            <Text selectable className='text-white'>{getInitials(data.account.name)}</Text>
                                        </Pressable>
                                    </View>
                                    <View className='flex flex-col ml-1'>
                                        <Text selectable className='font-bold text-base'>{data.account.name}</Text>
                                        <View className='flex flex-row items-center'>
                                            <Text selectable className=' text-xs'>{data.account.clientId}</Text>
                                            <View className='mx-2'>
                                                <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                            </View>
                                            {/* <Text selectable className=' text-xs'>{data.account.user.panNumber}</Text> */}
                                        </View>

                                    </View>

                                </View>
                            </View>

                            <View className="flex flex-col mx-2 my-4 items-center justify-between rounded" style={Platform.OS == "web" ? BorderShadow : BorderShadowPhone}>
                                <View className='flex flex-col w-full p-2'>
                                    {/* <View className='flex flex-row items-center w-full flex-wrap '>
                                        <View className={"flex flex-row items-center justify-start w-8/12"} >

                                            <Image
                                                alt='fundHouse'
                                                className="mr-2"
                                                style={{ width: 40, height: 40, objectFit: "contain" }}
                                                source={{ uri: data.mutualfund?.fundhouse?.logoUrl }}
                                            />
                                            <View className={'flex flex-col justify-end items-start'} >
                                                <Text selectable className='text-black font-semibold break-all text-sm flex-wrap' >{data?.mutualfund?.name || "-"}</Text>

                                                <View className='flex flex-row items-center flex-wrap'>
                                                    <Text selectable className=' text-blacktext-xs'>{data?.mutualfund?.mutualfundSubcategory?.mutualfundCategory?.name || "-"}</Text>
                                                    <View className='mx-2'>
                                                        <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                                    </View>
                                                    <Text selectable className='text-black text-xs'>{data?.mutualfund?.mutualfundSubcategory?.name || "-"}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View> */}
                                    <View className='flex flex-row items-center justify-start w-full flex-wrap mt-4 p-3'>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col  w-8/12'>
                                                <Text selectable className='text-[12px]'>{data.mandateStatus.name || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"Mandate Status"}</Text>
                                            </View>
                                        </View>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col  w-8/12'>
                                                <Text selectable className='text-[12px]'>{data.amount ? (RupeeSymbol + data.amount) : "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"Amount"}</Text>
                                            </View>
                                        </View>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col  w-8/12'>
                                                <Text selectable className='text-[12px]'>{data.mandateId ?? "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"mandateId"}</Text>
                                            </View>
                                        </View>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.bankName  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Bank Name"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.accountNumber  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Account No"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.branchName  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Branch Name"}</Text>
                                            </View>
                                        </View>
                                     
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.ifscCode  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Bank IFSC"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.bankAccountType.name  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Account Type"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px] '>{data.bankAccount.bankAccountType.name  || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Account Type"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px]'>{data.startDate ? moment(new Date(data.startDate)).format("DD-MM-YYYY hh:mm:ss A") : "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"Start Date"}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col w-8/12'>
                                                <Text selectable className='text-[12px]'>{data.endDate ? moment(new Date(data.endDate)).format("DD-MM-YYYY hh:mm:ss A") : "-"}</Text>
                                                <Text className='text-[10px] text-slate-500 ' selectable>{"End Date"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View className='flex flex-row items-center justify-start w-full flex-wrap mt-4 p-3'>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px]"} >
                                            <View className='flex flex-col'>
                                                <Text selectable className='font-medium text-wrap w-8/12'>{data.bankAccount.bankName || "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"Bank Name"}</Text>
                                            </View>
                                        </View>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px] "} >
                                            <View className='flex flex-col'>
                                                <Text selectable className='font-medium'>{data.amount ? (RupeeSymbol + data.amount) : "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"Amount"}</Text>
                                            </View>
                                        </View>
                                        <View className={"flex flex-row items-center justify-center w-4/12 mb-[30px] "} >
                                            <View className='flex flex-col'>
                                                <Text selectable className='font-medium'>{data.mandateId ?? "-"}</Text>
                                                <Text className='text-[10px] text-slate-500' selectable>{"mandateId"}</Text>
                                            </View>
                                        </View>
                                    </View> */}
                                    
                                </View>
                                {/* <View className='flex flex-col w-full rounded-b' style={{ backgroundColor: getColorCode(data.orderStatus.name) }}>
                                    <View className='flex flex-row items-center w-full flex-wrap py-3 px-2'>
                                        <Text selectable className='font-normal text-[10px]'>{data.remark}</Text>
                                    </View>
                                </View> */}
                            </View>

                            <View className="flex flex-col m-2">
                                {/* <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Transactions</Text>
                                </View>
                                {width < 830 ?
                                    <View className='flex flex-col mt-3'>
                                        {
                                            data.transactions.map((transaction, index) => {
                                                return <View key={index}>
                                                    <View className={`flex flex-row p-2 justify-between flex-wrap rounded-xl   mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")} style={{ borderColor: "#367a88", borderWidth: 0.2 }}>
                                                        <View className='flex flex-col w-full'>
                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Amount</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.amount || "-"} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Units </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.units || '-'} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Nav </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.nav || '-'} </Text>
                                                                </View>

                                                            </View>
                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Nav Allotment Date</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.navAllotmentDate && moment(new Date(transaction.navAllotmentDate)).format("DD-MM-YYYY hh:mm:ss A") || "-"} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Settlement Date </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.settlementDate && moment(new Date(transaction.settlementDate)).format("DD-MM-YYYY hh:mm:ss A") || "-"} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Payment Date</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.paymentDate && moment(new Date(transaction.paymentDate)).format("DD-MM-YYYY hh:mm:ss A") || "-"} </Text>
                                                                </View>

                                                            </View>



                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Settlement Type</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.settlementType || "-"} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Transaction Status </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.transactionStatus.name || '-'} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Type</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{transaction.transactionType.name || "-"} </Text>
                                                                </View>

                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                            })
                                        }
                                    </View>

                                    : <View className='flex flex-col mt-3'>
                                        <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Payment Date</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Nav Allotment Date</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Settlement Date</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Transaction Type</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Settlement Type</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Units</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>NAV</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Amount</Text>
                                            </View>
                                            <View className='w-[11.11%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Status</Text>
                                            </View>
                                        </View>
                                        <View
                                            className='mb-2'
                                            style={{
                                                borderColor: '#e4e4e4',
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                            }}
                                        />
                                        {
                                            data.transactions.map((transaction, index) => {
                                                return <View key={index}>
                                                    <View className='flex flex-row w-full'>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.paymentDate || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.navAllotmentDate || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.settlementDate || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.transactionType.name || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.settlementType || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.units || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.nav || "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.amount ? (RupeeSymbol + transaction.amount) : "-"}</Text>
                                                        </View>
                                                        <View className='w-[11.11%] p-3'>
                                                            <Text selectable >{transaction.transactionStatus.name || "-"}</Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        className='mb-2'
                                                        style={{
                                                            borderColor: '#e4e4e4',
                                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                                        }}
                                                    />
                                                </View>
                                            })
                                        }
                                    </View>
                                }
                            </View> */}
                        </View>
                    </View>
                    </View>
                </ScrollView >
        }
    </>
    )


}