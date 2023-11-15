import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Badge, Popover } from "native-base";

export const RTAReconciliationRows = ({ data, schema }) => {

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
        <View className={`flex flex-row py-4 px-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')}>
            <View className='flex flex-row w-3/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-2/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>Scheme</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>AMC</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text className='font-semibold'>RTA Agent Code</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>BSE Order No</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text className='font-semibold'>Transaction Date</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>Folio No</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>Amount</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text className='font-semibold'>Reconciled Type</Text>
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
            data.map((client: AUMDataItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row w-3/12'>
                            <View className='flex flex-row items-center justify-start w-full'>
                                <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                    <Text className='text-white'>{getInitials(client.account.name)}</Text>
                                </View>
                                <View className='flex flex-col'>
                                    <View className='flex flex-row items-center text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>
                                        <Text className='text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>{client.account.name}&nbsp;</Text>
                                        <Popover trigger={triggerProps => {
                                            return <TouchableOpacity {...triggerProps}>
                                                <Icon name="info-circle" size={12} color="black" />
                                            </TouchableOpacity>;
                                        }}>
                                            <Popover.Content accessibilityLabel="Order Details" w="56">
                                                <Popover.Arrow />
                                                <Popover.CloseButton />
                                                <Popover.Header>Customer Detail</Popover.Header>
                                                <Popover.Body>
                                                    <View>
                                                        <Text>Name: {client.account.name}</Text>
                                                        <Text>PAN Number: {"LAJPS2908"}</Text>
                                                        <Text>Distributor CompanyId: {client.distributor.distributorCompanyId}</Text>
                                                    </View>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover>
                                    </View>
                                    <View className='flex flex-row items-center mt-0'>
                                        <Text className='text-[#6C6A6A] text-sm'>{"T97C5"}</Text>
                                        {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                    </View>
                                    <View className='flex flex-row items-center mt-0'>
                                        <Text className='text-[#6C6A6A] text-sm'>{"LAJPS2412N"}</Text>
                                        {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row  w-2/12 '>
                            <View className='flex flex-col '>
                                <Text className='text-[#000000] font-bold whitespace-normal max-w-[200px] '>{"Dsp Flexi Cap Fund - Regular Plan - Idcw Reinvestment"}</Text>
                                <Text className='text-[#686868] font-semibold'>{"DS10-DR"}</Text>
                                {/* <Text className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.fundhouse.name}</Text> */}
                            </View>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'CAMS'}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <View>
                                <Text>
                                    {'DSP10'}
                                </Text>
                                <Text>
                                    {'DSP_MF'}
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'898295595'}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'10/11/23'}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'78814912676'}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'2000'}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <View className='flex flex-col bg-[#D7D7D7] px-2 h-8 items-center justify-center rounded-full'>
                                {/* <View className='flex flex-row items-center'> */}
                                <Text className='p-1 text-black text-end md:text-center text-xs'>{'Non Reconciled'}&nbsp;</Text>
                                {/* </View> */}

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