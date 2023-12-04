import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Badge, Popover } from "native-base";
import moment from "moment";
import { Link, router } from 'expo-router'

export const OrdersRows = ({ data, schema }: { data: OrderInterface[], schema: any }) => {

    const [screenDimensions, setScreenDimensions] = useState<{ width: number, height: number }>(Dimensions.get('window'));
    const detail = (id) => {
        router.replace('/orders/' + id);
    }

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

    useEffect(() => {
        const updateScreenDimensions = () => {
            const { width, height } = Dimensions.get('window');
            setScreenDimensions({ width, height });
            // console.log('screenDimensions', { width, height });
        };
        // 


        // Subscribe to changes in screen dimensions
        Dimensions.addEventListener('change', updateScreenDimensions);

        // Cleanup the event listener when the component unmounts
        // return () => {
        //   // Dimensions.removeAllListeners('change', updateScreenDimensions);
        // };
    }, []);
    return <>
        <View className={`flex flex-row py-4 px-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')}>
            <View className='flex flex-row items-center w-2/12'>
                <Text selectable className='font-semibold'>Customer Name</Text>
            </View>
            <View className='flex flex-row items-center justify-center w-1/12'>
                <Text selectable className='font-semibold'>Type</Text>
            </View>
            <View className='flex flex-row items-center w-4/12 justify-center'>
                <Text selectable className='font-semibold'>Scheme</Text>
            </View>
            <View className='flex flex-row items-center w-2/12 justify-center'>
                <Text selectable className='font-semibold w-8/12'>Process Date Time</Text>
            </View>
            <View className='flex flex-row items-center w-1/12 justify-center'>
                <View className='flex flex-row items-center w-9/2 justify-center'>
                    <Text selectable className='font-semibold'>Amount/Units</Text>
                </View>
            </View>
            <View className='flex flex-row items-center w-1/12 justify-center'>
                <Text selectable className='font-semibold'>Status</Text>
            </View>
            <View className='flex flex-row items-center w-1/12 justify-center'>
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
            data.map((order: OrderInterface, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row items-center w-2/12 justify-center'>
                            <View className='flex flex-col w-11/12 flex-wrap'>
                                <View className='flex flex-row items-center text-black font-semibold break-all'>
                                    <Text selectable className='text-black font-semibold break-all'>{order.account.name}&nbsp;</Text>
                                </View>
                                <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-12/12'>
                                    <Text selectable className='text-[#6C6A6A] text-sm'>{order.account.clientId}</Text>
                                    <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                                    <View className='flex flex-col items-start w-11/12 flex-wrap'>
                                        <Text selectable className='text-[#6C6A6A] text-sm'>Order No. </Text>
                                        <Text selectable className='text-[#6C6A6A] text-sm'>{order.orderReferenceNumber} </Text>

                                        {/* <Popover trigger={triggerProps => {
                                            return <TouchableOpacity {...triggerProps}>
                                                <Icon name="info-circle" size={12} color="black" />
                                            </TouchableOpacity>;
                                        }}>
                                            <Popover.Content accessibilityLabel="Order Details" w="56">
                                                <Popover.Arrow />
                                                <Popover.CloseButton />
                                                <Popover.Header>Order Details</Popover.Header>
                                                <Popover.Body>
                                                    <View>
                                                        <Text>Ref Number: {order.orderReferenceNumber}</Text>
                                                        <View className="flex flex-row mt-4">
                                                            <Text>Order Type: </Text>

                                                            <Badge colorScheme="success" alignSelf="center" >
                                                                {order.orderType.name}
                                                            </Badge>
                                                        </View>

                                                    </View>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <View className='flex flex-col items-center'>
                                <Text selectable className='text-[#686868] font-semibold w-12/12'>{order.orderType.name}</Text>
                            </View>
                        </View>
                        <View className='flex flex-row items-center w-4/12 justify-center'>

                            {
                                order.mutualfunds.mutualfundType.name == "Switch" &&
                                <>
                                    <View className='flex flex-col w-5/12 items-start'>
                                        <Text selectable className='text-black text-sm font-semibold max-w-[200px] break-all text-left'>{order.mutualfunds.name}</Text>
                                        <View className='flex flex-row items-center '>
                                            <Text selectable className='text-black text-xs'>Switch Out</Text>
                                        </View>
                                    </View>

                                    <View className='px-1 w-2/12 h-2 items-center'>
                                        <ImageBackground className='w-10/12' source={require('../../../assets/arrow.png')} resizeMode="contain" style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                        }}>

                                        </ImageBackground>
                                    </View>

                                </>

                            }
                            <View className={"flex flex-row w-8/12 items-center justify-center"} >
                                <Image
                                    className="mr-2"
                                    style={{ width: 40, height: 40 }}
                                    source={{ uri: order.mutualfunds.fundhouse.logoUrl }}
                                />
                                <View className={'flex flex-col justify-end items-start w-8/12'} >
                                    <Text selectable className='text-black font-semibold break-all text-sm flex-wrap' style={{ textAlign: order.mutualfunds.mutualfundType.name == "Switch" ? "right" : (screenDimensions.width <= 600 ? "auto" : "left") }}>{order.mutualfunds.name}</Text>
                                    <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>{order.mutualfunds.mutualfundType.name == "Switch" ? "Switch In" : order.mutualfunds.mutualfundType.name}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>
                        <View className='flex flex-row items-center w-2/12 justify-center'>
                            <View className='flex flex-col items-center'>
                                <Text selectable className='text-[#686868] font-semibold w-8/12'>{moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A")}</Text>
                            </View>
                        </View>
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <View className='flex flex-col items-center'>
                                <Text selectable className='text-black font-bold text-start'>₹{order.amount}</Text>
                                {order.units && <Text selectable className='text-[#6C6A6A] text-xs'>({order.units} units)</Text>}
                            </View>
                        </View>
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <View className='flex flex-col  w-8/12 items-center justify-center '>
                                <View className='flex flex-row items-center justify-center w-11/12'>
                                    {/* <Popover trigger={triggerProps => {
                                        return <TouchableOpacity {...triggerProps}>
                                            <Icon name="info-circle" size={12} color="black" />
                                        </TouchableOpacity>;
                                    }}>
                                        <Popover.Content accessibilityLabel="Order Details" w="56">
                                            <Popover.Arrow />
                                            <Popover.CloseButton />
                                            <Popover.Header>Order Status</Popover.Header>
                                            <Popover.Body>
                                                <View>
                                                    <Text>Status</Text>
                                                </View>
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover> */}
                                    <Text selectable className='p-1 text-black text-end md:text-center text-xs'>{order.orderStatus.name}&nbsp;</Text>

                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <Link
                                href={{
                                    pathname: "/orders/[id]",
                                    params: { id: order.id }
                                }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-center text-xs w-10/12'>View</Text>
                            </Link>
                            {/* <ViewButton url={"/orders/[id]"} params={{ id: order.id }} /> */}
                        </View>
                    </View>
                    {
                        index < data.length - 1 && <View
                            className='my-2'
                            style={{
                                borderColor: '#e4e4e4',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                    }
                </View>
            })
        }
    </>
}