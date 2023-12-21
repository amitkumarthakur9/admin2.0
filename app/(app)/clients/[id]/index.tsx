import { Dimensions, Image, ImageBackground, Platform, View, useWindowDimensions } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text, useClipboard } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../../src/services/RemoteApi';
import { Order, OrderDataInterface } from '../../../../src/interfaces/OrderDataInterface';
import { ClientDetailItem, ClientDetailResponse } from '../../../../src/interfaces/ClientDetailInterface';
import moment from 'moment';
import { AccountShadowPhone, BorderShadow, BorderShadowPhone, BreadcrumbShadow } from '../../../../src/components/Styles/Shadow';
import { StyleSheet } from 'react-native';
import { RupeeSymbol } from '../../../../src/helper/helper';
import { TouchableRipple } from 'react-native-paper';

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailItem>()
    const [isLoading, setIsLoading] = useState(true)
    const { height, width } = useWindowDimensions();

    const {
        value,
        onCopy
    } = useClipboard();

    useEffect(() => {
        setIsLoading(true)
        async function getDetails() {
            const response: ClientDetailResponse = await RemoteApi.get(`client/${id}`)
            if (response) {
                setData(response.data)
                setIsLoading(false)
            }
        }

        if (id) {
            getDetails()
        }
    }, [id])

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
                            <View className='flex flex-row justify-between items-center mb-[10px] mt-3 bg-[#eaf3fe] h-28 px-2 ' style={{ ...BreadcrumbShadow }}>
                                <View className='flex flex-col w-6/12'>
                                    <Text selectable className='text-2xl font-extrabold mb-3'>{data.name}</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"../"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text selectable>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/clients"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text selectable>Clients</Text>
                                        </Link>
                                        {/* <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View> */}
                                        {/* <Link href={""} className='mr-4'>
                                            <Text  selectable>{id}</Text>
                                        </Link> */}
                                    </View>
                                </View>
                                {/* <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                                    <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                                        // flex: 1,
                                        // justifyContent: 'center',
                                    }}>

                                    </ImageBackground>
                                </View> */}
                                <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                                    <Image className='' source={require('../../../../assets/images/ChatBc.png')} style={{
                                        // flex: 1,
                                        // justifyContent: 'end',
                                    }} />

                                </View>
                            </View>

                        </View>
                        <View className='flex flex-col mx-2'>
                            <View className='flex flex-row flex-wrap'>
                                <View className='flex flex-col w-full lg:w-4/12 mt-1' >
                                    <View className='flex flex-col rounded p-3 lg:h-[200px] m-0 lg:m-2' style={Platform.OS == "web" ? { ...BorderShadow, overflow: "scroll" } : { ...AccountShadowPhone, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold'>Contact Details</Text>

                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="envelope" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.users[0].credentials[0].email}</Text>
                                        </View>

                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="phone" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.users[0].credentials[0].mobileNumber}</Text>
                                        </View>

                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="address-book" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable className=''>{"-"}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='flex flex-col w-full lg:w-4/12 mt-1' >
                                    <View className='flex flex-col rounded p-3 lg:h-[200px] m-0 lg:m-2' style={Platform.OS == "web" ? { ...BorderShadow, overflow: "scroll" } : { ...AccountShadowPhone, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold'>Profile</Text>
                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="id-badge" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.clientId}</Text>
                                        </View>
                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="credit-card" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.users[0].panNumber}</Text>
                                        </View>


                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name={data.users[0].kycStatus.name == "Verified" ? "check" : "xmark"} size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="green" />
                                            <Text selectable>{data.users[0].kycStatus.name == "Verified" ? "KYC Verified" : "KYC Not Verified"}</Text>
                                        </View>


                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="calendar" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{moment(new Date(data.users[0].dateOfBirth)).format('DD MMM YYYY')}</Text>
                                        </View>

                                    </View>
                                </View>
                                <View className='flex flex-col w-full lg:w-4/12  mt-1' >
                                    <View className='flex flex-col rounded m-0 lg:h-[200px] lg:m-2' style={Platform.OS == "web" ? { ...BorderShadow, overflow: "scroll" } : { ...AccountShadowPhone, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-1 font-bold px-3 pt-3'>Banks</Text>
                                        {
                                            data.bankAccounts.map((bank, index) => {
                                                return <View className='flex flex-row items-start bg-[#f9f8f8] p-3 mb-1' key={index}>
                                                    <View className='flex flex-col items-start justify-start'>
                                                        <Icon name="bank" size={18} style={{ marginRight: 5, paddingTop: 2, width: 20, textAlign: "center" }} color="black" />
                                                    </View>
                                                    <View className='flex flex-col'>
                                                        <Text selectable>{bank.bankBranch.name || "Unknown"}</Text>
                                                        <Text selectable>{bank.accountNumber || "-"}</Text>
                                                        <Text selectable>{bank.bankBranch.ifscCode || "-"}</Text>
                                                    </View>

                                                </View>

                                            })
                                        }

                                    </View>
                                </View>

                                <View className='flex flex-col w-full lg:w-4/12 mt-1' >
                                    <View className='flex flex-col rounded m-0 lg:h-[200px] lg:m-2' style={Platform.OS == "web" ? { ...BorderShadow, overflow: "scroll" } : { ...AccountShadowPhone, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-1 font-bold px-3 pt-3'>Nominee Details</Text>
                                        {
                                            data.nominee.map((nominee, index) => {
                                                return <View className='flex flex-row items-start bg-[#f9f8f8] p-3 mb-1' key={index}>
                                                    <View className='flex flex-col items-start justify-start'>
                                                        <Icon name="user" size={18} style={{ marginRight: 5, paddingTop: 2, width: 20, textAlign: "center" }} color="black" />
                                                    </View>
                                                    <View className='flex flex-col'>
                                                        <Text selectable>{nominee.nomineeInfo.name || "-"}</Text>
                                                        <Text selectable>{nominee.nomineeInfo.relationship.name || "-"}</Text>
                                                        <Text selectable>{nominee.nomineeInfo.dob ? moment(new Date(nominee.nomineeInfo.dob)).format('DD-MM-YYYY') : "-"}</Text>
                                                        <Text selectable>{nominee.nomineeInfo.panNumber || "-"}</Text>
                                                    </View>

                                                </View>

                                            })
                                        }

                                    </View>
                                </View>
                                <View className='flex flex-col w-full lg:w-4/12 mt-1' >
                                    <View className='flex flex-col rounded p-3 lg:h-[200px] m-0 lg:m-2' style={Platform.OS == "web" ? { ...BorderShadow, overflow: "scroll" } : { ...AccountShadowPhone, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold'>Demat Details</Text>

                                        <View className='flex flex-row mb-1 items-center'>
                                            <Text selectable className='pr-1 font-semibold'>BOID:</Text>
                                            <Text selectable>{data.dematAccount.boId}</Text>
                                        </View>

                                        <View className='flex flex-row mb-1 items-center'>
                                            <Text selectable className='pr-1 font-semibold'>DPID:</Text>
                                            <Text selectable>{data.dematAccount.dpId}</Text>
                                        </View>
                                        <View className='flex flex-row mb-1 items-center'>
                                            <Text selectable className='pr-1 font-semibold'>Depository Name:</Text>
                                            <Text selectable>{data.dematAccount.dematAccountType.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View className="flex flex-col my-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Recent Orders</Text>
                                </View>

                                {width < 830 ?
                                    <View className='flex flex-col mt-3'>
                                        {
                                            data.orders.map((order, index) => {
                                                return <View key={index}>
                                                    <View className={`flex flex-row p-2 justify-between flex-wrap rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")} style={{ borderColor: "#367a88", borderWidth: 0.2 }}>
                                                        <View className='flex flex-col w-full'>
                                                            <View className='flex flex-row justify-start items-center'>
                                                                <Pressable onPress={() => onCopy(order.id)} className='flex flex-row items-center'>
                                                                    <Text className='mr-1'>#{order.id}</Text>
                                                                    <Icon name="copy" size={14} color="black" />
                                                                </Pressable>
                                                            </View>
                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>

                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Type</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{"order.type" || "-"} </Text>
                                                                </View>



                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Nav </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{order.nav || '-'} </Text>
                                                                </View>

                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Status</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{'-' || "-"} </Text>
                                                                </View>
                                                            </View>




                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Units </Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{order.units || '-'} </Text>
                                                                </View>
                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Amount</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{`${RupeeSymbol}${order.amount}` || "-"} </Text>
                                                                </View>

                                                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Created At</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px] text-center'>{order.createdAt && moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A") || "-"} </Text>
                                                                </View>

                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                            })
                                        }
                                    </View> :
                                    <View className='flex flex-col mt-3'>
                                        <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Type</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Process Date</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>NAV</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Units</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Amount</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
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
                                            data.orders.map((order, index) => {
                                                return <View key={index}><View className='flex flex-row w-full'>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{"-"}</Text>
                                                    </View>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A") || "-"}</Text>
                                                    </View>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{order.nav || "-"}</Text>
                                                    </View>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{order.units || "-"}</Text>
                                                    </View>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{order.amount ? (RupeeSymbol + order.amount) : "-"}</Text>
                                                    </View>
                                                    <View className='w-2/12 p-3'>
                                                        <Text selectable >{"-"}</Text>
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
                            </View>


                            <View className="flex flex-col my-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Recent Transactions</Text>
                                </View>
                                {width < 830 ?
                                    <View className='flex flex-col mt-3'>
                                        {
                                            data.transactions.map((transaction, index) => {
                                                return <View key={index}>
                                                    <View className={`flex flex-row p-2 justify-between flex-wrap rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")} style={{ borderColor: "#367a88", borderWidth: 0.2 }}>
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
                                    </View> :
                                    <View className='flex flex-col mt-3'>
                                        <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Type</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Payment Date</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Settlement Date</Text>
                                            </View>

                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Units</Text>
                                            </View>
                                            <View className='w-2/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>NAV</Text>
                                            </View>
                                            <View className='w-1/12 py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Amount</Text>
                                            </View>
                                            <View className='w-1/12 py-[9px] px-[9px]'>
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
                                            data?.transactions?.map((transaction, index) => {
                                                return <View key={index}>
                                                    <View className='flex flex-row w-full'>
                                                        <View className='w-2/12 p-3'>
                                                            <Text selectable >{transaction?.transactionType?.name || "-"}</Text>
                                                        </View>
                                                        <View className='w-2/12 p-3'>
                                                            <Text selectable >{transaction?.paymentDate ? moment(new Date(transaction?.paymentDate)).format('DD-MM-YYYY hh:mm:ss A') : "-"}</Text>
                                                        </View>
                                                        <View className='w-2/12 p-3'>
                                                            <Text selectable >{transaction?.settlementDate ? moment(new Date(transaction?.settlementDate)).format('DD-MM-YYYY hh:mm:ss A') : "-"}</Text>
                                                        </View>

                                                        <View className='w-2/12 p-3'>
                                                            <Text selectable >{transaction?.units || "-"}</Text>
                                                        </View>
                                                        <View className='w-2/12 p-3'>
                                                            <Text selectable >{transaction?.nav || "-"}</Text>
                                                        </View>
                                                        <View className='w-1/12 p-3'>
                                                            <Text selectable >{transaction?.amount ? (RupeeSymbol + transaction?.amount) : "-"}</Text>
                                                        </View>
                                                        <View className='w-1/12 p-3'>
                                                            <Text selectable >{transaction?.transactionStatus?.name || "-"}</Text>
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
                            </View>

                            <View className="flex flex-col my-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Holdings</Text>
                                </View>
                                {width < 830 ?
                                    <View className='flex flex-col mt-3'>
                                        {
                                            data.holdings.map((holding, index) => {
                                                return <View key={index}>
                                                    <View className={`flex flex-row p-2 justify-between flex-wrap rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")} style={{ borderColor: "#367a88", borderWidth: 0.2 }}>
                                                        <View className='flex flex-col w-full'>
                                                            <View className='flex flex-row items-center w-full flex-wrap '>
                                                                <View className={"flex flex-row items-center justify-start w-8/12"} >
                                                                    <Image
                                                                        alt='fundHouse'
                                                                        className="mr-2"
                                                                        style={{ width: 40, height: 40, objectFit: "contain" }}
                                                                        source={{ uri: holding.mutualfund.fundhouse.logoUrl }}
                                                                    />
                                                                    <View className={'flex flex-col justify-end items-start'} >
                                                                        <Text selectable className='text-black font-semibold break-all text-sm flex-wrap' >{holding.mutualfund.name}</Text>

                                                                        <View className='flex flex-row items-center flex-wrap'>
                                                                            <Text selectable className=' text-blacktext-xs'>{holding.mutualfund.fundhouse.name}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>

                                                                <View className='flex flex-col items-center w-3/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Units</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{holding.units || "-"} </Text>
                                                                </View>



                                                                <View className='flex flex-col items-center w-3/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Avg Nav</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{holding.avgNav || '-'} </Text>
                                                                </View>

                                                                <View className='flex flex-col items-center w-3/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Current Value</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{holding.currentValue ? (RupeeSymbol + holding.currentValue) : "-"} </Text>
                                                                </View>

                                                                <View className='flex flex-col items-center w-3/12 justify-center'>
                                                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Invested Value</Text>

                                                                    <Text selectable className='text-black font-bold text-[13px]'>{holding.investedValue ? (RupeeSymbol + holding.investedValue) : "-"} </Text>
                                                                </View>
                                                            </View>
                                                            <View className='flex flex-row items-center w-full mt-3'>
                                                                {/* <TouchableRipple onPress={() => router.push(`orders/${order.id}`)} className='w-full py-2 rounded-full border-[0.4px]'> */}
                                                                <TouchableRipple rippleColor={"#a2a2a252"} onPress={() => router.push(`clients/${id}/holdings/${holding.id}/`)} className='w-full py-2 rounded-full border-[0.4px] bg-black'>
                                                                    <Text selectable className='text-white text-center text-xs'>View Details</Text>
                                                                </TouchableRipple>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            })
                                        }
                                    </View> :
                                    <View className='flex flex-col mt-3'>
                                        <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                            <View className='w-[18%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Mutual Fund</Text>
                                            </View>
                                            <View className='w-[18%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Units</Text>
                                            </View>
                                            <View className='w-[18%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Avg NAV</Text>
                                            </View>
                                            <View className='w-[18%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Current Value</Text>
                                            </View>
                                            <View className='w-[18%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Invested Value</Text>
                                            </View>
                                            <View className='w-[10%] py-[9px] px-[9px]'>
                                                <Text selectable className='font-semibold'>Action</Text>
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
                                            data.holdings.map((holding, index) => {
                                                return <View key={index}>
                                                    <View className='flex flex-row w-full'>
                                                        <View className='w-[18%] p-3'>
                                                            <Text selectable >{holding.mutualfund.name || "-"}</Text>
                                                        </View>
                                                        <View className='w-[18%] p-3'>
                                                            <Text selectable >{holding.units || "-"}</Text>
                                                        </View>
                                                        <View className='w-[18%] p-3'>
                                                            <Text selectable >{holding.avgNav || "-"}</Text>
                                                        </View>
                                                        <View className='w-[18%] p-3'>
                                                            <Text selectable >{holding.currentValue ? (RupeeSymbol + holding.currentValue) : "-"}</Text>
                                                        </View>
                                                        <View className='w-[18%] p-3'>
                                                            <Text selectable >{holding.investedValue ? (RupeeSymbol + holding.investedValue) : "-"}</Text>
                                                        </View>
                                                        <View className='w-[10%] p-3'>
                                                            <Link
                                                                // href={`/clients/${id}/holdings/${holding.id}`}
                                                                href={{
                                                                    pathname: "/clients/[id]/holdings/[holdingId]",
                                                                    params: { id: id, holdingId: holding.id }
                                                                }}
                                                                className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                                                <Text selectable className='text-white text-center text-xs w-10/12'>View</Text>
                                                            </Link>
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
                            </View>
                        </View>
                    </View>

                </ScrollView >
        }
    </>
    )


}