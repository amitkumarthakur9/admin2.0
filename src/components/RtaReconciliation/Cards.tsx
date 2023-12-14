import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Badge, Popover } from 'native-base';
import moment from "moment";
import { Link, router } from 'expo-router'
import { RupeeSymbol } from "../../helper/helper";
import { RTAReconcilation } from "../../interfaces/RTAResponseInterface";

export const Cards = ({ data, schema }: { data: RTAReconcilation[], schema: any }) => {

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
        {
            data.map((order: RTAReconcilation, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between flex-wrap border-slate-400 border-[0.2px] rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")}>
                        <View className='flex flex-col w-full'>
                            <View className='flex flex-row items-center w-full justify-between'>
                                <View className='flex flex-row items-center justify-start w-8/12'>
                                    <Pressable onPress={() => router.push(`/clients/${order.account.id}`)} className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                        <Text selectable className='text-white'>{getInitials(order.account.name)}</Text>
                                    </Pressable>
                                    <View className='flex flex-col w-full'>
                                        <View className='flex flex-row items-center text-black font-semibold break-all w-9/12'>
                                            <Text selectable className='text-black font-semibold break-all'>{order.account.name}</Text>

                                        </View>
                                        <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-9/12'>
                                            <Text selectable className='text-[#6C6A6A] text-sm'>{order.account.clientId}</Text>
                                            <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                                            <View className='flex flex-row items-center'>
                                                <Text selectable className='text-[#6C6A6A] text-sm'>{order.account.user[0].panNumber}</Text>

                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className='flex flex-col items-center justify-center w-4/12'>
                                    <View className='flex flex-row items-center w-full justify-center'>
                                        <Text selectable className='p-1 text-black font-bold text-end text-sm'>{RupeeSymbol + order.amount}</Text>
                                    </View>
                                    <View className='flex flex-row items-center rounded-full w-full justify-center'>
                                        <Text selectable className='p-1 text-black text-end text-xs'>{order.transactionStatus}</Text>
                                    </View>

                                </View>
                            </View>

                            <View className='flex flex-row items-center justify-between pl-12 mt-1'>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black font-bold text-start'>{order.folioNumber || "-"}</Text>
                                </View>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black text-xs text-center'>{order.paymentDate && moment(new Date(order.paymentDate)).format("DD-MM-YYYY hh:mm:ss A")}</Text>
                                </View>
                            </View>



                            <View className='flex flex-row items-center w-full justify-start mt-2'>
                                <Image
                                    className="mr-2"
                                    style={{ width: 40, height: 40 }}
                                    source={{ uri: "https://www.fundexpert.in/cdn/logos-neo/icici.png" }}
                                />
                                <View className={'flex flex-col justify-end items-start w-10/12'} >
                                    <Text selectable className='text-black font-semibold break-all text-sm flex-wrap'>{order.mutualfund.fundhouse.name}</Text>
                                    <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>BSE: {order.mutualfund.bseDematSchemeCode}</Text>
                                    </View>
                                    <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>AMC: {order.mutualfund.name}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{order.mutualfund.rtaCode || "-"} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>RTA Code</Text>
                                </View>
                                {/* <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{moment(new Date(order.createdAt)).format("DD-MM-YYYY hh:mm:ss A")} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Initated At</Text>
                                </View> */}
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{order.orderReferenceNumber || '-'} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Order No </Text>
                                </View>
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{order.transactionType || "-"} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Type</Text>
                                </View>

                            </View>

                            {/* <View className='flex flex-row items-center w-full mt-3'>
                                <TouchableRipple onPress={() => router.push(`orders/${order.id}`)} className='w-full py-2 rounded-full border-[0.4px] bg-black'>
                                    <Text selectable className='text-white text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View> */}
                        </View>
                    </View>
                </View>
            })
        }
    </>
}