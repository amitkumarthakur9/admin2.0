import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Popover } from "native-base";

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
        <View className={`hidden md:hidden lg:flex flex-row py-4 px-2 justify-between flex-wrap`}>
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

            <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-7/12 justify-between'>
                <View className='flex flex-row items-center sm:w-full md:w-full lg:w-6/12 md:justify-end lg:justify-center'>
                    <Text className='font-semibold'>Scheme Name</Text>
                </View>
                <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-4/12  items-center'>
                    <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                        <Text className='font-semibold'>Folio Number</Text>
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
            data.map((client: AUMDataItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between flex-wrap`}>
                        <View className='flex sm:flex-col md:flex-col lg:flex-row w-full md:w-8/12 lg:w-4/12'>
                            <View className='flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-full justify-between'>
                                <View className='flex flex-row items-center justify-start lg:justify-start w-10/12 lg:w-full'>
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
                                        <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0'>
                                            <Text className='text-[#6C6A6A] text-sm'>{client.account.clientId}</Text>
                                            {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                        </View>
                                    </View>
                                </View>

                                <View className='flex md:flex lg:hidden flex-row items-center justify-center w-2/12 bg-[#D7D7D9] rounded-full'>
                                    <View className='flex flex-row items-center'>
                                        <Text className='p-1 text-black text-end md:text-center text-xs'>{client.account.name}&nbsp;</Text>
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
                                    </View>
                                </View>
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center justify-between pl-12 mt-1 md:mt-0 lg:mt-0'>
                                <View className='flex flex-row'>
                                    <Text className='text-black font-bold text-start md:text-center'>{client.id}</Text>
                                    {/* <Text className='text-[#6C6A6A] text-xs'>({client.units} units)</Text> */}
                                </View>
                                <View className='flex flex-col'>
                                    <Text className='text-black text-xs'>{client.id ? "Ture" : 'False'}</Text>
                                </View>
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center w-full mt-3'>
                                <TouchableRipple className='w-full py-2 rounded-full border-[0.4px]'>
                                    <Text className='text-black text-center md:text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View>
                        </View>

                        <View className="flex flex-row w-1/12">
                            <Text>
                                {'LAJPS2390'}
                            </Text>
                        </View>

                        <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-7/12 justify-between'>
                            <View className='flex flex-row items-center sm:w-full md:w-full lg:w-6/12 md:justify-end lg:justify-center'>
                                <View className='flex flex-col'>
                                    <Text className='text-[#000000] font-bold'>{client.mutualfund.name}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.mutualfundSubcategory.name}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                    <Text className='text-[#686868] font-semibold'>{client.mutualfund.fundhouse.name}</Text>
                                </View>
                            </View>
                            <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-4/12  items-center'>
                                <View className='hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
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
                            <View className='flex flex-row items-center lg:w-2/12 justify-center md:mt-2 lg:mt-0'>
                                <TouchableRipple className='px-4 md:px-10 lg:px-4 py-1 rounded-full border-[0.4px]'>
                                    <Text className='text-black text-start md:text-center text-xs'>View Details</Text>
                                </TouchableRipple>
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