import * as React from "react";
import {
    TouchableOpacity,
    View,
    useWindowDimensions,
    Text,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import RemoteApi from "../../services/RemoteApi";
import { RTAReconciliationRows } from "./RTAReconciliationRows";
import { Pagination } from "../Pagination/Pagination";
import {
    Box,
    Button,
    CheckIcon,
    HStack,
    Heading,
    Popover,
    Pressable,
    Select,
    Spinner,
} from "native-base";
import {
    RTAReconcilation,
    RTAResponseResponseInterface,
} from "../../interfaces/RTAResponseInterface";
import DatePickerNew from "../CustomDatePicker/DatePickerNew";
import CalendarPicker from "../CustomDatePicker/CalendarPicker";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { Cards } from "./Cards";
import NoDataAvailable from "../Others/NoDataAvailable";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import { dateTimeFormat } from "../../helper/DateUtils";
import { getTransactionMessage } from "../../helper/StatusInfo";
import { useUserRole } from "../../context/useRoleContext";
import DataTable from "../DataTable/DataTable";

const TransactionDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<RTAReconcilation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = React.useState<any>(undefined);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { height, width } = useWindowDimensions();

    const [params, setParams] = useState(
        useLocalSearchParams<{ holdingId?: string }>()
    );
    // console.log('params', params);

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

        if (params?.holdingId) {
            const checkIfHoldingIdExist = data.filters.find(
                (filter) => filter.key == "holdingId"
            );
            if (!checkIfHoldingIdExist) {
                // console.log('inside---');

                data.filters.push({
                    key: "holdingId",
                    operator: "eq",
                    value: Number(params.holdingId),
                });
            }
        }

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        console.log("Transactiondata"+ JSON.stringify(data))

        const response: RTAResponseResponseInterface = await RemoteApi.post(
            "transaction/list",
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
        }else{
            setIsLoading(false);
            // window.alert(response.message)

        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("transaction/schema");
            setFiltersSchema(response);
            setSorting(response?.sort);
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

    const transformedData = data?.map((rta) => {
        console.log("rta", rta)
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className={`flex flex-row w-[99%] flex-wrap`}>
                        <View className="flex flex-row items-center justify-start flex-wrap w-[99%]">
                            {/* <Pressable
                                onPress={() =>
                                    router.push(`/clients/${rta.account.id}`)
                                }
                                className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap"
                            >
                                <Text selectable className="text-white">
                                    {getInitials(rta.account.name)}
                                </Text>
                            </Pressable> */}
                            <View className="flex flex-col flex-wrap w-[99%]">
                                <Pressable
                                    onPress={() =>
                                        router.push(
                                            `/clients/${rta.account.id}`
                                        )
                                    }
                                >
                                    <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12">
                                        <Text
                                            selectable
                                            className="text-black font-semibold break-all"
                                        >
                                            {rta.account.name}&nbsp;
                                        </Text>
                                        {/* <Popover
                                        trigger={(triggerProps) => {
                                            return (
                                                <TouchableOpacity
                                                    {...triggerProps}
                                                >
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
                                                Customer Detail
                                            </Popover.Header>
                                            <Popover.Body>
                                                <View>
                                                    <Text>
                                                        Name: {rta.account.name}
                                                    </Text>
                                                    <Text>
                                                        PAN Number:{" "}
                                                        {
                                                            rta.account.user[0]
                                                                .panNumber
                                                        }
                                                    </Text>
                                                </View>
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover> */}
                                    </View>
                                </Pressable>
                                <View className="flex flex-col items-start mt-0 w-[99%]">
                                    <Text
                                        selectable
                                        className="text-[#6C6A6A] text-xs"
                                    >
                                        Client code:
                                    </Text>
                                    <Text
                                        selectable
                                        className="text-gray-800 text-sm"
                                    >
                                        {rta.account.clientId}
                                    </Text>
                                    {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}
                                </View>
                                <View className="flex flex-col items-start mt-0 w-[99%]">
                                    <Text
                                        selectable
                                        className="text-[#6C6A6A] text-xs"
                                    >
                                        PAN No.:
                                    </Text>
                                    <Text
                                        selectable
                                        className=" text-gray-800 text-sm"
                                    >
                                        {rta?.account?.user[0]?.panNumber}
                                    </Text>
                                    {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "scheme",
                content: (
                    <View className={`flex flex-row w-[99%]`}>
                        <View className="flex flex-col w-[99%]">
                            <Text
                                selectable
                                className="text-gray-800 text-xs font-semibold  whitespace-normal "
                            >
                                {rta.mutualfund.name}
                            </Text>
                            <Text
                                selectable
                                className="text-[#686868] font-semibold text-xs"
                            >
                                {rta?.mutualfund?.deliveryType?.name
                                    ? rta?.mutualfund?.deliveryType?.name
                                    : "-"}
                                {rta?.mutualfund?.optionType?.name
                                    ? " - " + rta?.mutualfund?.optionType?.name
                                    : "-"}
                                {rta?.mutualfund?.dividendType?.name &&
                                rta?.mutualfund?.dividendType?.name !== "NA"
                                    ? " - " +
                                      rta?.mutualfund?.dividendType?.name
                                    : ""}
                            </Text>
                        </View>
                    </View>
                ),
            },
            {
                key: "bseOrder",
                content: (
                    <View className="flex flex-row w-[99%] ">
                        <Text className="w-full" selectable>
                            {rta.orderReferenceNumber || "NA"}
                        </Text>
                    </View>
                ),
            },

            {
                key: "paymentDateTime",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Text className="w-12/12" selectable>
                            {rta.paymentDate
                                ? dateTimeFormat(rta.paymentDate)
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "folio",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Text className="w-12/12" selectable>
                            {rta.folioNumber || "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "amount",
                content: (
                    <View className="flex flex-row w-[99%] ">
                        <View className="flex flex-col">
                            <Text selectable>
                                {rta.amount ? RupeeSymbol + rta.amount.toFixed(2) : "NA"}
                            </Text>
                            {rta.units ? (
                                <Text selectable className="text-[10px]">
                                    {rta.units.toFixed(2)} Units
                                </Text>
                            ) : (
                                ""
                            )}

                            {rta.nav ? (
                                <Text selectable className="text-[10px]">
                                    {rta.nav.toFixed(2)} NAV
                                </Text>
                            ) : (
                                ""
                            )}
                        </View>
                    </View>
                ),
            },
            {
                key: "createdAt",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Text className="w-[99%]" selectable>
                            {rta.createdAt
                                ? dateTimeFormat(rta.createdAt)
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "transactionType",
                content: (
                    <View className="flex w-[99%] flex-row ">
                        <Text className="w-[99%]" selectable>
                            {rta.transactionType || "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "transactionStatus",
                content: (
                    <View className="flex flex-row w-[99%] justify-start items-start">
                        <View className="flex flex-col h-6 items-start justify-start w-full">
                            <View className="w-full flex flex-row items-center justify-start">
                                <View className="flex flex-row items-center justify-start w-full">
                                    <View className="flex flex-row h-full justify-start items-start p-1">
                                        <Popover
                                            trigger={(triggerProps) => {
                                                return (
                                                    <TouchableOpacity
                                                        {...triggerProps}
                                                    >
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
                                                    {rta.transactionStatus}
                                                </Popover.Header>
                                                <Popover.Body>
                                                    <View>
                                                        <Text>
                                                            {getTransactionMessage(
                                                                rta.transactionStatus
                                                            )}
                                                        </Text>
                                                    </View>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover>
                                    </View>
                                    <Text
                                        selectable
                                        className="text-black text-md w-[99%]"
                                    >
                                        {rta.transactionStatus || "NA"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "action",
                content: (
                    <View className="flex flex-row w-[99%] justify-start">
                        <Pressable
                            onPress={() =>
                                router.push(`rta-reconciliation/${rta.id}`)
                            }
                            className="rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6"
                        >
                            <Text
                                selectable
                                className="text-white text-center text-xs w-10/12"
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
                    <View className="flex flex-row w-[99%]">
                        <Text className="w-[99%]" selectable>
                            {rta?.distributor?.name
                                ? rta?.distributor?.name
                                : "NA"}
                        </Text>
                    </View>
                ),
            });
        }

        if (roleId > 3) {
            itemStructure.splice(3, 0, {
                key: "Manager",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Text className="w-[99%]" selectable>
                            {rta?.distributor?.managementUsers[0].name
                                ? rta?.distributor?.managementUsers[0].name
                                : "NA"}
                        </Text>
                    </View>
                ),
            });
        }

        return itemStructure;
    });

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb
                    name={"Transactions"}
                    icon={require("../../../assets/transactionReport.png")}
                />
            </View>
            <View className="h-screen">
                <>
                    <View className="border-[0.2px]  border-[#e4e4e4]">
                        {/* {data.length !== 0 && */}
                        <DynamicFilters
                            appliedSorting={appliedSorting}
                            setAppliedSorting={setAppliedSorting}
                            sorting={sorting}
                            fileName="Transaction"
                            downloadApi={"transaction/download-report"}
                            schemaResponse={filtersSchema}
                            setCurrentPageNumber={setCurrentPageNumber}
                            getList={getDataList}
                            appliedFilers={appliedFilers}
                            setAppliedFilers={setAppliedFilers}
                        />
                        {/* } */}
                        {!isLoading ? (
                            //  data.length === 0
                            //     ? (
                            //         <NoDataAvailable />
                            //     ) : (
                            <View className={"mt-4 z-[-1] "}>
                                {width < 830 ? (
                                    <Cards
                                        data={data}
                                        schema={null}
                                        getDataList={getDataList}
                                    />
                                ) : roleId > 3 ? (
                                    <DataTable
                                        headers={[
                                            "Client",
                                            "Scheme",
                                            "Distributor",
                                            "Manager",
                                            "BSE Order No",
                                            "Payment Date",
                                            "Folio",
                                            "Amount",
                                            "Created At",
                                            "Transaction Type",
                                            "Transaction Status",
                                            "Action",
                                        ]}
                                        cellSize={[
                                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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
                                            "Scheme",
                                            "Distributor",
                                            "BSE Order No",
                                            "Payment Date",
                                            "Folio",
                                            "Amount",
                                            "Created At",
                                            "Transaction Type",
                                            "Transaction Status",
                                            "Action",
                                        ]}
                                        cellSize={[
                                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                        ]}
                                        rows={transformedData}
                                    />
                                ) : (
                                    <DataTable
                                        headers={[
                                            "Client",
                                            "Scheme",
                                            "BSE Order No",
                                            "Payment Date",
                                            "Folio",
                                            "Amount",
                                            "Created At",
                                            "Transaction Type",
                                            "Transaction Status",
                                            "Action",
                                        ]}
                                        cellSize={[
                                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                        ]}
                                        rows={transformedData}
                                    />
                                )}
                            </View>
                        ) : (
                            // )
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
                        totalItems={totalItems}
                        setCurrentPageNumber={setCurrentPageNumber}
                    />
                    {/* )} */}
                </>
            </View>
        </View>
    );
};

export default TransactionDataTable;
