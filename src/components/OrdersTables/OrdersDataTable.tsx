import * as React from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useState } from 'react';
import DropdownComponent from '../Dropdowns/DropDown';
import { OrdersRows } from './OrdersRows';
import DatePickerComponent from '../CustomDatePicker/DatePicker';
import { OrderInterface } from '../../interfaces/OrderInterface';
import RemoteApi from '../../services/RemoteApi';
import { OrdersResponse } from '../../interfaces/OrdersResposeInterface';
import { DatePickerModal, DatePickerInput } from 'react-native-paper-dates';
import moment from 'moment';
import TextInputCustom from '../Others/TextInputCustom';
// import TextInput from '../src/components/Others/TextInput'


const OrderDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [open, setOpen] = useState(false)
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const filterModalRef = React.useRef(null);
    const searchBoxRef = React.useRef(null);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<OrderInterface[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<any>([

    ]);

    async function getOrdersList() {
        setIsLoading(true)
        const response: OrdersResponse = await RemoteApi.post("order/list", {
            "page": currentPageNumber,
            "limit": itemsPerPage,
            "orderBy": {
                "key": "createdAt",
                "direction": "desc"
            },
            "filters": filters
        });

        if (response.code == 200) {
            setData(response.orders)
            // setItemsPerPage(response.count)
            setTotalItems(response.filterCount)
            setIsLoading(false)
            setTotalPages(Math.ceil((response.filterCount || response.orders.length) / itemsPerPage));

        }

    }

    const updateFilter = ({ key, value, operator }: { key: string, value: any, operator: string }) => {
        // Check if the filter key exists in filters
        const filterIndex = filters.findIndex(filter => filter.key === key);

        if (filterIndex !== -1) {
            // If the filter exists, update it
            const newFilters = filters.map((filter, index) => {
                if (index === filterIndex) {
                    return {
                        ...filter,
                        value: value,
                        operator: operator
                    };
                }
                return filter;
            });

            setFilters(newFilters);
            console.log(newFilters);

        } else {

            // If the filter doesn't exist, create a new filter
            const newFilters = [
                ...filters,
                {
                    "key": key,
                    "value": value,
                    "operator": operator, // You can specify the operator here
                },
            ];

            setFilters(newFilters);
            console.log(newFilters);

        }


    };


    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);




    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
            updateFilter({ key: "startDate", value: [moment(startDate).format("YYYY-MM-DD"), moment(endDate).format("YYYY-MM-DD")], operator: "between" })

        },
        [setOpen, setRange]
    );


    // Generate pagesToShow array based on the current page
    const generatePagesToShow = (currentPage: number) => {
        const pagesToShow = [];

        if (currentPage > 1) {
            pagesToShow.push(currentPage - 1);
        }

        for (let i = currentPage; i <= currentPage + 2 && i <= totalPages - 2; i++) {
            pagesToShow.push(i);
        }

        if (pagesToShow[pagesToShow.length - 1] < totalPages - 1) {
            pagesToShow.push("...");
        }

        for (let i = Math.max(currentPage, totalPages - 1); i <= totalPages; i++) {
            pagesToShow.push(i);
        }

        return pagesToShow;
    };

    React.useEffect(() => {

        // if (data.length == 0) {
        getOrdersList()
        // } else {
        //     console.log('hittinf=g');

        // }
    }, [currentPageNumber])

    // Calculate the number of pages
    // const totalPages = Math.ceil((totalItems || data.length) / itemsPerPage);

    const handleNextPage = () => {
        if (currentPageNumber < totalPages) {
            setCurrentPageNumber(currentPageNumber + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPageNumber > 1) {
            setCurrentPageNumber(currentPageNumber - 1)
        }
    }

    React.useEffect(() => {
        //page changed
        //API CALL
        console.log(`page changed to: ${currentPageNumber}`);

    }, [currentPageNumber])

    const schema = {
        filters: [{}],
        sort: [],
        component: "OrderRows",
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

    const handleSearchInputFocus = () => {
        console.log('input tap');

        setModalVisible(true)
        setIsFocused(true)
    }

    const handleSeachInutBlur = () => {
        // This function will be called when the TextInput loses focus.
        console.log('TextInput lost focus');
        // setModalVisible(false)
        // You can perform any desired actions here.
    };

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterModalRef.current && !filterModalRef.current.contains(event.target) && !searchBoxRef.current.contains(event.target)) {
                setModalVisible(false);
            }
        };

        // Add a click event listener to the document
        document.addEventListener('click', handleClickOutside);

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const applyFilters = () => {
        setModalVisible(!modalVisible)
        setCurrentPageNumber(1)
        getOrdersList()
    }

    const clearFilters = () => {
        setRange({ startDate: undefined, endDate: undefined })
        setModalVisible(!modalVisible)
        setFilters([])
        setCurrentPageNumber(1)
        getOrdersList()
    }

    return (
        <ScrollView className={`bg-white`} style={{ height: Dimensions.get("window").height - 100 }} showsVerticalScrollIndicator={true}>
            <View className='bg-white'>
                <View className=''>
                    <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                        <View className='flex flex-col w-6/12'>
                            <Text className='text-2xl font-extrabold mb-3'>Orders</Text>
                            <View className='flex flex-row items-center'>
                                <Link href={"/user/12"} className='mr-4'>
                                    {/* <Icon name="home" size={18} color="black" /> */}
                                    <Text>Dashboard</Text>
                                </Link>
                                <View className='mr-4'>
                                    <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                </View>
                            </View>
                        </View>
                        <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                            <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                                // flex: 1,
                                // justifyContent: 'center',
                            }}>

                            </ImageBackground>
                        </View>
                    </View>

                </View>
                <View className='border-[0.2px]  border-[#e4e4e4]'>
                    <View className='static' style={{}}>
                        <View ref={searchBoxRef} className={'flex flex-row justify-between items-center mx-2 w-12/12 lg:w-4/12 mt-5 flex static ' + (modalVisible ? 'border-x-[1px] border-t-[1px] rounded-t-lg ' : 'border-[#e4e4e4] border-[0.3px] rounded')}>
                            <TextInput
                                className='w-11/12 outline-transparent'
                                placeholder={'Type Name/Email/Mobile/ClientID/FE User ID/PAN No'}
                                underlineColorAndroid="transparent"
                                selectionColor="transparent"
                                placeholderTextColor={"#484848"}
                                cursorColor={"transparent"}
                                onFocus={handleSearchInputFocus}
                                onBlur={handleSeachInutBlur}
                                style={searchInputStyle}
                            />
                            <View className='w-1/12 flex flex-row justify-end mr-2'>
                                <Icon name="filter" size={15} color="#000000" />
                            </View>

                        </View>

                        {
                            modalVisible &&
                            <View className={"bg-white absolute z-[9999] top-14 w-12/12 lg:w-4/12 left-2 rounded-b-lg " + (modalVisible ? 'border-x-[1px] border-b-[1px]' : 'border-[#e4e4e4] border-[0.3px]')} ref={filterModalRef}>
                                <View className='w-full h-full flex flex-col justify-between z-[9999]'>
                                    <View className='p-2'>
                                        <View className='mb-4 flex flex-row justify-between'>
                                            <Text className='font-semibold'>Advance Filters</Text>
                                            <TouchableRipple rippleColor={"#e4e4e4"} onPress={clearFilters}>
                                                <Text className='text-xs underline underline-offset-4'>clear</Text>
                                            </TouchableRipple>
                                        </View>

                                        <View>
                                            <TouchableOpacity onPress={() => setOpen(true)} className="flex flex-col border-[0.2px] border-black px-4 py-2">
                                                <View className="flex flex-row items-center mb-2">
                                                    <Icon name="calendar" size={12} color="black" />
                                                    <Text className="ml-2">Start Date</Text>
                                                </View>

                                                <View className="flex flex-row justify-start w-full">
                                                    <View className="flex flex-col">
                                                        <Text className="text-xs">
                                                            {
                                                                range.startDate ? moment(range.startDate).format("YYYY-MM-DD") : "From"
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View className="flex flex-col mx-2">
                                                        <Text>-</Text>
                                                    </View>
                                                    <View className="flex flex-col">
                                                        <Text className="text-xs">
                                                            {
                                                                range.endDate ? moment(range.endDate).format("YYYY-MM-DD") : "To"
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                            <View className="">

                                                <DatePickerModal
                                                    // dateMode="start"
                                                    headerSeparator=""
                                                    // saveLabelDisabled
                                                    saveLabel=""
                                                    locale="en"
                                                    mode="range"
                                                    visible={open}
                                                    onDismiss={onDismiss}
                                                    startDate={range.startDate}
                                                    endDate={range.endDate}
                                                    onConfirm={onConfirm}
                                                />
                                            </View>
                                        </View>

                                        <View>
                                            <TextInputCustom
                                                description={""}
                                                label="Account"
                                                returnKeyType="next"
                                                value={filters.find(filter => filter.key === "account")?.value || ""}
                                                onChangeText={(text) => !isNaN(parseFloat(text)) && updateFilter({ key: "account", value: Number(text), operator: "eq" })}
                                                autoCapitalize="none"
                                                textContentType="telephoneNumber"
                                                keyboardType="numeric"
                                                errorText={undefined}
                                            />
                                        </View>
                                    </View>
                                    <View className='bg-[#000000] rounded-b-lg'>
                                        <TouchableRipple className='py-3' onPress={applyFilters}>
                                            <View className='flex flex-row justify-center items-center'>
                                                <Text className='text-center text-sm mr-2 text-white'>Apply Filters</Text>
                                                <Icon name="filter" size={15} color="#ffffff" />
                                            </View>
                                        </TouchableRipple>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>

                    {
                        !isLoading ? <View className='mt-4 z-[-1]'>
                            <OrdersRows data={data} schema={schema} />
                        </View> : <ActivityIndicator size={"large"} animating={true} color={"black"} />
                    }


                </View>

                <View className='flex flex-row items-center justify-center my-2 '>
                    <View className='w-12/12 lg:w-4/12 items-center flex flex-row justify-between'>
                        <View>
                            <TouchableRipple rippleColor={"transparent"} className='px-3 py-2' onPress={handlePrevPage}>
                                <Icon name="angle-left" size={18} color={currentPageNumber == 1 ? "#dfdcdc" : "black"} />
                            </TouchableRipple>
                        </View>

                        {generatePagesToShow(currentPageNumber).map((page, index) => (
                            <View key={index} className='rounded-md mr-2'>
                                <TouchableRipple
                                    onPress={() => setCurrentPageNumber(page == "..." ? currentPageNumber : page)}
                                    className={"rounded-md px-3 py-2" + (currentPageNumber === page ? " bg-black" : " bg-slate-200")}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                >
                                    <Text className={currentPageNumber === page ? "text-white" : "text-black"}>{page}</Text>
                                </TouchableRipple>
                            </View>
                        ))}
                        {/* {
                            Array.from({ length: (totalPages > 6 ? 3 : totalPages) }, (_, index) => (
                                <View key={index} className='rounded-md'>
                                    <TouchableRipple onPress={() => setCurrentPageNumber(index + 1)} className={"rounded-md px-3 py-2" + (currentPageNumber == (index + 1) ? " bg-black" : " bg-slate-200")} rippleColor="rgba(0, 0, 0, .32)">
                                        <Text className={currentPageNumber == (index + 1) ? "text-white" : "text-black"}>{index + 1}</Text>
                                    </TouchableRipple>
                                </View>
                            ))
                        }

                        {
                            totalPages > 6 && Array.from({ length: (2) }, (_, index) => (
                                <View key={index} className='rounded-md'>
                                    <TouchableRipple onPress={() => setCurrentPageNumber(totalPages - (2 - index))} className={"rounded-md px-3 py-2" + (currentPageNumber == (totalPages - (2 - index)) ? " bg-black" : " bg-slate-200")} rippleColor="rgba(0, 0, 0, .32)">
                                        <Text className={currentPageNumber == (totalPages - (2 - index)) ? "text-white" : "text-black"}>{totalPages - (2 - index)}</Text>
                                    </TouchableRipple>
                                </View>
                            ))
                        } */}



                        <View>
                            <TouchableRipple rippleColor={"transparent"} className='px-3 py-2' onPress={handleNextPage} >
                                <Icon name="angle-right" size={18} color={currentPageNumber == totalPages ? "#dfdcdc" : "black"} />
                            </TouchableRipple>
                        </View>
                    </View>
                </View>
            </View >
        </ScrollView >
    );
};


const searchInputStyle = { padding: 10, fontSize: 10, borderColor: "transparent", color: "#484848", height: 40, borderWidth: 0, "outlineStyle": 'none' };

export default OrderDataTable;







