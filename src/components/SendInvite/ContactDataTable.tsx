import * as React from "react";
import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
    Button,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import { router } from "expo-router";
import {
    AddIcon,
    CheckCircleIcon,
    HStack,
    Heading,
    Spinner,
    ThreeDotsIcon,
    WarningIcon,
} from "native-base";

import RemoteApi from "../../services/RemoteApi";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import Icon from "react-native-vector-icons/FontAwesome";
import ManualInvite from "./ManualInvite";
import { Dialog, Portal } from "react-native-paper";
import CustomButton from "../Buttons/CustomButton";
import HoverEffectComponent from "./Hover";
import IonIcon from "react-native-vector-icons/Ionicons";

const ContactDataTable = ({ children }) => {
    // const dummyData = {
    //     columnsModified: 0,
    //     contacts: [
    //         {
    //             id: 1,
    //             name: "test",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "test@gmail.com",
    //             mobileNumber: "1234567890",
    //             status: {
    //                 id: 2,
    //                 name: "Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 2,
    //             name: "Saif M",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "msaffi786@gmail.com",
    //             mobileNumber: "97786 86786",
    //             status: {
    //                 id: 2,
    //                 name: "Not Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 3,
    //             name: "Saheil",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "sakn357@gmail.com",
    //             mobileNumber: "78676 56789",
    //             status: {
    //                 id: 2,
    //                 name: "Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 4,
    //             name: "Ydaf",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "jdnfjdb@gmail.com",
    //             mobileNumber: "6839 274 649",
    //             status: {
    //                 id: 2,
    //                 name: "Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 5,
    //             name: "Zraf",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "zraf@gmail.com",
    //             mobileNumber: "4567 890 432",
    //             status: {
    //                 id: 2,
    //                 name: "Not Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 6,
    //             name: "David Brown",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "user461@example.com",
    //             mobileNumber: "554-490-3200",
    //             status: {
    //                 id: 2,
    //                 name: "Not Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 7,
    //             name: "Olivia Doe",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "user488@example.com",
    //             mobileNumber: "308-570-4530",
    //             status: {
    //                 id: 2,
    //                 name: "Invited",
    //             },
    //             source: {
    //                 id: 2,
    //                 name: "Google",
    //             },
    //         },
    //         {
    //             id: 8,
    //             name: "Emily Martinez",
    //             distributor: {
    //                 user: {
    //                     name: "EESHAN SHUKLAA",
    //                 },
    //             },
    //             email: "user216@example.com",
    //             mobileNumber: "361-881-5970",
    //             status: {
    //                 id: 2,
    //                 name: "Invited",
    //             },
    //         },
    //     ],
    // };
    const dummyData = {
        columnsModified: 0,
        contacts: [],
    };
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<Contact[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();
    const [contacts, setContacts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [selectedContacts, setSelectedContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [inviteModalVisible, setModalVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    // console.log("selectedContacts");
    // console.log(selectedContacts);
    const isSelected = (contact) => {
        // console.log("Selected Contacts: ", selectedContacts);
        // console.log("Checking if contact is selected: ", contact);
        // console.log("isSelectContact: ", selectedContacts.includes(contact));

        return selectedContacts.some((c) => c.id === contact.id);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        console.log("hover");
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        console.log("hover out");
    };

    const toggleContactSelection = (contact) => {
        const isSelected = selectedContacts.some((c) => c.id === contact.id); // Compare by id
        if (isSelected) {
            setSelectedContacts(
                selectedContacts.filter((c) => c.id !== contact.id)
            ); // Remove contact if selected
        } else {
            setSelectedContacts([...selectedContacts, contact]); // Add contact if not selected
        }
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(filteredContacts);
        }
        setSelectAll(!selectAll);
    };

    async function getDataList(
        updatedFilterValues = [],
        applyDirectly = false
    ) {
        setIsLoading(true);
        let data: any = {
            page: currentPageNumber,
            limit: itemsPerPage,
            filters: applyDirectly ? updatedFilterValues : appliedFilers,
        };

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        const response: ContactResponse = await RemoteApi.post(
            "invite/client/list",
            data
        );

        if (response.code == 200) {
            // setData(response.data.data);
            // setData(dummyData.contacts);

            setFilteredContacts(response.data.data);
            // setFilteredContacts(dummyData.contacts);
            // console.log(filteredContacts);
            setTotalItems(response?.data?.filterCount);
            setIsLoading(false);
            setTotalPages(
                Math.ceil(
                    (response?.data?.filterCount || response.data.data.length) /
                        itemsPerPage
                )
            );
        } else {
            setIsLoading(false);
            setFilteredContacts(dummyData.contacts);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("invite/client/schema");
            setFiltersSchema(response);
            setSorting(response.sort);
        }
        getSchema();
    }, []);

    React.useEffect(() => {
        if (
            (appliedSorting.direction != "" && appliedSorting.key != "") ||
            (appliedSorting.direction == "" && appliedSorting.key == "")
        ) {
            getDataList();
        }
    }, [appliedSorting]);

    // console.log(data);

    const showDialog = (key: string) => {
        if (key === "invite") {
            setModalVisible(true);
        } else {
        }
    };

    const hideDialog = (key: string) => {
        if (key === "invite") {
            setModalVisible(false);
        } else {
        }
    };

    const sendInvite = async () => {
        console.log(selectedContacts);
        try {
            // console.log("selectedContacts");
            // console.log(selectedContacts);

            const contactID = {
                contacts: selectedContacts.map((obj) => obj.id),
            };

            const response: any = await RemoteApi.patch(
                "invite/client/send-invite",
                contactID
            );

            // const response = {
            //     message: "Success",
            // };

            if (response?.message == "Success") {
                showDialog("invite");
                getDataList();
                setSelectedContacts([]);
            } else {
                alert("Server Error" + ": " + response?.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // console.log("filteredContacts)" + JSON.stringify(filteredContacts));

    return (
        <View className="bg-white">
            <View className="border-[0.2px]  border-[#e4e4e4]">
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="Clients"
                    downloadApi={""}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                    newComponent={
                        <>
                            <ManualInvite
                                getlist={getDataList}
                                children={children}
                            />
                            {width < 830 ? (
                                <></>
                            ) : (
                                <CustomButton
                                    onPress={sendInvite}
                                    title=" Send Invite "
                                    disabled={selectedContacts.length === 0}
                                    style
                                />
                            )}
                        </>
                    }
                />

                {!isLoading ? (
                    <>
                        <ScrollView className={"mt-4 z-[-2] "}>
                            <View className="flex w-full">
                                <View className="flex flex-row justify-between py-1">
                                    <Text className="font-bold text-lg"></Text>
                                </View>
                                <View className="flex flex-row justify-center">
                                    <View className="w-full ">
                                        <View>
                                            {filteredContacts.length > 0 ? (
                                                <View>
                                                    <View className="flex flex-row items-center p-4 w-[99%] border-y-2 border-slate-200">
                                                        <View className="flex flex-row items-start justify-center w-2/12">
                                                            <TouchableOpacity
                                                                onPress={
                                                                    toggleSelectAll
                                                                }
                                                            >
                                                                <Text className="font-semibold text-md">
                                                                    {selectAll ? (
                                                                        <>
                                                                            <View className="flex flex-col justify-between pr-3 items-center">
                                                                                <View className="flex flex-col">
                                                                                    <View
                                                                                        style={{
                                                                                            backgroundColor:
                                                                                                "#114EA8",
                                                                                            // padding: 10,
                                                                                            borderRadius: 5,
                                                                                            //    width:20,
                                                                                            //    height:20,
                                                                                            paddingTop: 4,
                                                                                            paddingLeft: 4,
                                                                                            paddingRight: 4,
                                                                                            paddingBottom: 4,
                                                                                        }}
                                                                                    >
                                                                                        <Icon
                                                                                            name="check"
                                                                                            size={
                                                                                                10
                                                                                            }
                                                                                            color="white"
                                                                                        />
                                                                                    </View>
                                                                                </View>
                                                                                <View className="pl-2">
                                                                                    <Text className="">
                                                                                        Mark
                                                                                        All
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <View className="flex flex-row justify-center">
                                                                                <View className="flex flex-col pr-3 items-center justify-center">
                                                                                    <View className="flex flex-row justify-center">
                                                                                        <View
                                                                                            style={{
                                                                                                backgroundColor:
                                                                                                    "transparent",
                                                                                                padding: 8,
                                                                                                borderRadius: 4,
                                                                                                borderWidth: 2,
                                                                                                borderColor:
                                                                                                    "#CCCCCC",
                                                                                            }}
                                                                                        ></View>
                                                                                    </View>
                                                                                    <View className="pl-2">
                                                                                        <Text className="text-xs">
                                                                                            Mark
                                                                                            All
                                                                                        </Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </>
                                                                    )}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        {width < 830 ? (
                                                            <View className="pl-8">
                                                                <View className="">
                                                                    <CustomButton
                                                                        onPress={
                                                                            sendInvite
                                                                        }
                                                                        title=" Send Invite "
                                                                        disabled={
                                                                            selectedContacts.length ===
                                                                            0
                                                                        }
                                                                        style
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <View className="flex flex-row items-start justify-start md:w-10/12">
                                                                <View className=" flex flex-row items-start justify-center w-3/12">
                                                                    <View className="flex flex-row items-start justify-start w-9/12">
                                                                        <Text className="py-3">
                                                                            Name
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <View className="flex flex-row items-start justify-start w-3/12">
                                                                    <Text className="py-3">
                                                                        Phone
                                                                    </Text>
                                                                </View>
                                                                <View className="flex flex-row items-start justify-start w-3/12">
                                                                    <Text className="py-3">
                                                                        Email
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View className=" ">
                                                        <FlatList
                                                            data={
                                                                filteredContacts
                                                            }
                                                            renderItem={({
                                                                item,
                                                            }) => (
                                                                <View>
                                                                    {item.status
                                                                        .name ===
                                                                    "Invited" ? (
                                                                        <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 w-[99%] p-2">
                                                                            <View className="flex flex-row justify-center w-2/12">
                                                                                <View className="w-0.5/12">
                                                                                    <View
                                                                                        style={{
                                                                                            flex: 1,
                                                                                            flexDirection:
                                                                                                "row",
                                                                                            alignItems:
                                                                                                "center",
                                                                                        }}
                                                                                    >
                                                                                        <View
                                                                                            style={{
                                                                                                backgroundColor:
                                                                                                    "#C8C8C8",
                                                                                                padding: 4,
                                                                                                borderRadius: 5,
                                                                                            }}
                                                                                        >
                                                                                            <Icon
                                                                                                name="check"
                                                                                                size={
                                                                                                    10
                                                                                                }
                                                                                                color="white"
                                                                                            />
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                            <View className="flex flex-col md:flex-row w-10/12">
                                                                                <View className="flex flex-row items-start md:justify-center md:w-3/12">
                                                                                    <View className="flex flex-row items-start justify-start md:w-8/12">
                                                                                        <Text
                                                                                            selectable
                                                                                            className="text-slate-500 text-lg font-bold md:font-normal md:text-base"
                                                                                        >
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </Text>
                                                                                    </View>
                                                                                </View>

                                                                                <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                    <Text
                                                                                        selectable
                                                                                        className="text-slate-500 text-base"
                                                                                    >
                                                                                        {
                                                                                            item.mobileNumber
                                                                                        }
                                                                                    </Text>
                                                                                </View>
                                                                                <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                    <Text
                                                                                        selectable
                                                                                        className="text-slate-500 text-base"
                                                                                    >
                                                                                        {
                                                                                            item.email
                                                                                        }
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    ) : (
                                                                        // </View>
                                                                        <TouchableWithoutFeedback
                                                                            onPressIn={
                                                                                handleMouseEnter
                                                                            }
                                                                            onPressOut={
                                                                                handleMouseLeave
                                                                            }
                                                                            onPress={() =>
                                                                                toggleContactSelection(
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            {isSelected(
                                                                                item
                                                                            ) ? (
                                                                                <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 w-[99%] p-2 bg-blue-100">
                                                                                    <View className="flex flex-row justify-center w-2/12">
                                                                                        <View className="w-0.5/12">
                                                                                            <View>
                                                                                                <View
                                                                                                    style={{
                                                                                                        backgroundColor:
                                                                                                            "#114EA8",
                                                                                                        padding: 4,
                                                                                                        borderRadius: 5,
                                                                                                    }}
                                                                                                >
                                                                                                    <Icon
                                                                                                        name="check"
                                                                                                        size={
                                                                                                            10
                                                                                                        }
                                                                                                        color="white"
                                                                                                    />
                                                                                                </View>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>

                                                                                    <View className="flex flex-col md:flex-row w-10/12 ">
                                                                                        <View className="flex flex-row items-start md:justify-center md:w-3/12">
                                                                                            <View className="flex flex-row items-start justify-start md:w-8/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500 text-lg font-bold md:font-normal md:text-base"
                                                                                                >
                                                                                                    {
                                                                                                        item.name
                                                                                                    }
                                                                                                </Text>
                                                                                            </View>
                                                                                        </View>

                                                                                        <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                            <Text
                                                                                                selectable
                                                                                                className="text-slate-500 text-base"
                                                                                            >
                                                                                                {
                                                                                                    item.mobileNumber
                                                                                                }
                                                                                            </Text>
                                                                                        </View>
                                                                                        <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                            <Text
                                                                                                selectable
                                                                                                className="text-slate-500 text-base"
                                                                                            >
                                                                                                {
                                                                                                    item.email
                                                                                                }
                                                                                            </Text>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            ) : (
                                                                                <>
                                                                                    <TouchableWithoutFeedback
                                                                                        onPressIn={
                                                                                            handleMouseEnter
                                                                                        }
                                                                                        onPressOut={
                                                                                            handleMouseLeave
                                                                                        }
                                                                                        onPress={() =>
                                                                                            toggleContactSelection(
                                                                                                item
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 w-[99%] p-2 ">
                                                                                            <View className="flex flex-row justify-center w-2/12">
                                                                                                <View className="w-0.5/12">
                                                                                                    <View>
                                                                                                        <View
                                                                                                            style={{
                                                                                                                backgroundColor:
                                                                                                                    "transparent",
                                                                                                                padding: 8,
                                                                                                                borderRadius: 4,
                                                                                                                borderWidth: 2,
                                                                                                                borderColor:
                                                                                                                    "#CCCCCC",
                                                                                                            }}
                                                                                                        ></View>
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>
                                                                                            <View className="flex flex-col md:flex-row w-10/12">
                                                                                                <View className="flex flex-row items-start md:justify-center md:w-3/12">
                                                                                                    <View className="flex flex-row items-start justify-start md:w-8/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500 text-lg font-bold md:font-normal md:text-base"
                                                                                                        >
                                                                                                            {
                                                                                                                item.name
                                                                                                            }
                                                                                                        </Text>
                                                                                                    </View>
                                                                                                </View>

                                                                                                <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500 text-base"
                                                                                                    >
                                                                                                        {
                                                                                                            item.mobileNumber
                                                                                                        }
                                                                                                    </Text>
                                                                                                </View>
                                                                                                <View className="flex flex-row items-start justify-start md:w-3/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500 text-base"
                                                                                                    >
                                                                                                        {
                                                                                                            item.email
                                                                                                        }
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>
                                                                                        </View>
                                                                                    </TouchableWithoutFeedback>
                                                                                </>
                                                                            )}
                                                                        </TouchableWithoutFeedback>
                                                                    )}
                                                                </View>
                                                            )}
                                                            keyExtractor={(
                                                                item,
                                                                index
                                                            ) =>
                                                                index.toString()
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            ) : (
                                                <View>
                                                    <View
                                                        style={{
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Icon
                                                            name="address-book-o"
                                                            size={100}
                                                            color="#ccc"
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize: 24,
                                                                color: "#888",
                                                                marginTop: 20,
                                                            }}
                                                        >
                                                            No contacts
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            ></View>
                        </ScrollView>
                    </>
                ) : (
                    <HStack
                        space={"md"}
                        marginTop={20}
                        marginBottom={20}
                        justifyContent="center"
                    >
                        <Spinner
                            color={"black"}
                            accessibilityLabel="Loading order"
                        />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                )}
            </View>

            <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                getDataList={getDataList}
                currentPageNumber={currentPageNumber}
                totalPages={totalPages}
                setCurrentPageNumber={setCurrentPageNumber}
            />

            {/* <HoverEffectComponent /> */}
            <View className="">
                <Portal>
                    <Dialog
                        visible={inviteModalVisible}
                        onDismiss={() => hideDialog("invite")}
                        dismissable
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignSelf: "center",
                            width: 346,
                            // height: "50%",
                            overflow: "scroll",
                            backgroundColor: "white",
                            padding: 40,
                        }}
                    >
                        <View className="flex flex-row justify-end items-start">
                            <Pressable
                                onPress={() => hideDialog("invite")}
                                // className={
                                //     "flex flex-row justify-start items-start"
                                // }
                                aria-describedby="InviteClient"
                            >
                                <IonIcon
                                    name="close-outline"
                                    size={24}
                                    color="black"
                                />
                            </Pressable>
                        </View>
                        <View className="flex flex-col justify-center items-center">
                            <View className="flex flex-col w-1/2 justify-center items-center">
                                <Image
                                    source={require("../../../assets/images/successTick.svg")}
                                />
                            </View>
                            <View>
                                <Text className="pt-8 text-lg font-bold color-[#114EA8]">
                                    Invite succesfully sent
                                </Text>
                            </View>
                        </View>
                    </Dialog>
                </Portal>
            </View>
        </View>
    );
};

export default ContactDataTable;
