import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Badge, Popover } from 'native-base';
import moment from "moment";
import { Link, router } from 'expo-router'
import { RupeeSymbol } from "../../helper/helper";

export const MobileClientsRows = ({ data, schema }: { data: AccountItem[], schema: any }) => {

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

    return <>
        {
            data.map((client: AccountItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between flex-wrap border-slate-400 border-[0.2px] rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")}>
                        <View className='flex flex-col w-full'>
                            <View className='flex flex-row items-center w-full justify-between'>
                                <View className='flex flex-row items-center justify-start w-8/12'>
                                    <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                        <Text selectable className='text-white'>{getInitials(client.name)}</Text>
                                    </View>
                                    <View className='flex flex-col w-full'>
                                        <View className='flex flex-row items-center text-black font-semibold break-all w-9/12'>
                                            <Text selectable className='text-black font-semibold break-all'>{client.name}&nbsp;</Text>

                                        </View>
                                        <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-9/12'>
                                            <Text selectable className='text-[#6C6A6A] text-sm'>{client.clientId}</Text>
                                            <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                                            <View className='flex flex-row items-center'>
                                                <Text selectable className='text-[#6C6A6A] text-sm'>{client?.users[0]?.panNumber || "-"}&nbsp;</Text>

                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className='flex flex-col items-center justify-center w-4/12'>
                                    <View className='flex flex-row items-center w-full justify-center'>
                                        <Text selectable className={'p-1  font-bold text-end text-sm ' + (client.isActive ? "text-green-600" : "text-black")}>{client.isActive ? "Active" : 'Inactive'}&nbsp;</Text>
                                    </View>
                                    <View className='flex flex-row items-center rounded-full w-full justify-center'>

                                        <Icon name={client?.users[0]?.kycStatus?.name == "Verified" ? "check" : "xmark"} size={18} style={{ marginRight: 2, width: 15, textAlign: "center" }} color="green" />


                                        <Text selectable className={'p-1 text-black text-end text-xs'}>{client?.users[0]?.kycStatus.name || "-"}&nbsp;</Text>
                                    </View>

                                </View>
                            </View>

                            {/* <View className='flex flex-row items-center justify-between pl-12 mt-1'>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black font-bold text-start'>{client.orderType.name}</Text>
                                    {client.units && <Text selectable className='text-[#6C6A6A] text-xs'>({client.units} units)</Text>}
                                </View>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black text-xs text-center'>{moment(new Date(client.createdAt)).format("DD-MM-YYYY hh:mm:ss A")}</Text>
                                </View>
                            </View> */}

                            {/* <View className='flex flex-row items-center w-full justify-between mt-2'>

                                {
                                    client.mutualfunds.mutualfundType.name == "Switch" &&
                                    <>
                                        <View className='flex flex-col w-5/12 items-start'>
                                            <Text selectable className='text-black text-sm font-semibold max-w-[200px] break-all text-left'>{client.mutualfunds.name}</Text>
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
                                <View className={"flex flex-row " + (screenDimensions.width <= 800 ? "justify-start items-center " : " justify-center items-center ") + (client.mutualfunds.mutualfundType.name == "Switch" ? "w-5/12" : "w-full")} >
                                    <Image
                                        className="mr-2"
                                        style={{ width: 40, height: 40 }}
                                        source={{ uri: client.mutualfunds.fundhouse.logoUrl }}
                                    />
                                    <View className={'flex flex-col justify-end items-start w-8/12'} >
                                        <Text selectable className='text-black font-semibold break-all text-sm flex-wrap' style={{ textAlign: client.mutualfunds.mutualfundType.name == "Switch" ? "right" : (screenDimensions.width <= 600 ? "auto" : "left") }}>{client.mutualfunds.name}</Text>
                                        <View className='flex flex-row items-center flex-wrap'>
                                            <Text selectable className='text-black text-xs'>{client.mutualfunds.mutualfundType.name == "Switch" ? "Switch In" : client.mutualfunds.mutualfundType.name}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View> */}

                            <View className='flex flex-row items-center w-full mt-3'>
                                {/* <TouchableRipple onPress={() => router.push(`orders/${client.id}`)} className='w-full py-2 rounded-full border-[0.4px]'> */}
                                <TouchableRipple rippleColor={"#a2a2a252"} onPress={() => router.push(`clients/${client.id}`)} className='w-full py-2 rounded-full border-[0.4px] bg-black'>
                                    <Text selectable className='text-white text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>
                </View>
            })
        }
    </>
}