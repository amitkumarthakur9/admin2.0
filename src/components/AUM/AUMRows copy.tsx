import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Center, Divider, Flex, Heading, Popover, VStack, useColorModeValue } from "native-base";
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

    const bgShade100 = useColorModeValue("primary.100", "primary.400");
    const bgShade200 = useColorModeValue("primary.200", "primary.500");
    const bgShade300 = useColorModeValue("primary.300", "primary.600");
    const bgShade400 = useColorModeValue("primary.400", "primary.700");

    interface columnsInterface {
        name: string,
        width?: number
    }

    let columns: columnsInterface[] = [
        { name: "Client Name", },
        { name: "PAN", },
        { name: "Scheme Name", },
        { name: "Folio Number", },
        { name: "Units", },
        { name: "Price", },
        { name: "Current Value", },
        { name: "Action", }
    ]

    let width = 0;

    return <>
        {/* <View className={`flex flex-row py-4 px-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')}>
            <View className='flex flex-row w-3/12'>
                <View className='flex flex-row items-center w-full justify-start'>
                    <Text selectable className='font-semibold'>Client Name</Text>
                </View>
            </View>

            <View className='flex flex-row w-1/12'>
                <View className='flex flex-row items-center w-full justify-center'>
                    <Text selectable className='font-semibold'>PAN</Text>
                </View>
            </View>


            <View className='flex flex-row items-center w-3/12 justify-center'>
                <Text selectable className='font-semibold'>Scheme Name</Text>
            </View>
            <View className='flex flex-row w-1/12 items-center justify-center'>
                <View className='flex flex-row items-center w-1/2'>
                    <Text selectable className='font-semibold'>Folio Number</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12 items-center justify-center'>
                <View className='flex flex-row items-center'>
                    <Text selectable className='font-semibold'>Units</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12 items-center justify-center'>
                <View className='flex flex-row items-center'>
                    <Text selectable className='font-semibold'>Price</Text>
                </View>
            </View>
            <View className='flex flex-row w-1/12 items-center justify-center'>
                <View className='flex flex-row items-center'>
                    <Text selectable className='font-semibold'>Current Value</Text>
                </View>
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
            data.map((client: AUMDataItem, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between ` + (Dimensions.get("screen").width < 770 ? 'w-[1728px]' : '')} >
                        <View className='flex flex-row w-full w-3/12 flex-wrap'>
                            <View className='flex flex-row items-center w-full justify-between flex-wrap'>
                                <View className='flex flex-row items-center justify-start w-full flex-wrap'>
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
                                                            <Text>PAN Number: {"LAJPS2908"}</Text>
                                                            <Text>Distributor CompanyId: {client.distributor.distributorCompanyId}</Text>
                                                        </View>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover>
                                        </View>
                                        <View className='flex flex-row items-center mt-0'>
                                            <Text selectable className='text-[#6C6A6A] text-sm'>{client.account.clientId}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="flex flex-row w-1/12 items-center justify-center flex-wrap">
                            <Text className="w-10/12">
                                {'LAJPS2390'}
                            </Text>
                        </View>

                        <View className='flex flex-row items-center w-3/12 justify-center flex-wrap'>
                            <View className='flex flex-col flex-wrap w-10/12'>
                                <Text selectable className='text-[#000000] font-bold'>{client.mutualfund.name}</Text>
                                <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.mutualfundSubcategory.name}</Text>
                                <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.bseDematSchemeCode}</Text>
                                <Text selectable className='text-[#686868] font-semibold'>{client.mutualfund.fundhouse.name}</Text>
                            </View>
                        </View>
                        <View className='flex flex-row w-1/12 items-center justify-center'>
                            <View className='flex flex-row items-center w-1/2 justify-center'>
                                <View className='flex flex-col bg-[#D7D7D7] px-2 py-1 rounded-full'>
                                    <View className='flex flex-row items-center'>
                                        <Text selectable className='p-1 text-black text-end md:text-center text-xs'>{client.folioNumber}&nbsp;</Text>
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
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <Text>{client.units}</Text>
                        </View>
                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <Text>{client.units * (client.currentValue / client.mutualfund.nav)}</Text>
                        </View>
                        <View className='flex flex-row items-center w-1/12  justify-center'>
                            <Text>{client.units * client.mutualfund.nav}</Text>
                        </View>

                        <View className='flex flex-row items-center w-1/12 justify-center'>
                            <Link
                                href={{
                                    pathname: "/aum/[id]",
                                    params: { id: client.id }
                                }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                            </Link>
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
        } */}

        <View className="flex flex-row bg-[#3329s29]" style={{ overflow: "scroll" }}>
            <View className="flex flex-col w-full">
                <View className="flex flex-row">
                    {

                        columns.map((column, index: number) => {
                            if (column.width) {
                                width += column.width;
                            }
                            const subtractedWidth: any = column.width ? column.width : `calc(100% / ${columns.length})`;

                            return <View key={index} className={"flex flex-col items-start p-2"} style={{ width: subtractedWidth }}>
                                <Text selectable className="font-bold whitespace-normal" style={{}}>{column.name}</Text>
                            </View>
                        })
                    }
                </View>
                <View className="flex flex-row">
                    {
                        columns.map((column, index: number) => {
                            if (column.width) {
                                width += column.width;
                            }
                            const subtractedWidth: any = column.width ? column.width : `calc(100% / ${columns.length})`;

                            return <View key={index} className={"flex flex-col items-start p-2"} style={{ width: subtractedWidth }}>
                                <Text selectable className="font-bold whitespace-normal" style={{}}>{column.name}</Text>
                            </View>
                        })
                    }
                </View>
            </View>

        </View >


    </>
}