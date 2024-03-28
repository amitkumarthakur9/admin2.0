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

const ContactDataTable = () => {
    const dummyData = {
        columnsModified: 0,
        contacts: [
            {
                id: 1,
                name: "test",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "test@gmail.com",
                mobileNumber: "1234567890",
                status: {
                    id: 2,
                    name: "Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 2,
                name: "Saif M",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "msaffi786@gmail.com",
                mobileNumber: "97786 86786",
                status: {
                    id: 2,
                    name: "Not Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 3,
                name: "Saheil",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "sakn357@gmail.com",
                mobileNumber: "78676 56789",
                status: {
                    id: 2,
                    name: "Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 4,
                name: "Ydaf",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "jdnfjdb@gmail.com",
                mobileNumber: "6839 274 649",
                status: {
                    id: 2,
                    name: "Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 5,
                name: "Zraf",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "zraf@gmail.com",
                mobileNumber: "4567 890 432",
                status: {
                    id: 2,
                    name: "Not Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 6,
                name: "David Brown",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "user461@example.com",
                mobileNumber: "554-490-3200",
                status: {
                    id: 2,
                    name: "Not Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 7,
                name: "Olivia Doe",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "user488@example.com",
                mobileNumber: "308-570-4530",
                status: {
                    id: 2,
                    name: "Invited",
                },
                source: {
                    id: 2,
                    name: "Google",
                },
            },
            {
                id: 8,
                name: "Emily Martinez",
                distributor: {
                    user: {
                        name: "EESHAN SHUKLAA",
                    },
                },
                email: "user216@example.com",
                mobileNumber: "361-881-5970",
                status: {
                    id: 2,
                    name: "Invited",
                },
            },
        ],
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

    const toggleContactSelection = (contact) => {
        const isSelected = selectedContacts.some((c) => c === contact);
        if (isSelected) {
            setSelectedContacts(selectedContacts.filter((c) => c !== contact));
        } else {
            setSelectedContacts([...selectedContacts, contact]);
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

    const isSelected = (contact) => selectedContacts.includes(contact);

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

        // const response: AUMResponseInterface = await RemoteApi.post(
        //     "client/list",
        //     data
        // );

        const response: ContactResponse = await RemoteApi.post(
            "onboard/client/list",
            data
        );

        if (response.code == 200) {
            setData(response.data.data);
            setFilteredContacts(response.data.data);
            console.log(filteredContacts);
            setTotalItems(response?.filterCount);
            setIsLoading(false);
            setTotalPages(
                Math.ceil(
                    (response?.filterCount || response.data.data.length) /
                        itemsPerPage
                )
            );
        }else{
            setIsLoading(false);
            setFilteredContacts(dummyData.contacts);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("onboard/client/schema");
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

    console.log(data);

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
            console.log("selectedContacts");
            console.log(selectedContacts);

            const contactID = {
                contacts: selectedContacts.map((obj) => obj.id),
            };

            const response: any = await RemoteApi.patch(
                "onboard/client/invite",
                contactID
            );

            if (response?.message == "Success") {
                showDialog("invite");
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log("filteredContacts)" + JSON.stringify(filteredContacts));

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
                            <View className="py-1 h-[42px] ">
                                <Button
                                    title="Send Invite"
                                    onPress={sendInvite}
                                    disabled={selectedContacts.length === 0}
                                />
                            </View>
                            <ManualInvite />
                        </>
                    }
                />

                {!isLoading ? (
                    <>
                        <View className="flex w-full">
                            <View className="flex flex-row justify-between py-1">
                                <Text className="font-bold text-lg">
                                    {/* Welcome, {userInfo.name}! */}
                                </Text>
                                {/* <Button
                                                    title="Sign Out"
                                                    onPress={() => {
                                                        setGooglemodalVisible(
                                                            false
                                                        );
                                                        console.log(
                                                            GooglemodalVisible
                                                        );
                                                        setUserInfo(null);
                                                    }}
                                                /> */}
                            </View>
                            <View className="flex flex-row justify-center">
                                <View className="w-full ">
                                    {/* <TextInput
                                                        placeholder="Search name"
                                                        value={searchQuery}
                                                        onChangeText={(text) =>
                                                            handleSearchChange(
                                                                text
                                                            )
                                                        }
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: "#ccc",
                                                            padding: 8,
                                                            marginBottom: 10,
                                                        }}
                                                    /> */}
                                    {/* <Select
                                                        selectedValue={filter}
                                                        minWidth="200"
                                                        accessibilityLabel="Filter"
                                                        placeholder="Filter"
                                                        _selectedItem={{
                                                            bg: "teal.600",
                                                            endIcon: (
                                                                <CheckIcon size="5" />
                                                            ),
                                                        }}
                                                        mt={1}
                                                        onValueChange={
                                                            handleFilterChange
                                                        }
                                                    >
                                                        <Select.Item
                                                            label="All"
                                                            value="all"
                                                        />
                                                        <Select.Item
                                                            label="Invited"
                                                            value="invited"
                                                        />
                                                        <Select.Item
                                                            label="Not Invited"
                                                            value="notInvited"
                                                        />
                                                    </Select> */}

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
                                                            {selectedContacts.length >
                                                            0 ? (
                                                                <Text className="font-semibold text-md">
                                                                    {selectAll ? (
                                                                        <>
                                                                            <View className="flex flex-col justify-between pr-2 items-center">
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
                                                                                        Deselect
                                                                                        All
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <View className="flex flex-row justify-center">
                                                                                <View className="flex flex-col items-center justify-center">
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
                                                                                                height: 2,
                                                                                            }}
                                                                                        ></View>
                                                                                    </View>
                                                                                    <View className="pl-2">
                                                                                        <Text className="text-xs">
                                                                                            Select
                                                                                            All
                                                                                        </Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </>
                                                                    )}
                                                                </Text>
                                                            ) : (
                                                                <View></View>
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View className="flex flex-row items-start justify-center w-3/12">
                                                        <View className="flex flex-row items-start justify-start w-9/12">
                                                            <Text className="py-2">
                                                                Name
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <View className="flex flex-row items-start justify-start w-3/12">
                                                        <Text className="py-2">Phone</Text>
                                                    </View>
                                                    <View className="flex flex-row items-start justify-start w-3/12">
                                                        <Text className="py-2">Email</Text>
                                                    </View>
                                                </View>

                                                <View className="">
                                                    <FlatList
                                                        data={filteredContacts}
                                                        renderItem={({
                                                            item,
                                                        }) => (
                                                            <View
                                                            // style={{
                                                            //     flexDirection:
                                                            //         "row",
                                                            //     alignItems:
                                                            //         "center",
                                                            //     borderBottomWidth: 1,
                                                            //     borderBottomColor:
                                                            //         "#ccc",
                                                            //     padding: 10,
                                                            // }}
                                                            >
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
                                                                                    <Text
                                                                                        style={{
                                                                                            marginLeft: 10,
                                                                                            color: "#778899",
                                                                                        }}
                                                                                    >
                                                                                        Invite
                                                                                        Sent
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>

                                                                        <View className="flex flex-row items-start justify-center w-3/12">
                                                                            <View className="flex flex-row items-start justify-start w-8/12">
                                                                                <Text className="text-slate-500 text-base">
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </Text>
                                                                            </View>
                                                                        </View>

                                                                        <View className="flex flex-row items-start justify-start w-3/12">
                                                                            <Text className="text-slate-500 text-base">
                                                                                {
                                                                                    item.mobileNumber
                                                                                }
                                                                            </Text>
                                                                        </View>

                                                                        <View className="flex flex-row items-start justify-start w-3/12">
                                                                            <Text className="text-slate-500 text-base">
                                                                                {
                                                                                    item.email
                                                                                }
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                ) : (
                                                                    <TouchableOpacity
                                                                        onPress={() =>
                                                                            toggleContactSelection(
                                                                                item
                                                                            )
                                                                        }
                                                                    >
                                                                        <View className="flex flex-row items-center border-solid border-b-1 border-gray-400 w-[99%] p-2">
                                                                            <View className="flex flex-row justify-center w-2/12">
                                                                                <View className="w-0.5/12">
                                                                                    <View>
                                                                                        {isSelected(
                                                                                            item
                                                                                        ) ? (
                                                                                            <View
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        "#114EA8",
                                                                                                    padding: 7,
                                                                                                    borderRadius: 5,
                                                                                                }}
                                                                                            >
                                                                                                <Icon
                                                                                                    name="check"
                                                                                                    size={
                                                                                                        6
                                                                                                    }
                                                                                                    color="white"
                                                                                                />
                                                                                            </View>
                                                                                        ) : (
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
                                                                                        )}
                                                                                    </View>
                                                                                </View>
                                                                            </View>

                                                                            <View className="flex flex-row items-start justify-center w-3/12">
                                                                                <View className="flex flex-row items-start justify-start w-8/12">
                                                                                    <Text className="text-slate-500 text-base">
                                                                                        {
                                                                                            item.name
                                                                                        }
                                                                                    </Text>
                                                                                </View>
                                                                            </View>

                                                                            <View className="flex flex-row items-start justify-start w-3/12">
                                                                                <Text className="text-slate-500 text-base">
                                                                                    {
                                                                                        item.mobileNumber
                                                                                    }
                                                                                </Text>
                                                                            </View>
                                                                            <View className="flex flex-row items-start justify-start w-3/12">
                                                                                <Text className="text-slate-500 text-base">
                                                                                    {
                                                                                        item.email
                                                                                    }
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                )}
                                                            </View>
                                                        )}
                                                        keyExtractor={(
                                                            item,
                                                            index
                                                        ) => index.toString()}
                                                    />
                                                </View>
                                            </View>
                                        ) : (
                                            <Text className="font-bold text-md text-center py-2">
                                                No Contacts
                                            </Text>
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
                            width: 400,
                            height: "50%",
                            overflow: "scroll",
                            backgroundColor: "white",
                        }}
                    >
                        <View className="flex flex-row justify-end p-4">
                            <Pressable
                                onPress={() => hideDialog("invite")}
                                className={
                                    "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                                }
                                aria-describedby="InviteClient"
                            >
                                <Icon name="close" size={20} color="black" />
                            </Pressable>
                        </View>
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col w-1/2 justify-center items-center">
                                <View
                                    style={{
                                        backgroundColor: "#114EA8",
                                        padding: 10,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Icon
                                        name="check"
                                        size={100}
                                        color="white"
                                    />
                                </View>
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
