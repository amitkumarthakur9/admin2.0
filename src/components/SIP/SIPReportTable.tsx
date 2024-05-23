import * as React from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { useState } from "react";
import { OrderInterface } from "../../interfaces/OrderInterface";
import RemoteApi from "../../services/RemoteApi";
import { OrdersResponse } from "../../interfaces/OrdersResposeInterface";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { SIPRows } from "./SIPRows";
import { Pagination } from "../Pagination/Pagination";
import { HStack, Heading, Popover, Spinner } from "native-base";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { MobileSIPRows } from "./MobileSIPRows";
import NoDataAvailable from "../Others/NoDataAvailable";
import { useUserRole } from "../../context/useRoleContext";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import { dateTimeFormat, getNextSipDate } from "../..//helper/DateUtils";
import { getOrderMessage } from "../../helper/StatusInfo";
import DataTable from "../DataTable/DataTable";

const SIPReportTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<SIPReportItems[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { height, width } = useWindowDimensions();

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

        const response: SIPResponseInterface = await RemoteApi.post(
            "sip/list",
            data
        );

        if (response.code == 200) {
            setData(response.data);
            // setItemsPerPage(response.count)
            setTotalItems(response.filterCount);
            setIsLoading(false);
            setTotalPages(
                Math.ceil(
                    (response.filterCount || response.data.length) /
                        itemsPerPage
                )
            );
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("sip/schema");
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

    const transformedData = data?.map((item) => {
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center justify-start w-11/12">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(
                                    item?.client.name ? item?.client.name : "-"
                                )}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-[99%]">
                            <View className="flex flex-row items-center text-black font-semibold flex-wrap mb-2 w-[99%]">
                                <View className="w-11/12">
                                    <Pressable
                                        onPress={() =>
                                            router.push(`clients/${item?.id}`)
                                        }
                                    >
                                        <Text
                                            selectable
                                            className="flex flex-row text-black font-semibold break-all "
                                        >
                                            {item?.client.name
                                                ? item?.client.name
                                                : "-"}
                                            &nbsp;{" "}
                                        </Text>
                                    </Pressable>
                                </View>

                                <View className="flex flex-row items-center w-[1/12]">
                                    {/* {item?.isActive ? (
                                        <CheckCircleIcon
                                            color="emerald.500"
                                            size="xs"
                                        />
                                    ) : (
                                        <WarningIcon
                                            size="xs"
                                            color="orange.500"
                                        />
                                    )} */}
                                    {/* <CheckCircleIcon
                                        color="emerald.500"
                                        size="xs"
                                    /> */}
                                </View>
                            </View>
                            <View className="flex flex-row flex-wrap items-center mt-0 w-11/12">
                                {/* <Tag>
                                    KYC{" "} */}
                                {/* {item?.users[0]?.kycStatus
                                        ?.isAllowedToTransact
                                        ? "Done"
                                        : "Not Done"} */}
                                {/* </Tag> */}
                                {/* <Tag>SIP(N/A)</Tag> */}
                                {/* <Tag>Autopay active</Tag> */}
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "FolioNumber",
                content: (
                    <Pressable onPress={() => router.push(`folio/${item?.id}`)}>
                        <Text
                            selectable
                            className="text-[#686868] font-semibold w-11/12 text-center"
                        >
                            {item?.folioNumber ? item?.folioNumber : "NA"}&nbsp;
                        </Text>
                    </Pressable>
                ),
            },
            {
                key: "Scheme",
                content: (
                    <View className="flex flex-col justify-start w-11/12">
                        {/* <Pressable
                            onPress={() =>
                                router.push(`clients/${item?.mutualfund?.id}`)
                            }
                        >
                            <Text
                                selectable
                                className="flex flex-row text-black font-semibold break-all"
                            >
                                {item?.mutualfund?.name
                                    ? item?.mutualfund?.name
                                    : "-"}
                            </Text>
                        </Pressable> */}

                        <Text selectable className="text-black font-semibold">
                            {item?.mutualfund?.name
                                ? item?.mutualfund?.name
                                : "-"}
                        </Text>
                        <Text
                            selectable
                            className="text-[#686868] font-semibold text-xs"
                        >
                            {item?.mutualfund?.deliveryType?.name
                                ? item?.mutualfund?.deliveryType?.name
                                : "-"}
                            {item?.mutualfund?.optionType?.name
                                ? " - " + item?.mutualfund?.optionType?.name
                                : "-"}
                            {item?.mutualfund?.dividendType?.name &&
                            item?.mutualfund?.dividendType?.name !== "NA"
                                ? " - " + item?.mutualfund?.dividendType?.name
                                : ""}
                        </Text>
                        <Text
                            selectable
                            className="text-[#686868] font-semibold text-xs"
                        >
                            {"SIPRegnNo: " + item.sipReferenceNumber}
                        </Text>
                        {/* <Text selectable className="text-[#686868] font-semibold text-xs">
                        {item?.mutualfund?.category ? item?.mutualfund?.category : "" }
                        {item?.mutualfund?.subCategory ? " - " + item?.mutualfund?.subCategory : "" }
                        </Text> */}
                    </View>
                ),
            },

            {
                key: "requestDateTime",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        {item.startDate ? dateTimeFormat(item.startDate) : "-"}
                    </Text>
                ),
            },
            {
                key: "nextSipDate",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        {item.startDate ? getNextSipDate(item.startDate) : "-"}
                    </Text>
                ),
            },
            {
                key: "amount",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        {item?.amount
                            ? RupeeSymbol + item?.amount.toFixed(2)
                            : "0"}
                    </Text>
                ),
            },
            {
                key: "status",
                content: (
                    <View className="hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center">
                        <View className="flex flex-col rounded-full w-8/12 items-center justify-center">
                            <View className="flex flex-row items-center justify-center w-11/12">
                                <Popover
                                    trigger={(triggerProps) => {
                                        return (
                                            <TouchableOpacity {...triggerProps}>
                                                <Icon
                                                    name="info-circle"
                                                    size={12}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                >
                                    <Popover.Content
                                        accessibilityLabel="Order Details"
                                        w="56"
                                    >
                                        <Popover.Arrow />
                                        <Popover.CloseButton />
                                        <Popover.Header>
                                            {item.orderStatus.name}
                                        </Popover.Header>
                                        <Popover.Body>
                                            <View>
                                                <Text>
                                                    {getOrderMessage(
                                                        item.orderStatus.name
                                                    )}
                                                </Text>
                                            </View>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                                <Text
                                    selectable
                                    className="p-1 text-black text-end md:text-center text-xs"
                                >
                                    {item.orderStatus.name}
                                    &nbsp;
                                </Text>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "action",
                content: (
                    <View className="flex flex-row items-center w-[99%]  justify-start ">
                        <Pressable
                            onPress={() =>
                                router.push(`sip-reports/${item.id}`)
                            }
                            className="rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-11/12 h-6"
                        >
                            {/* <Icon name="ellipsis-v" size={18} color="grey" /> */}
                            <Text
                                selectable
                                className="text-white text-center text-xs"
                            >
                                View
                            </Text>
                        </Pressable>
                    </View>
                ),
            },
            // {
            //     key: "detail",
            //     content: (
            //         <View className="flex flex-row w-10/12 justify-center">
            //             <Pressable
            //                 onPress={() => router.push(`folio/${item?.id}`)}
            //             >
            //                 <Icon name="ellipsis-v" size={18} color="grey" />
            //             </Pressable>
            //         </View>
            //     ),
            // },
        ];

        // Conditionally add an additional object based on roleId to index 2
        if (roleId > 2) {
            itemStructure.splice(2, 0, {
                key: "distributor",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.distributor?.name}
                    </Text>
                ),
            });
        }

        if (roleId > 3) {
            itemStructure.splice(3, 0, {
                key: "Manager",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.distributor?.managementUsers?.[0].name}
                    </Text>
                ),
            });
        }

        return itemStructure;
    });

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb name={"SIP Reports"} icon={require("../../../assets/sipReport.png")}/>
            </View>
            <View className="h-screen">
                <>
                    <View className="border-[0.2px]  border-[#e4e4e4]">
                        {/* {data.length !== 0 && ( */}
                            <DynamicFilters
                                appliedSorting={appliedSorting}
                                setAppliedSorting={setAppliedSorting}
                                sorting={sorting}
                                fileName="SIP"
                                downloadApi={"sip/download-report"}
                                schemaResponse={filtersSchema}
                                setCurrentPageNumber={setCurrentPageNumber}
                                getList={getDataList}
                                appliedFilers={appliedFilers}
                                setAppliedFilers={setAppliedFilers}
                            />
                        {/* )} */}
                        {!isLoading ? (
                            // data.length === 0 ? (
                            //     <NoDataAvailable />
                            // ) : (
                                <ScrollView className="mt-4 z-[-1]">
                                    {width < 830 ? (
                                        <MobileSIPRows
                                            data={data}
                                            schema={null}
                                        />
                                    ) : roleId > 3 ? (
                                        <DataTable
                                            headers={[
                                                "Client",
                                                "Folio",
                                                "Distributor",
                                                "Manager",
                                                "Scheme",
                                                "Request Date Time",
                                                "Next SIP Date",
                                                "Amount",
                                                "Status",
                                                "Action",
                                            ]}
                                            cellSize={[
                                                2, 1, 1, 1, 2, 1, 1, 1, 1, 1,
                                            ]}
                                            // cellSize={[
                                            //     "20%",
                                            //     "10%",
                                            //     "10%",
                                            //     "10%",
                                            //     "10%",
                                            //     "10%",
                                            //     "10%",
                                            //     "5%",
                                            //     "10%",
                                            //     "5%",
                                            // ]}
                                            rows={transformedData}
                                        />
                                    ) : roleId > 2 ? (
                                        <DataTable
                                            headers={[
                                                "Client",
                                                "Folio",
                                                "Distributor",
                                                "Scheme",
                                                "Request Date Time",
                                                "Next SIP Date",
                                                "Amount",
                                                "Status",
                                                "Action",
                                            ]}
                                            cellSize={[
                                                2, 1, 1, 2, 1, 1, 1, 1, 1,
                                            ]}
                                            rows={transformedData}
                                        />
                                    ) : (
                                        <DataTable
                                            headers={[
                                                "Client",
                                                "Folio",
                                                "Scheme",
                                                "Request Date Time",
                                                "Next SIP Date",
                                                "Amount",
                                                "Status",
                                                "Action",
                                            ]}
                                            cellSize={[2, 1, 2, 1, 1, 1, 1, 1]}
                                            rows={transformedData}
                                        />
                                    )}
                                </ScrollView>
                            // )
                        ) : (
                            <HStack
                                space={2}
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
                    {/* {data.length !== 0 && ( */}
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            getDataList={getDataList}
                            currentPageNumber={currentPageNumber}
                            totalPages={totalPages}
                            setCurrentPageNumber={setCurrentPageNumber}
                        />
                    {/* )} */}
                </>
            </View>
        </View>
    );
};

export default SIPReportTable;
