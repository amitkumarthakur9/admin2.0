import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OrderInterface } from "../../interfaces/OrderInterface"
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer"
import { TouchableRipple } from "react-native-paper"
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import { Badge, Box, Center, CheckIcon, HamburgerIcon, Menu, Modal, Popover, Select, ThreeDotsIcon } from 'native-base';
import moment from "moment";
import { Link, router } from 'expo-router'
import { RupeeSymbol } from "../../helper/helper";
import { RTAReconcilation } from "../../interfaces/RTAResponseInterface";

export const Cards = ({ data, schema }: { data: RTAReconcilation[], schema: any }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [id, setId] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");

    schema = [
        {
            "displayString": "Registered",
            "value": "Registered"
        },
        {
            "displayString": "Failed",
            "value": "Failed"
        },
        {
            "displayString": "Reconciled - Failed",
            "value": "Reconciled - Failed"
        },
        {
            "displayString": "Non Reconciled",
            "value": "Non Reconciled"
        }
    ];

    const handleChangeStatus = (e) => {
        console.log("status", { e });
        // setTransactionStatus(transactionStatus)
        // setId(id)

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



    const TransactionStatusModal = () => {
        return <Modal isOpen={modalVisible} onClose={() => { setModalVisible(false), setId(""), setTransactionStatus("") }} avoidKeyboard safeAreaTop={true} size="lg">
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Transaction Status Update</Modal.Header>
                <Modal.Body>
                    <Center>
                        <Box maxW="300">
                            <Select
                                dropdownIcon={<Icon name="chevron-down" style={{ marginRight: 4 }} color="#9c9c9c" />}

                                selectedValue={transactionStatus} minWidth="200" accessibilityLabel="Choose Status" placeholder="Choose Status" _selectedItem={{
                                    bg: "gray.50",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => handleChangeStatus(itemValue)}>
                                {
                                    // schema.fastFilter.find((filter, index) => filter.key == "transactionStatusId")?.filter?.apiConfig?.defaultData?.map((filter, index) => {
                                    schema?.map((filter, index) => {
                                        return <Select.Item key={index} label={filter.displayString} value={filter.value} />
                                    })
                                }
                            </Select>
                        </Box>
                    </Center>
                </Modal.Body>
            </Modal.Content>
        </Modal >
    }


    return <>
        {
            data.map((rta: RTAReconcilation, index: number) => {

                return <View key={index}>
                    <View className={`flex flex-row p-2 justify-between flex-wrap rounded-xl mx-2 mb-3 ` + (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")} style={{ borderColor: id == rta.id ? "#367a88" : "#94a3b8", borderWidth: id == rta.id ? 1 : 0.2, }}>
                        <View className='flex flex-col w-full'>
                            <View className='flex flex-row w-full justify-between'>
                                <View className='flex flex-row items-center justify-start w-8/12'>
                                    <Pressable onPress={() => router.push(`/clients/${rta.account.id}`)} className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                                        <Text selectable className='text-white'>{getInitials(rta.account.name)}</Text>
                                    </Pressable>
                                    <View className='flex flex-col w-full'>
                                        <View className='flex flex-row items-center text-black font-semibold break-all w-9/12'>
                                            <Text selectable className='text-black font-semibold break-all'>{rta.account.name}</Text>

                                        </View>
                                        <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-9/12'>
                                            <Text selectable className='text-[#6C6A6A] text-sm'>{rta.account.clientId}</Text>
                                            <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                                            <View className='flex flex-row items-center'>
                                                <Text selectable className='text-[#6C6A6A] text-sm'>{rta.account.user[0].panNumber}</Text>

                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className='flex flex-col items-center justify-center w-4/12'>
                                    <View className='flex flex-row items-center w-full justify-center'>
                                        <Text selectable className='p-1 text-black font-bold text-end text-sm'>{RupeeSymbol + rta.amount}</Text>
                                    </View>
                                    <View className='flex flex-row items-center rounded-full w-full justify-center'>
                                        <Text selectable className='p-1 text-black text-end text-xs'>{rta.transactionStatus}</Text>
                                        <Pressable onPress={() => { setModalVisible(true), setId(rta.id), setTransactionStatus(rta.transactionStatus) }}>
                                            <Icon name="edit" size={12} color="black" />
                                        </Pressable>

                                    </View>
                                </View>

                                {/* <View className="flex flex-row items-start justify-center pt-2">
                                   
                                </View> */}
                            </View>

                            <View className='flex flex-row items-center justify-between pl-12 mt-1'>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black font-bold text-start'>{rta.folioNumber || "-"}</Text>
                                </View>
                                <View className='flex flex-row'>
                                    <Text selectable className='text-black text-xs text-center'>{rta.paymentDate && moment(new Date(rta.paymentDate)).format("DD-MM-YYYY hh:mm:ss A")}</Text>
                                </View>
                            </View>



                            <View className='flex flex-row items-center w-full justify-start mt-2'>
                                <Image
                                    className="mr-2"
                                    style={{ width: 40, height: 40 }}
                                    source={{ uri: "https://www.fundexpert.in/cdn/logos-neo/icici.png" }}
                                />
                                <View className={'flex flex-col justify-end items-start w-10/12'} >
                                    <Text selectable className='text-black font-semibold break-all text-sm flex-wrap'>{rta.mutualfund.fundhouse.name}</Text>
                                    <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>BSE: {rta.mutualfund.bseDematSchemeCode}</Text>
                                    </View>
                                    <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>AMC: {rta.mutualfund.name}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className='flex flex-row items-start justify-center w-full flex-wrap mt-3'>
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{rta.mutualfund.rtaCode || "-"} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>RTA Code</Text>
                                </View>
                                {/* <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{moment(new Date(rta.createdAt)).format("DD-MM-YYYY hh:mm:ss A")} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Initated At</Text>
                                </View> */}
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{rta.orderReferenceNumber || '-'} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Order No </Text>
                                </View>
                                <View className='flex flex-col items-center w-4/12 justify-center'>
                                    <Text selectable className='text-black font-bold text-[13px]'>{rta.transactionType || "-"} </Text>
                                    <Text selectable className='text-slate-600 font-base text-[10px]'>Type</Text>
                                </View>

                            </View>

                            {/* <View className='flex flex-row items-center w-full mt-3'>
                                <TouchableRipple onPress={() => router.push(`orders/${rta.id}`)} className='w-full py-2 rounded-full border-[0.4px] bg-black'>
                                    <Text selectable className='text-white text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View> */}
                        </View>
                    </View>
                </View>
            })
        }

        <TransactionStatusModal />
    </>
}