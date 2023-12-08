import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Popover } from "native-base";
import { Link, router } from "expo-router";
import { getInitials } from "../DateSelector/utils";

export const ClientsRows = ({ data, schema }) => {
    return <>
        <View className={`flex flex-row py-4 px-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')}>
            <View className='flex flex-row w-4/12'>
                <View className='flex flex-row items-center justify-start'>
                    <Text selectable className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-2/12'>
                <View className='flex flex-row items-center justify-center'>
                    <Text selectable className='font-semibold'>PAN</Text>
                </View>
            </View>

            <View className='flex flex-row w-2/12'>
                <View className='flex flex-row items-center justify-center'>
                    <Text selectable className='font-semibold'>Active Type</Text>
                </View>
            </View>

            <View className='flex flex-row w-2/12'>
                <View className='flex flex-row items-center justify-center'>
                    <Text selectable className='font-semibold'>Client DOI</Text>
                </View>
            </View>

            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center justify-center'>
                    <Text selectable className='font-semibold'>KYC Status</Text>
                </View>
            </View>

            <View className='flex flex-row w-1/12 justify-center'>
                <View className='flex flex-row items-center justify-center'>
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
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row w-4/12 flex-wrap'>
                            <View className='flex flex-row items-center justify-start flex-wrap w-full'>
                                <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap'>
                                    <Text selectable className='text-white'>{getInitials(client.name)}</Text>
                                </View>
                                <View className='flex flex-col flex-wrap w-9/12'>
                                    <View className='flex flex-row items-center text-black font-semibold flex-wrap w-11/12'>
                                        <Text selectable className='text-black font-semibold break-all'>{client.name}&nbsp;</Text>
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
                                                        <Text>Name: {client.name}</Text>
                                                        <Text>PAN Number: {client?.users[0]?.panNumber || "-"}</Text>
                                                    </View>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover>
                                    </View>
                                    <View className='flex flex-row items-center mt-0'>
                                        <Text selectable className='text-[#6C6A6A] text-sm'>{client.clientId}</Text>
                                        {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}

                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className="flex flex-row w-2/12 items-center">
                            <Text selectable>
                                {client?.users[0]?.panNumber || "-"}
                            </Text>
                        </View>

                        <View className='flex flex-row items-center w-2/12 '>
                            <Text selectable className='text-[#686868] font-semibold'>{client.isActive ? "Active" : 'Inactive'}</Text>
                        </View>

                        <View className='flex flex-row items-center justify-between w-2/12'>
                            <Text selectable className='text-black font-bold text-center'>{"-"}</Text>
                        </View>
                        <View className='flex flex-row items-center justify-between w-1/12'>
                            <Text selectable className='text-black font-bold text-center'>{client?.users[0]?.kycStatus.name || "-"}</Text>
                        </View>

                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <Pressable
                                onPress={() => { history.pushState(null, "", "clients"), router.push(`clients/${client.id}`) }}
                                // href={{
                                //     pathname: "/clients/[id]",
                                //     params: { id: client.id }
                                // }} 
                                // href={`clients/${client.id}`}
                                className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-center text-xs w-10/12'>View</Text>
                            </Pressable>
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