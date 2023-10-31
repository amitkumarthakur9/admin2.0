import * as React from 'react';
import { Image, View, Text, ScrollView, Dimensions, TextInput, ImageBackground, Alert, Pressable, StyleSheet, ViewStyle, TouchableOpacity, } from 'react-native';
import { Modal, Portal, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import DropdownComponent from '../Dropdowns/DropDown';
import Popover from 'react-native-popover-view';
import DynamicComponentRenderer from '../../helper/DynamicComponentRenderer';
import { OrderDataTableProps } from '../../interfaces/OrderDataTableProps';
import TableWrapper from '../Tables/TableWrapper';
import { ClientDataTableProps } from '../../interfaces/ClientDataTableProps';


const ReportDataTable: React.FC<ClientDataTableProps> = ({ title, statusCode, itemsPerPage = 10, totalItems, data = [], }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const schema = {
        filters: [{}],
        sort: [],
        component: "ReportRows",
        response: {
            params: [
                {
                    id: "client",
                    type: "object",
                    label: "Client",
                    component: "ClientBox",
                    params: [
                        {
                            id: "id",
                            type: "number",
                            label: "Client ID",
                            isRequired: true,
                            default: 0,
                        },
                        {
                            id: "name",
                            type: "string",
                            label: "Name",
                            isRequired: true,
                            default: "",
                        },
                        {
                            id: "code",
                            type: "string",
                            label: "Client Code",
                            isRequired: true,
                            default: "",
                        },
                    ],
                    actions: [
                        {
                            reference: "id",
                            name: "basicDetails",
                            endpoint: "/client/:code",
                            format: "query", // data, query, params, {}
                            request_data: { //name and value ("id" value will take from client object) to be sent in request
                                "client_id": "code"
                            },
                            method: "GET",
                            type: "xhr",
                            event: "hover",
                        },
                        {
                            reference: "name",
                            name: "redirect",
                            endpoint: "/client/",
                            format: "path",
                            request_data: { //name and value ("id" value will take from client object) to be sent in request
                                "client_id": "id"
                            },
                            method: "GET",
                            type: "redirect",
                            event: "click",
                        },
                    ],
                },
                {},
            ],
            actions: [
                {
                    id: "id",
                    label: "View Detail",
                    entity: "order",
                    name: "basicDetails",
                    endpoint: "/client/:id",
                    format: "query",
                    request_data: { //name and value ("id" value will take from client object) to be sent in request
                        "client_id": "id"
                    },
                    method: "GET",
                    type: "redirect",
                    event: "click",
                },
            ],
        },
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View className='bg-white'>
                <View className='p-2'>
                    <View className='flex flex-row items-center mb-[30px] mt-3'>

                        <Link href={"/"} className='mr-4'>
                            <Icon name="home" size={18} color="black" />
                        </Link>
                        <View className='mr-4'>
                            <Icon name="angle-right" style={{ fontWeight: "100" }} size={18} color="black" />
                        </View>
                        <Link className='mr-4' href={"/"} style={{ color: "black", fontSize: 13 }}>
                            Home
                        </Link>
                        <View className='mr-4'>
                            <Icon name="angle-right" style={{ fontWeight: "100" }} size={18} color="black" />
                        </View>
                        <Link href={"/clients"} style={{ color: "black", fontSize: 13 }}>
                            Reports
                        </Link>
                    </View>

                    {/* <View className='flex flex-row justify-between mb-5'> */}
                    {/* <Text className='text-lg'>{title || "Dynamic Table"}</Text> */}
                    {/* <Button onPress={() => console.log('click')} style={buttonStyle} labelStyle={labelStyle}>Download Excel</Button> */}

                    {/* </View> */}
                    <View className='' style={{}}>
                        {/* <TextInput
                            className='w-full border-[0.2px]'
                            placeholder={'Search Name/Email/Mobile/ClientID/FE User ID/PAN No'}
                            underlineColorAndroid="transparent"
                            selectionColor="black"
                            placeholderTextColor={"#484848"}
                            cursorColor={"transparent"}
                            onFocus={() => setIsFocused(true)}
                            style={{ padding: 10, fontSize: 10, borderColor: "#484848", color: "#484848", height: 40 }}
                        /> */}
                        <TouchableRipple
                            onPress={() => setModalVisible(true)}
                            rippleColor="transparent"
                            className='w-full border-[0.2px] p-3 pl-2'>

                            <View className=' flex flex-row justify-between items-center'>
                                <Text className='text-[10px] text-slate-600'>Search Name/Email/Mobile/ClientID/FE User ID/PAN No</Text>
                                <Icon name="filter" size={15} color="#000000" />
                            </View>

                            {/* </View> */}
                        </TouchableRipple>

                        {/* <TouchableRipple
                            style={{}}
                            onPress={() => setModalVisible(true)}
                            // rippleColor="rgba(0, 0, 0, .32)"
                            className='absolute top-0 left-0 right-0'
                        >
                            <Icon name="filter" size={15} color="#000000" style={{ position: "absolute", right: 12, top: 13 }} />
                        </TouchableRipple> */}
                    </View>
                </View>
                <View className='mt-4'>
                    <TableWrapper data={data} schema={schema} apiUrl={""} reqData={{}} itemsPerPage={10} totalItems={totalItems} />
                </View>



                <Portal>
                    <Modal style={{ alignItems: "center", borderRadius: 15 }} visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} contentContainerStyle={styles.modalView}>
                        <View className='w-full h-full flex flex-col justify-between'>
                            <View className='p-2'>
                                <View className='mb-4 flex flex-row justify-between'>
                                    <Text className='font-semibold'>Advance Filters</Text>
                                    {/* <View className='flex flex-row justify-end items-center'> */}
                                    <TouchableRipple rippleColor={"#e4e4e4"}>
                                        <Text className='text-xs underline underline-offset-4'>clear</Text>
                                    </TouchableRipple>

                                    {/* <Icon name="trash" size={12} color="#000000" /> */}
                                    {/* </View> */}

                                </View>
                                <View className=''>
                                    <TextInput
                                        className='border-[0.2px] '
                                        placeholder={'Type Name/Email/Mobile/ClientID/FE User ID/PAN No'}
                                        underlineColorAndroid="transparent"
                                        selectionColor="black"
                                        placeholderTextColor={"#484848"}
                                        cursorColor={"transparent"}
                                        onFocus={() => setIsFocused(true)}
                                        style={{ padding: 10, fontSize: 10, borderColor: "#484848", color: "#484848", height: 40 }}
                                    />
                                </View>
                                <View className='mt-2 flex flex-row'>
                                    <DropdownComponent label='Pan' data={[{ label: "First", value: "first" }, { label: "Second", value: "second" }]} />
                                    <DropdownComponent label='Pan' data={[{ label: "First", value: "first" }, { label: "Second", value: "second" }]} />
                                </View>
                            </View>
                            <View className='bg-[#000000]'>
                                <TouchableRipple className='py-3' onPress={() => setModalVisible(!modalVisible)}>
                                    <View className='flex flex-row justify-center items-center'>
                                        <Text className='text-center text-sm mr-2 text-white'>Apply Filters</Text>
                                        <Icon name="filter" size={15} color="#ffffff" />
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </ScrollView>
    );
};

const containerStyle: ViewStyle = { alignItems: "center", backgroundColor: 'white', width: "90%", height: "80%" };

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        // margin: 20,
        backgroundColor: 'white',
        // borderRadius: 5,
        // padding: 35,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: "center", width: "90%", height: "80%"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default ReportDataTable;







