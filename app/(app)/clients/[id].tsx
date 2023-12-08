import { Dimensions, ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { Order, OrderDataInterface } from '../../../src/interfaces/OrderDataInterface';
import { ClientDetailItem, ClientDetailResponse } from '../../../src/interfaces/ClientDetailInterface';
import moment from 'moment';
import { BorderShadow } from '../../../src/components/Styles/Shadow';
import { StyleSheet } from 'react-native';
import { RupeeSymbol } from '../../../src/helper/helper';

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailItem>()
    const [isLoading, setIsLoading] = useState(true)
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
                                <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                                    <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                                        // flex: 1,
                                        // justifyContent: 'center',
                                    }}>

                                    </ImageBackground>
                                </View>
                            </View>

                        </View>
                        <View className='flex flex-col mx-5'>

                            <View className='flex flex-row flex-wrap'>
                                <View className='flex flex-col w-4/12' >
                                    <View className='flex flex-col m-2 rounded p-3' style={{ ...BorderShadow, height: 200, overflow: "scroll" }}>
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
                                <View className='flex flex-col w-4/12' >
                                    <View className='flex flex-col m-2 rounded' style={{ ...BorderShadow, height: 200, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold p-3'>Banks</Text>
                                        {
                                            data.bankAccounts.map((bank, index) => {
                                                return <View className='flex flex-row items-start bg-[#f9f8f8] p-3 mb-1'>
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
                                <View className='flex flex-col w-4/12' >
                                    <View className='flex flex-col m-2 rounded p-3' style={{ ...BorderShadow, height: 200, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold'>Profile</Text>
                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="id-badge" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.clientId}</Text>
                                        </View>
                                        <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="credit-card" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text selectable>{data.users[0].panNumber}</Text>
                                        </View>

                                        {/* <View className='flex flex-row mb-1 items-center'>
                                            <Icon name="id-card" size={18} style={{ marginRight: 5, width: 20, textAlign: "center" }} color="black" />
                                            <Text  selectable>{"830934209342803"}</Text>
                                        </View> */}

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

                                <View className='flex flex-col w-4/12' >
                                    <View className='flex flex-col m-2 rounded' style={{ ...BorderShadow, height: 200, overflow: "scroll" }}>
                                        <Text selectable className='text-base mb-4 font-bold p-3'>Nominee Details</Text>
                                        {
                                            data.nominee.map((nominee, index) => {
                                                return <View className='flex flex-row items-start bg-[#f9f8f8] p-3 mb-1'>
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

                                <View className='flex flex-col w-4/12' >
                                    <View className='flex flex-col m-2 rounded p-3' style={{ ...BorderShadow, height: 200, overflow: "scroll" }}>
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


                            <View className="flex flex-col m-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Orders</Text>
                                </View>
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
                                            return <><View className='flex flex-row w-full'>
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
                                            </>
                                        })
                                    }
                                </View>
                            </View>

                            <View className="flex flex-col m-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Transactions</Text>
                                </View>
                                <View className='flex flex-col mt-3'>
                                    <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Order ID</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Created Date</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Units</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Nav</Text>
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
                                            return <><View className='flex flex-row w-full'>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{order.id}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A") || "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{order.units || "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{order.nav || "-"}</Text>
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
                                            </>
                                        })
                                    }
                                </View>
                            </View>

                            <View className="flex flex-col m-4">
                                <View className='flex flex-row justify-start'>
                                    <Text className='font-bold text-base'>Holdings</Text>
                                </View>
                                <View className='flex flex-col mt-3'>
                                    <View className='flex flex-row bg-[#e3e3e3] rounded-t'>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Mutual Fund</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Units</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Avg NAV</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Current Value</Text>
                                        </View>
                                        <View className='w-2/12 py-[9px] px-[9px]'>
                                            <Text selectable className='font-semibold'>Invested Value</Text>
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
                                            return <><View className='flex flex-row w-full'>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{holding.mutualfund.name || "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{holding.units || "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{holding.avgNav || "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{holding.currentValue ? (RupeeSymbol + holding.currentValue) : "-"}</Text>
                                                </View>
                                                <View className='w-2/12 p-3'>
                                                    <Text selectable >{holding.investedValue ? (RupeeSymbol + holding.investedValue) : "-"}</Text>
                                                </View>
                                            </View>
                                                <View
                                                    className='mb-2'
                                                    style={{
                                                        borderColor: '#e4e4e4',
                                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                                    }}
                                                />
                                            </>
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView >
        }
    </>
    )


}