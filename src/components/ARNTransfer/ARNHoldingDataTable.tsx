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
    Modal,
    Image,
} from "native-base";

import RemoteApi from "../../services/RemoteApi";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import Icon from "react-native-vector-icons/FontAwesome";
import ManualInvite from "../SendInvite/ManualInvite";
import { Dialog, Portal } from "react-native-paper";
import CustomButton from "../Buttons/CustomButton";
import { BreadcrumbShadow } from "../Styles/Shadow";
import NoDataAvailable from "../Others/NoDataAvailable";
// import HoverEffectComponent from "./Hover";

const ARNHoldingDataTable = ({ id }) => {
    const [showImport, setShowImport] = useState(false);
    const handleRefreshPortfolio = () => {
        setShowImport(true);
    };

    const handleCloseModal = () => {
        setSelectedContacts([]);
        setSelectAll(false);
        setShowImport(false);
    };
    const dummyData = [
        {
            id: 1,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Invited",
            },
        },
        {
            id: 2,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
        {
            id: 3,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
        {
            id: 4,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
        {
            id: 5,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
        {
            id: 6,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
        {
            id: 7,
            folio: "3456765",
            scheme: {
                name: "Axis Mid Cap Fund Regular Growth",
                type: "Equity",
                size: "Mutli Cap",
            },
            current: "745372",
            invested: "745372",
            status: {
                name: "Not Invited",
            },
        },
    ];

    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<ClientExternalFolioData[]>([]);
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
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const [apiFail, setApiFail] = useState(true);

    console.log("selectedContacts");
    console.log(selectedContacts);
    const isSelected = (contact) => {
        console.log("Selected Contacts: ", selectedContacts);
        console.log("Checking if contact is selected: ", contact);
        console.log("isSelectContact: ", selectedContacts.includes(contact));

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
        console.log("today");
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

        const response: ClientExternalApiResponse = await RemoteApi.get(
            // `client/${id}/external-folios`,
            `client/${id}/external-folios`
        );

        // const response = {
        //     code: 400,
        // };

        console.log(JSON.stringify(response) + "external-folios");

        if (response.message === "Success") {
            setData(response.data);
            setFilteredContacts(response.data);

            // setFilteredContacts(dummyData.contacts);
            // console.log(filteredContacts);
            // setTotalItems(response?.data?.filterCount);
            setIsLoading(false);
            // setTotalPages(
            //     Math.ceil(
            //         (response?.data?.filterCount || response.data.data.length) /
            //             itemsPerPage
            //     )
            // );
        } else {
            setIsLoading(false);
            setApiFail(false);
            // setFilteredContacts(dummyData);
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

    const downloadReport = async () => {
        setIsDownloadProcessing(true);

        // let data: any = { filters: appliedFilers };

        // if (appliedSorting.key != "") {
        //     data["orderBy"] = appliedSorting;
        // }

        // const folioData = {
        //     folios: selectedContacts.map((obj) => parseInt(obj.id, 10)),
        // };

        const folioData = {
            folios: [6, 9, 1123334],
        };

        console.log(JSON.stringify(folioData));

        try {
            const response: any = await RemoteApi.downloadPdf({
                // endpoint: `client/6/arn-transfer`,
                endpoint: `client/${id}/arn-transfer`,
                fileName: "ARN-Form",
                data: folioData,
            });

            console.log(JSON.stringify(response) + "response");

            if (response) {
                setApiFail(false);
            } else {
                setShowImport(true);
                console.log("setShowImport(true);");
                getDataList();
                setSelectedContacts([]);
                setIsDownloadProcessing(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // console.log("filteredContacts)" + JSON.stringify(filteredContacts));

    return (
        <>
            <View className="bg-white">
                <View className=" mt-2">
                    {/* <DynamicFilters
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
                            

                            <ManualInvite getlist={getDataList} />
                            <CustomButton
                                onPress={sendInvite}
                                title=" Send Invite "
                                disabled={selectedContacts.length === 0}
                                style
                            />
                        </>
                    }
                /> */}

                    {!isLoading ? (
                        apiFail ? (
                            <>
                                <ScrollView className={"mt-4 z-[-2] "}>
                                    <View className="flex w-full">
                                        <View className="flex flex-row justify-center">
                                            <View className="w-full ">
                                                {width < 830 ? (
                                                    <View>
                                                        <View className="flex flex-row items-center p-2 w-full ">
                                                            <View className="flex flex-row items-start justify-between w-8/12">
                                                                <View className="flex flex-row items-start justify-start w-9/12">
                                                                    <Text className="py-3 font-semibold text-base">
                                                                        Select
                                                                        Folio to
                                                                        Transfer
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View className="flex flex-row items-start justify-center w-2/12 ">
                                                                {selectedContacts.length >=
                                                                0 ? (
                                                                    <>
                                                                        <View>
                                                                            <TouchableOpacity
                                                                                onPress={
                                                                                    toggleSelectAll
                                                                                }
                                                                            >
                                                                                <Text className="font-semibold text-md">
                                                                                    {selectAll ? (
                                                                                        <>
                                                                                            <View className="flex flex-row justify-between pr-3 items-center">
                                                                                                <View className="flex flex-row">
                                                                                                    <View className=" w-[99%]">
                                                                                                        <Text className="text-center text">
                                                                                                            Mark
                                                                                                            All
                                                                                                        </Text>
                                                                                                    </View>
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
                                                                                            </View>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <View className="flex flex-row justify-center">
                                                                                                <View className="flex flex-row  items-center justify-center">
                                                                                                    <View className="w-[99%]">
                                                                                                        <Text className="text-center">
                                                                                                            Mark
                                                                                                            All
                                                                                                        </Text>
                                                                                                    </View>
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
                                                                                                </View>
                                                                                            </View>
                                                                                        </>
                                                                                    )}
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <View></View>
                                                                    </>
                                                                )}
                                                            </View>
                                                        </View>
                                                        {filteredContacts.length >
                                                        0 ? (
                                                            <View className="h-80 overflow-scroll">
                                                                <View className="">
                                                                    <FlatList
                                                                        data={
                                                                            filteredContacts
                                                                        }
                                                                        renderItem={({
                                                                            item,
                                                                        }) => (
                                                                            <View>
                                                                                {item
                                                                                    ?.status
                                                                                    ?.name ===
                                                                                "Invited" ? (
                                                                                    <View className="flex flex-col items-center rounded w-[99%] p-2 mb-2 border shadow-sm border-gray-300 ">
                                                                                        <View className="flex flex-row justify-between w-full border-b border-gray-200 pb-2">
                                                                                            <View className="flex flex-col justify-start w-8/12 ">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    {item?.units?.toFixed(
                                                                                                        1
                                                                                                    )}
                                                                                                </Text>
                                                                                                <View className="flex flex-row">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500 text-xs"
                                                                                                    >
                                                                                                        {item?.redeemableAmount?.toFixed(
                                                                                                            1
                                                                                                        )}
                                                                                                    </Text>
                                                                                                    <Text className="flex items-center text-gray-500">
                                                                                                        {" "}
                                                                                                        -{" "}
                                                                                                    </Text>
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500 text-xs"
                                                                                                    >
                                                                                                        {item.redeemableUnits.toFixed(
                                                                                                            1
                                                                                                        )}
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>
                                                                                            <View className="flex flex-row items-center justify-center w-2/12">
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
                                                                                        </View>

                                                                                        <View className="flex flex-row items-start justify-center w-full pt-2">
                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500 text-xs"
                                                                                                >
                                                                                                    {
                                                                                                        item.folioNumber
                                                                                                    }
                                                                                                </Text>
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className=" text-xs"
                                                                                                >
                                                                                                    Folio
                                                                                                    No.
                                                                                                </Text>
                                                                                            </View>
                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500 text-xs"
                                                                                                >
                                                                                                    {item.currentValue.toFixed(
                                                                                                        1
                                                                                                    )}
                                                                                                </Text>
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className=" text-xs"
                                                                                                >
                                                                                                    Current
                                                                                                    Value
                                                                                                </Text>
                                                                                            </View>
                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500 text-xs"
                                                                                                >
                                                                                                    {item.investedValue.toFixed(
                                                                                                        1
                                                                                                    )}
                                                                                                </Text>
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-xs"
                                                                                                >
                                                                                                    Invested
                                                                                                </Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>
                                                                                ) : (
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
                                                                                            <View className="flex flex-col items-center rounded w-[99%] p-2 mb-2 border shadow-sm border-gray-300 bg-blue-100">
                                                                                                <View className="flex flex-row justify-between w-full border-b border-gray-200 pb-2">
                                                                                                    <View className="flex flex-col justify-start w-8/12 ">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-xs"
                                                                                                        >
                                                                                                            {item?.units?.toFixed(
                                                                                                                1
                                                                                                            )}
                                                                                                        </Text>
                                                                                                        <View className="flex flex-row">
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500 text-xs"
                                                                                                            >
                                                                                                                {item?.redeemableAmount?.toFixed(
                                                                                                                    1
                                                                                                                )}
                                                                                                            </Text>
                                                                                                            <Text className="flex items-center text-gray-500">
                                                                                                                {" "}
                                                                                                                -{" "}
                                                                                                            </Text>
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500 text-xs"
                                                                                                            >
                                                                                                                {item.redeemableUnits.toFixed(
                                                                                                                    1
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    <View className="flex flex-row items-center justify-center w-2/12">
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
                                                                                                </View>

                                                                                                <View className="flex flex-row items-start justify-center w-full pt-2">
                                                                                                    <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500 text-xs"
                                                                                                        >
                                                                                                            {
                                                                                                                item.folioNumber
                                                                                                            }
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className=" text-xs"
                                                                                                        >
                                                                                                            Folio
                                                                                                            No.
                                                                                                        </Text>
                                                                                                    </View>
                                                                                                    <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500 text-xs"
                                                                                                        >
                                                                                                            {item.currentValue.toFixed(
                                                                                                                1
                                                                                                            )}
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className=" text-xs"
                                                                                                        >
                                                                                                            Current
                                                                                                            Value
                                                                                                        </Text>
                                                                                                    </View>
                                                                                                    <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500 text-xs"
                                                                                                        >
                                                                                                            {item.investedValue.toFixed(
                                                                                                                1
                                                                                                            )}
                                                                                                        </Text>
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-xs"
                                                                                                        >
                                                                                                            Invested
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
                                                                                                    <View className="flex flex-col items-center rounded w-[99%] p-2 mb-2 border shadow-sm border-gray-300">
                                                                                                        <View className="flex flex-row justify-between w-full border-b border-gray-200 pb-2">
                                                                                                            <View className="flex flex-col justify-start w-8/12 ">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-xs"
                                                                                                                >
                                                                                                                    {item?.units?.toFixed(
                                                                                                                        1
                                                                                                                    )}
                                                                                                                </Text>
                                                                                                                <View className="flex flex-row">
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500 text-xs"
                                                                                                                    >
                                                                                                                        {item?.redeemableAmount?.toFixed(
                                                                                                                            1
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                    <Text className="flex items-center text-gray-500">
                                                                                                                        {" "}
                                                                                                                        -{" "}
                                                                                                                    </Text>
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500 text-xs"
                                                                                                                    >
                                                                                                                        {item.redeemableUnits.toFixed(
                                                                                                                            1
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                            <View className="flex flex-row items-center justify-center w-2/12">
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
                                                                                                        </View>

                                                                                                        <View className="flex flex-row items-start justify-center w-full pt-2">
                                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-slate-500 text-xs"
                                                                                                                >
                                                                                                                    {
                                                                                                                        item.folioNumber
                                                                                                                    }
                                                                                                                </Text>
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className=" text-xs"
                                                                                                                >
                                                                                                                    Folio
                                                                                                                    No.
                                                                                                                </Text>
                                                                                                            </View>
                                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-slate-500 text-xs"
                                                                                                                >
                                                                                                                    {item.currentValue.toFixed(
                                                                                                                        1
                                                                                                                    )}
                                                                                                                </Text>
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className=" text-xs"
                                                                                                                >
                                                                                                                    Current
                                                                                                                    Value
                                                                                                                </Text>
                                                                                                            </View>
                                                                                                            <View className="flex flex-col items-start justify-start w-4/12">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-slate-500 text-xs"
                                                                                                                >
                                                                                                                    {item.investedValue.toFixed(
                                                                                                                        1
                                                                                                                    )}
                                                                                                                </Text>
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-xs"
                                                                                                                >
                                                                                                                    Invested
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
                                                                <Text className="font-bold text-md text-center py-2">
                                                                    No Contacts
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <>
                                                        <View className="p-2 ">
                                                            <Text className="font-bold text-lg">
                                                                Select Folio to
                                                                Transfer
                                                            </Text>
                                                        </View>
                                                        <View>
                                                            {filteredContacts.length >
                                                            0 ? (
                                                                <View>
                                                                    <View className="flex flex-row items-center px-4 w-[99%] ">
                                                                        <View className="flex flex-row items-start justify-center w-2/12">
                                                                            {selectedContacts.length >=
                                                                            0 ? (
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
                                                                            ) : (
                                                                                <>
                                                                                    <View></View>
                                                                                    {/* <View className="flex flex-row justify-center">
                                                                        <View className="flex flex-col pr-3 items-center justify-center">
                                                                            <View className="flex flex-row justify-center">
                                                                                <View
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            "#CCCCCC",
                                                                                        padding: 8,
                                                                                        borderRadius: 4,
                                                                                        borderWidth: 2,
                                                                                        borderColor:
                                                                                            "#CCCCCC",
                                                                                    }}
                                                                                ></View>
                                                                            </View>
                                                                            <View className="pl-2">
                                                                                <Text className="text-xs text-slate-400">
                                                                                    Select
                                                                                    All
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    </View> */}
                                                                                </>
                                                                            )}
                                                                        </View>
                                                                        <View className="flex flex-row items-start justify-center w-2/12">
                                                                            <View className="flex flex-row items-start justify-start w-9/12">
                                                                                <Text className="py-3 font-bold">
                                                                                    Folio
                                                                                    No.
                                                                                </Text>
                                                                            </View>
                                                                        </View>

                                                                        <View className="flex flex-row items-center justify-start w-4/12">
                                                                            <View className="flex flex-row items-center justify-start w-4/12">
                                                                                <Text className="py-3 font-bold">
                                                                                    Units
                                                                                </Text>
                                                                            </View>
                                                                            <View className="flex flex-row items-center justify-start w-4/12">
                                                                                <Text className="py-3 font-bold">
                                                                                    Redeemable
                                                                                    Amount
                                                                                </Text>
                                                                            </View>
                                                                            <View className="flex flex-row items-center justify-start w-4/12">
                                                                                <Text className="py-3 font-bold">
                                                                                    Redeemable
                                                                                    Units
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                        <View className="flex flex-row items-center justify-start w-2/12">
                                                                            <Text className="py-3 font-bold">
                                                                                Current
                                                                                Value
                                                                            </Text>
                                                                        </View>
                                                                        <View className="flex flex-row items-center justify-start w-2/12">
                                                                            <Text className="py-3 font-bold">
                                                                                Invested
                                                                                Value
                                                                            </Text>
                                                                        </View>
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
                                                                                    {item
                                                                                        ?.status
                                                                                        ?.name ===
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

                                                                                            <View className="flex flex-row items-start justify-center w-2/12 ">
                                                                                                <View className="flex flex-row items-start justify-start w-8/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500"
                                                                                                    >
                                                                                                        {
                                                                                                            item.folioNumber
                                                                                                        }
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>

                                                                                            <View className="flex flex-row items-start justify-start w-4/12">
                                                                                                <View className="w-4/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500 "
                                                                                                    >
                                                                                                        {item?.units?.toFixed(
                                                                                                            1
                                                                                                        )}
                                                                                                    </Text>
                                                                                                </View>

                                                                                                <View className="w-4/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500"
                                                                                                    >
                                                                                                        {item?.redeemableAmount?.toFixed(
                                                                                                            1
                                                                                                        )}
                                                                                                    </Text>
                                                                                                </View>
                                                                                                <View className="w-4/12">
                                                                                                    <Text
                                                                                                        selectable
                                                                                                        className="text-slate-500"
                                                                                                    >
                                                                                                        {item.redeemableUnits.toFixed(
                                                                                                            1
                                                                                                        )}
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>
                                                                                            <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500"
                                                                                                >
                                                                                                    {item.currentValue.toFixed(
                                                                                                        1
                                                                                                    )}
                                                                                                </Text>
                                                                                            </View>
                                                                                            <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                <Text
                                                                                                    selectable
                                                                                                    className="text-slate-500"
                                                                                                >
                                                                                                    {item.investedValue.toFixed(
                                                                                                        1
                                                                                                    )}
                                                                                                </Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    ) : (
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
                                                                                                    <View className="flex flex-row items-start justify-center w-2/12 ">
                                                                                                        <View className="flex flex-row items-start justify-start w-8/12">
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500 font-bold"
                                                                                                            >
                                                                                                                {
                                                                                                                    item.folioNumber
                                                                                                                }
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                    </View>

                                                                                                    <View className="flex flex-row items-start justify-start w-4/12">
                                                                                                        <View className="w-4/12">
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500 "
                                                                                                            >
                                                                                                                {item?.units?.toFixed(
                                                                                                                    1
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </View>

                                                                                                        <View className="w-4/12">
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500"
                                                                                                            >
                                                                                                                {item?.redeemableAmount?.toFixed(
                                                                                                                    1
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                        <View className="w-4/12">
                                                                                                            <Text
                                                                                                                selectable
                                                                                                                className="text-slate-500"
                                                                                                            >
                                                                                                                {item.redeemableUnits.toFixed(
                                                                                                                    1
                                                                                                                )}
                                                                                                            </Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500"
                                                                                                        >
                                                                                                            {item.currentValue.toFixed(
                                                                                                                1
                                                                                                            )}
                                                                                                        </Text>
                                                                                                    </View>
                                                                                                    <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                        <Text
                                                                                                            selectable
                                                                                                            className="text-slate-500"
                                                                                                        >
                                                                                                            {item.investedValue.toFixed(
                                                                                                                1
                                                                                                            )}
                                                                                                        </Text>
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
                                                                                                            <View className="flex flex-row items-start justify-center w-2/12 ">
                                                                                                                <View className="flex flex-row items-start justify-start w-8/12">
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500"
                                                                                                                    >
                                                                                                                        {
                                                                                                                            item.folioNumber
                                                                                                                        }
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                            </View>

                                                                                                            <View className="flex flex-row items-start justify-start w-4/12">
                                                                                                                <View className="w-4/12">
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500 "
                                                                                                                    >
                                                                                                                        {item?.units?.toFixed(
                                                                                                                            1
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                </View>

                                                                                                                <View className="w-4/12">
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500"
                                                                                                                    >
                                                                                                                        {item?.redeemableAmount?.toFixed(
                                                                                                                            1
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                                <View className="w-4/12">
                                                                                                                    <Text
                                                                                                                        selectable
                                                                                                                        className="text-slate-500"
                                                                                                                    >
                                                                                                                        {item.redeemableUnits.toFixed(
                                                                                                                            1
                                                                                                                        )}
                                                                                                                    </Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                            <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-slate-500"
                                                                                                                >
                                                                                                                    {item.currentValue.toFixed(
                                                                                                                        1
                                                                                                                    )}
                                                                                                                </Text>
                                                                                                            </View>
                                                                                                            <View className="flex flex-row items-start justify-start w-2/12">
                                                                                                                <Text
                                                                                                                    selectable
                                                                                                                    className="text-slate-500"
                                                                                                                >
                                                                                                                    {item.investedValue.toFixed(
                                                                                                                        1
                                                                                                                    )}
                                                                                                                </Text>
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
                                                                    <Text className="font-bold text-md text-center py-2">
                                                                        No
                                                                        Contacts
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    </>
                                                )}
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
                                <View className="border-t border-gray-200">
                                    <View className="w-full md:w-1/2 py-2">
                                        {isDownloadProcessing ? (
                                            <CustomButton
                                                onPress={downloadReport}
                                                title="Download in Progress...."
                                                disabled={true}
                                                style={{
                                                    button: "bg-[#013974]",
                                                    text: "text-white",
                                                }}
                                            />
                                        ) : (
                                            <CustomButton
                                                onPress={downloadReport}
                                                title="Download and send ARN transfer form"
                                                disabled={
                                                    selectedContacts.length ===
                                                    0
                                                }
                                                style={{
                                                    button: "bg-[#013974]",
                                                    text: "text-white",
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View className="flex flex-row justify-center items-center">
                                    <View>
                                        <Text className="font-bold text-lg">
                                            External Folios
                                        </Text>
                                    </View>
                                </View>

                                <NoDataAvailable />
                            </>
                        )
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

                {/* <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                getDataList={getDataList}
                currentPageNumber={currentPageNumber}
                totalPages={totalPages}
                setCurrentPageNumber={setCurrentPageNumber}
            /> */}

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
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="black"
                                    />
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
            <View>
                <Modal
                    isOpen={showImport}
                    onClose={handleCloseModal}
                    className="md:p-10"
                >
                    <Modal.Content className="bg-white md:p-8">
                        <Modal.CloseButton />
                        <Modal.Body>
                            <View className="flex flex-row  justify-center pb-4">
                                <Image
                                    className=""
                                    alt="ico"
                                    source={require("../../../assets/images/Tick.png")}
                                    style={{
                                        // flex: 1,
                                        // justifyContent: 'end',
                                        width: 100, // specify the desired width
                                        height: 100,
                                    }}
                                />
                            </View>

                            <View className="flex flex-row justify-center md:pt-8">
                                <Text className="text-center font-semibold">
                                    ARN transfer form has been downloaded
                                </Text>
                            </View>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#eee",
        borderRadius: 5,
        alignItems: "center",
    },
    hovered: {
        backgroundColor: "#ddd", // Change background color on hover
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ARNHoldingDataTable;
