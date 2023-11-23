import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Badge, Popover } from "native-base";
import { RTAReconcilation } from "../../interfaces/RTAResponseInterface";
import { DateTime } from "luxon";

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
                    <Text selectable className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-2/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>Scheme</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>AMC</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text selectable className='font-semibold'>RTA Agent Code</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>BSE Order No</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text selectable className='font-semibold'>Transaction Date</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start flex-wrap'>
                    <Text selectable className='font-semibold'>Folio No</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>Amount</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start w-4/5'>
                    <Text selectable className='font-semibold'>Transaction Status</Text>
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
            data.map((client: RTAReconcilation, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row w-3/12 flex-wrap'>
                            <View className='flex flex-row items-center justify-start flex-wrap w-full'>
                                <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap'>
                                    <Text selectable className='text-white'>{getInitials(client.account.name)}</Text>
                                </View>
                                <View className='flex flex-col flex-wrap w-9/12'>
                                    <View className='flex flex-row items-center text-black font-semibold flex-wrap w-11/12'>
                                        <Text selectable className='text-black font-semibold break-all'>{client.account.name}&nbsp;</Text>
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
                                                        <Text>PAN Number: {client.account.user[0].panNumber}</Text>
                                                    </View>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover>
                                    </View>
                                    <View className='flex flex-row items-center mt-0'>
                                        <Text selectable className='text-[#6C6A6A] text-sm'>{client.account.clientId}</Text>
                                        {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                    </View>
                                    <View className='flex flex-row items-center mt-0'>
                                        <Text selectable className='text-[#6C6A6A] text-sm'>{client.account.user[0].panNumber}</Text>
                                        {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row  w-2/12 '>
                            <View className='flex flex-col w-9/12'>
                                <Text selectable className='text-[#000000] font-bold whitespace-normal '>{client.mutualfund.name}</Text>
                                <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                {/* <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                    <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.fundhouse.name}</Text> */}
                            </View>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text selectable>
                                {client.mutualfund.fundhouse.name}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            {/* <View> */}
                            <Text selectable>
                                {client.mutualfund.fundhouse.rta}
                            </Text>
                            {/* </View> */}
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text className="w-10/12" selectable>
                                {client.orderReferenceNumber}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text className="w-10/12" selectable>
                                {DateTime.fromISO(client.paymentDate, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss')}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text className="w-10/12" selectable>
                                {client.folioNumber}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12">
                            <Text selectable>
                                {client.amount}
                            </Text>
                        </View>
                        <View className="flex flex-row w-1/12 justify-start">
                            <View className='flex flex-col  h-8 items-center justify-center bg-[#D7D7D7] rounded-full w-11/12'>
                                <View className='flex flex-row items-center '>
                                    <Text selectable className='p-1 text-black text-end md:text-center text-xs'>{client.transactionStatus}&nbsp;</Text>
                                </View>

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