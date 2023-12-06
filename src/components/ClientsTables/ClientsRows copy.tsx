import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Popover } from "native-base";
import { Link } from "expo-router";

export const ClientsRows = ({ data, schema }) => {
    return <>
        <View className={`hidden md:hidden lg:flex flex-row py-4 px-2 justify-between flex-wrap`}>
            <View className='flex flex-row w-4/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>PAN</Text>
                </View>
            </View>

            <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-7/12 justify-between'>
                <View className='flex flex-row items-center sm:w-full md:w-full lg:w-4/12 md:justify-end lg:justify-center'>
                    <Text selectable className='font-semibold'>Active Type</Text>
                </View>
                <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-6/12  items-center'>
                    <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                        <Text selectable className='font-semibold'>Client DOI</Text>
                    </View>

                    <View className='flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
                        <Text selectable className='font-semibold'>KRA Status</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center lg:w-2/12 justify-center'>
                    <Text selectable className='font-semibold'>Action</Text>
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
            data.map((client: AccountItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between flex-wrap`}>
                        <View className='flex sm:flex-col md:flex-col lg:flex-row w-full md:w-8/12 lg:w-4/12'>
                            <View className='flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-full justify-between'>
                                <DynamicComponentRenderer componentName={"ClientBox"} data={client} />
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center justify-between pl-12 mt-1 md:mt-0 lg:mt-0'>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black font-bold text-start md:text-center'>{client.dematAccount.dpId}</Text>
                                    {/* <Text selectable className='text-[#6C6A6A] text-xs'>({client.units} units)</Text> */}
                                </View>
                                <View className='flex flex-col'>
                                    <Text selectable className='text-black text-xs'>{client.isActive ? "True" : 'False'}</Text>
                                </View>
                            </View>

                            <View className='flex md:hidden lg:hidden flex-row items-center w-full mt-3'>
                                <TouchableRipple className='w-full py-2 rounded-full border-[0.4px]'>
                                    <Text selectable className='text-black text-center md:text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View>
                        </View>

                        <View className="flex flex-row w-1/12">
                            <Text selectable>
                                {client.users[0].panNumber}
                            </Text>
                        </View>

                        <View className='hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-7/12 justify-between'>
                            <View className='flex flex-row items-center sm:w-full md:w-full lg:w-4/12 md:justify-end lg:justify-center'>
                                <View className='flex flex-col'>
                                    <Text selectable className='text-[#686868] font-semibold'>{client.isActive ? "True" : 'False'}</Text>
                                </View>
                            </View>
                            <View className='flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-6/12  items-center'>
                                <View className='flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center'>
                                    <View className='flex flex-col md:flex-row lg:flex-col'>
                                        <Text selectable className='text-black font-bold text-start md:text-center'>{client.dematAccount.dpId}</Text>
                                    </View>
                                </View>

                                <View className='hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center'>
                                    <View className='flex flex-col bg-[#D7D7D7] rounded-full w-8/12 items-center justify-center'>
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
                                            <Text selectable className='p-1 text-black text-end md:text-center text-xs'>{client.users[0].kycStatus.name}&nbsp;</Text>

                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className='flex flex-row items-center lg:w-2/12 justify-center md:mt-2 lg:mt-0'>

                                <Link
                                    href={{
                                        pathname: "/clients/[id]",
                                        params: { id: client.id }
                                    }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                    <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
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