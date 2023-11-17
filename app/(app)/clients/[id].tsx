import { Dimensions, ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Center, HStack, Heading, Pressable, ScrollView, Spinner, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import RemoteApi from '../../../src/services/RemoteApi';
import { Order, OrderDataInterface } from '../../../src/interfaces/OrderDataInterface';
import { ClientDetailItem, ClientDetailResponse } from '../../../src/interfaces/ClientDetailInterface';
import moment from 'moment';

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailItem>()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(true)
        async function getDetails() {
            const response: ClientDetailResponse = await RemoteApi.get(`client/${id}`)
            setData(response.data)
            setIsLoading(false)
        }

        getDetails()
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
                                    <Text selectable className='text-2xl font-extrabold mb-3'>Client Details</Text>
                                    <View className='flex flex-row items-center'>
                                        <Link href={"/"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className='mr-4'>
                                            <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                        </View>
                                        <Link href={"/clients"} className='mr-4'>
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Clients</Text>
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
                                    <Pressable marginRight={0} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                        <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                                    </Pressable>

                                </View>
                            </View>
                            <View className='flex flex-row m-2'>
                                <View className="w-full p-2">
                                    <View className='flex flex-row flex-wrap border-[0.2px] rounded m-1 p-2 w-full'>
                                        <View className='w-3/12 mb-8'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Client Code</Text>
                                            <Text selectable className='font-bold text-base'>{data.clientId}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Customer Name</Text>
                                            <Text selectable className='font-bold text-base'>{data.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Customer Name</Text>
                                            <Text selectable className='font-bold text-base'>{data.name}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>PAN Number</Text>
                                            <Text selectable className='font-bold text-base'>{data.users[0].panNumber}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Is PAN Verfified</Text>
                                            <Text selectable className='font-bold text-base'>{data.users[0].isPanVerified}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Is Active</Text>
                                            <Text selectable className='font-bold text-base'>{data.users[0].isActive}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Aadhar Number</Text>
                                            <Text selectable className='font-bold text-base'>{data.users[0].adhaarNumber}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>KYC Status</Text>
                                            <Text selectable className='font-bold text-base'>{data.users[0].kycStatusId}</Text>
                                        </View>
                                        <View className='w-3/12 mb-8 pr-2'>
                                            <Text selectable className='text-slate-400 text-[#7e7e7e] mb-[1px] font-semibold'>Date Of Birth</Text>
                                            <Text selectable className='font-bold text-base'>{moment(new Date(data.users[0].dateOfBirth)).format('DD-MM-YYYY')}</Text>
                                        </View>

                                    </View>

                                </View>
                            </View>


                        </View>
                    </View>

                </ScrollView >
        }
    </>
    )


}