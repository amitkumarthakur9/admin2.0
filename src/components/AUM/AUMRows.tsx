import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Popover } from "native-base";
import { Link } from "expo-router";

export const AUMRows = ({ data, schema }) => {

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
            <View className='flex flex-row w-4/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text className='font-semibold'>PAN</Text>
                </View>
            </View>

            <View className='hidden md:flex lg:flex flex-row w-7/12 justify-between'>
                <View className='flex flex-row items-center w-6/12 justify-center'>
                    <Text className='font-semibold'>Scheme Name</Text>
                </View>
                <View className='flex flex-row w-4/12  items-center'>
                    <View className='flex flex-row items-center w-1/2 justify-center'>
                        <Text className='font-semibold'>Folio Number</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center w-2/12 justify-center'>
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
            data.map((client: AUMDataItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row w-full w-4/12'>
                            <View className='flex flex-row items-center w-full justify-between'>
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
                                            <Text className='text-[#6C6A6A] text-sm'>{client.account.clientId}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'LAJPS2390'}
                            </Text>
                        </View>

                        <View className='flex flex-row w-7/12 justify-between'>
                            <View className='flex flex-row items-center w-6/12 justify-center'>
                                <View className='flex flex-col'>
                                    <Text className='text-[#000000] font-bold'>{client.mutualfund.name}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.mutualfundSubcategory.name}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.fundhouse.name}</Text>
                                </View>
                            </View>
                            <View className='flex flex-row w-4/12 items-center'>
                                <View className='flex flex-row items-center w-1/2 justify-center'>
                                    <View className='flex flex-col bg-[#D7D7D7] px-2 py-1 rounded-full'>
                                        <View className='flex flex-row items-center'>
                                            <Text className='p-1 text-black text-end md:text-center text-xs'>{client.folioNumber}&nbsp;</Text>
                                            <Popover trigger={triggerProps => {
                                                return <TouchableOpacity {...triggerProps}>
                                                    <Icon name="info-circle" size={12} color="black" />
                                                </TouchableOpacity>;
                                            }}>
                                                <Popover.Content accessibilityLabel="Order Details" w="56">
                                                    <Popover.Arrow />
                                                    <Popover.CloseButton />
                                                    <Popover.Header>Folio Details</Popover.Header>
                                                    <Popover.Body>
                                                        <View>
                                                            <Text>Current Nav: </Text>
                                                            <Text>Current Value: </Text>
                                                            <Text>Balance Units:</Text>
                                                            <Text>NavDate: </Text>
                                                            <Text>NAV: </Text>
                                                        </View>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className='flex flex-row items-center w-2/12 justify-center mt-0'>
                                <Link
                                    href={{
                                        pathname: "/aum/[id]",
                                        params: { id: client.id }
                                    }} className='px-4 md:px-10 lg:px-4 py-1 rounded-full border-[0.4px]'>
                                    <Text className='text-black text-start md:text-center text-xs'>View Details</Text>
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