import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Popover } from "native-base";
import moment from "moment";
import { Link, router } from 'expo-router'

export const OrdersRows = ({ data, schema }: { data: OrderInterface[], schema: any }) => {

    const [screenDimensions, setScreenDimensions] = useState<{ width: number, height: number }>(Dimensions.get('window'));
    const detail = (id) => {
        router.replace('/orders/' + id);
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
        <View className={`hidden md:hidden lg:flex flex-row py-4 px-2 justify-between flex-wrap bg-slate-100`}>
            <View className='flex flex-row w-6/12'>
                <View className='flex flex-row items-center w-5/12 justify-start'>
                    <Text className='font-semibold'>Customer Name</Text>
                </View>

                <View className='flex flex-row items-center w-7/12 justify-center'>
                    <Text className='font-semibold'>Scheme</Text>
                </View>
            </View>

            <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-6/12 justify-between'>
                <View className='flex flex-row items-center sm:w-full md:w-full lg:w-4/12 md:justify-end lg:justify-center'>
                    <Text className='font-semibold'>Process Date Time</Text>
                </View>
                <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-6/12  items-center'>
                    <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                        <Text className='font-semibold'>Amount/Units</Text>
                    </View>

                    <View className='flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
                        <Text className='font-semibold'>Status</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center lg:w-2/12 justify-center'>
                    <Text className='font-semibold'>Action</Text>
                </View>
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
                    <View className={`flex flex-row p-2 justify-between flex-wrap`}>
                        <View className='flex sm:flex-col md:flex-col lg:flex-row w-full md:w-8/12 lg:w-6/12'>
                            <View className='flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-2/5 justify-between'>
                                <DynamicComponentRenderer componentName={"ClientOrderBox"} data={order} />
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center justify-between pl-12 mt-1 md:mt-0 lg:mt-0'>
                                <View className='flex flex-row'>
                                    <Text className='text-black font-bold text-start md:text-center'>₹{order.amount}</Text>
                                    <Text className='text-[#6C6A6A] text-xs'>({order.units} units)</Text>
                                </View>
                                <View className='flex flex-col'>
                                    <Text className='text-black text-xs'>{order.createdAt}</Text>
                                </View>
                            </View>

                            <View className='lg:pl-0 flex flex-row items-center w-full lg:w-3/5 justify-between md:justify-between lg:justify-between mt-2 md:mt-2 lg:mt-0'>

                                {
                                    order.mutualfunds.mutualfundType.name == "Switch" &&
                                    <>
                                        <View className='flex flex-col w-5/12 items-start'>
                                            <Text className='text-black text-sm font-semibold max-w-[200px] break-all text-left'>{order.mutualfunds.name}</Text>
                                            <View className='flex flex-row items-center '>
                                                <Text className='text-black text-xs'>Switch Out</Text>
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
                                <View className={"flex flex-row " + (screenDimensions.width <= 800 ? "justify-start items-center " : " justify-center items-center ") + (order.mutualfunds.mutualfundType.name == "Switch" ? "w-5/12" : "w-full")} >
                                    <Image
                                        className="mr-2"
                                        style={{ width: 40, height: 40 }}
                                        source={{ uri: order.mutualfunds.fundhouse.logoUrl }}
                                    />
                                    <View className={'flex flex-col justify-end items-start'} >
                                        <Text className='text-black font-semibold max-w-[200px] break-all text-sm' style={{ textAlign: order.mutualfunds.mutualfundType.name == "Switch" ? "right" : (screenDimensions.width <= 600 ? "auto" : "left") }}>{order.mutualfunds.name}</Text>
                                        <View className='flex flex-row items-center'>
                                            <Text className='text-black text-xs'>{order.mutualfunds.mutualfundType.name == "Switch" ? "Switch In" : order.mutualfunds.mutualfundType.name}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center w-full mt-3'>
                                <TouchableRipple className='w-full py-2 rounded-full border-[0.4px]'>
                                    <Text className='text-black text-center md:text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View>
                        </View>

                        <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-6/12 justify-between'>
                            <View className='flex flex-row items-center sm:w-full md:w-full lg:w-4/12 md:justify-end lg:justify-center'>
                                <View className='flex flex-col'>
                                    <Text className='text-[#686868] font-semibold'>{moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A")}</Text>
                                </View>
                            </View>
                            <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-6/12  items-center'>
                                <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                                    <View className='flex flex-col md:flex-row lg:flex-col'>
                                        <Text className='text-black font-bold text-start md:text-center'>₹{order.amount}</Text>
                                        {order.units && <Text className='text-[#6C6A6A] text-xs'>({order.units} units)</Text>}
                                    </View>
                                </View>

                                <View className='hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
                                    <View className='flex flex-col bg-[#D7D7D7] rounded-full w-8/12 items-center justify-center '>
                                        <View className='flex flex-row items-center justify-center w-11/12'>
                                            <Popover trigger={triggerProps => {
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
                                            </Popover>
                                            <Text className='p-1 text-black text-end md:text-center text-xs'>{order.orderStatus.name}&nbsp;</Text>

                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className='flex flex-row items-center lg:w-2/12 justify-center md:mt-2 lg:mt-0'>
                                <Link
                                    href={{
                                        pathname: "/orders/[id]",
                                        params: { id: order.id }
                                    }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                    <Text className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                                </Link>
                            </View>
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