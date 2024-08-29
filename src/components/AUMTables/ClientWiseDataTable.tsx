import * as React from "react";
import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { router } from "expo-router";
import {
    CheckCircleIcon,
    HStack,
    Heading,
    Spinner,
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
import TableCard from "../Card/TableCard";
import { useUserRole } from "../../context/useRoleContext";
import NoDataAvailable from "../Others/NoDataAvailable";

const ClientWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<ClientWiseData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();

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

        try {
            const response: ClientWiseResponse = await RemoteApi.post(
                "aum/client/list",
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
            } else {
                setIsLoading(false);

                // alert("Internal Server Error");
            }
        } catch (error) {
            alert(error);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("aum/client/schema");
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

    const mobileData = data.map((item) => ({
        // id: item.id,
        Name: item?.name,
        ClientId: item?.clientId,
        PanNumber: item?.panNumber,
        CurrentValue: RupeeSymbol + item.currentValue,
        InvestedValue: RupeeSymbol + item.investedValue,
        XIRR: item?.xirr,
    }));

    const transformedData = data?.map((item) => {
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center justify-center w-[99%]">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(item?.name)}
                            </Text>
                        </View>
                        <View className="flex flex-col  w-9/12">
                            <View className="flex flex-row items-center text-black font-semibold mb-2">
                                <Pressable
                                    onPress={() =>
                                        router.push(`clients/${item?.id}`)
                                    }
                                    className="flex flex-row w-[99%]"
                                >
                                    <Text
                                        selectable
                                        className="flex flex-row text-black font-semibold break-all"
                                    >
                                        {item?.name}&nbsp;{" "}
                                    </Text>

                                    <View className="flex flex-row items-center">
                                        {item?.isActive == true ? (
                                            <CheckCircleIcon
                                                color="emerald.500"
                                                size="xs"
                                            />
                                        ) : (
                                            <WarningIcon
                                                size="xs"
                                                color="orange.500"
                                            />
                                        )}
                                    </View>
                                </Pressable>
                            </View>
                            <View className="flex flex-row items-center mt-0">
                                {item?.kycStatus?.name == "Verified" ? (
                                    <Tag>KYC Done</Tag>
                                ) : (
                                    <Tag>KYC Not Done</Tag>
                                )}
                                {/* <Tag>SIP(N/A)</Tag> */}
                                {/* <Tag>Autopay active</Tag> */}
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "clientCode",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        {item?.clientId ? item?.clientId : "-"}
                    </Text>
                ),
            },
            {
                key: "panNumber",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.panNumber ? item?.panNumber : "-"}
                    </Text>
                ),
            },
            {
                key: "totalinvested",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.investedValue
                            ? RupeeSymbol + item?.investedValue.toFixed(2)
                            : RupeeSymbol + "0"}
                    </Text>
                ),
            },
            {
                key: "CurrentValue",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.currentValue
                            ? RupeeSymbol + item?.currentValue.toFixed(2)
                            : RupeeSymbol + "0"}
                    </Text>
                ),
            },
            {
                key: "XIRR",
                content: (
                    <View className="w-[99%]">
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.xirr ? item?.xirr.toFixed(2) + "%" : "0%"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "returns",
                content: (
                    <View className="flex flex-row justify-center text-[#686868] font-semibold w-11/12 ">
                        <Text
                            selectable
                            className="text-[#686868] font-semibold w-11/12"
                        >
                            {item?.investedValue && item?.currentValue
                                ? RupeeSymbol +
                                  (
                                      item?.currentValue - item?.investedValue
                                  ).toFixed(2)
                                : RupeeSymbol + "0"}
                        </Text>
                    </View>
                ),
            },
            // {
            //     key: "detail",
            //     content: (
            //         <View className="flex flex-row w-10/12 justify-center">
            //             <Pressable
            //                 onPress={() =>
            //                     router.push('clients/${client.id}')
            //                 }
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
        <View className="h-screen">
            <View className="bg-white">
                {/* <View className="">
                <TableBreadCrumb name={"Client Wise"} />
            </View> */}
                <View className="border-[0.2px]  border-[#e4e4e4]">
                    {/* {data.length !== 0 && ( */}
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
                    />
                    {/* )} */}

                    {!isLoading ? (
                        // data.length === 0 ? (
                        //     <NoDataAvailable />
                        // ) : (
                        // <ScrollView className={"mt-4 z-[-1] "}>
                        <View className={"mt-4 z-[-1] "}>
                            {width < 830 ? (
                                <TableCard data={mobileData} />
                            ) : roleId > 3 ? (
                                <DataTable
                                    headers={[
                                        "Client Name",
                                        "Client Code",
                                        "Distributor",
                                        "Manager",
                                        "PAN",
                                        "Total Invested",
                                        "Current Value",
                                        "XIRR",
                                        "Returns",
                                        // "",
                                    ]}
                                    cellSize={[2, 1, 1, 1, 1, 1, 1, 1, 1]}
                                    rows={transformedData}
                                />
                            ) : roleId > 2 ? (
                                <DataTable
                                    headers={[
                                        "Client Name",
                                        "Client Code",
                                        "Distributor",
                                        "PAN",
                                        "Total Invested",
                                        "Current Value",
                                        "XIRR",
                                        "Returns",
                                        // "",
                                    ]}
                                    cellSize={[3, 1, 1, 1, 1, 1, 1, 1]}
                                    rows={transformedData}
                                />
                            ) : (
                                <DataTable
                                    headers={[
                                        "Client Name",
                                        "Client Code",
                                        "PAN",
                                        "Total Invested",
                                        "Current Value",
                                        "XIRR",
                                        "Returns",
                                        // "",
                                    ]}
                                    cellSize={[3, 2, 1, 1, 1, 1, 1]}
                                    rows={transformedData}
                                />
                            )}
                            {/* </ScrollView> */}
                        </View>
                    ) : (
                        // )
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
            </View>
        </View>
    );
};

export default ClientWiseDataTable;
