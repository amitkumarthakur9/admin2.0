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

const ClientWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AccountItem[]>([]);
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

        const response: AccountsResponse = await RemoteApi.post(
            "client/list",
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
            const response: any = await RemoteApi.get("client/schema");
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
        return [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center justify-center w-11/12">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(item?.name)}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-9/12">
                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12 mb-2">
                                <Pressable
                                    onPress={() =>
                                        router.push(`clients/${item?.id}`)
                                    }
                                >
                                    <Text
                                        selectable
                                        className="flex flex-row text-black font-semibold break-all"
                                    >
                                        {item?.name}&nbsp;{" "}
                                    </Text>
                                </Pressable>

                                <View className="flex flex-row items-center">
                                    {item?.isActive ? (
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
                            </View>
                            <View className="flex flex-row items-center mt-0">
                                <Tag>
                                    KYC{" "}
                                    {item?.users[0]?.kycStatus
                                        ?.isAllowedToTransact
                                        ? "Done"
                                        : "Not Done"}
                                </Tag>
                                <Tag>SIP(N/A)</Tag>
                                <Tag>Autopay active</Tag>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "clientcode",
                content: (
                    <Text selectable className="text-[#686868] font-semibold w-11/12">
                        XCVV567
                    </Text>
                ),
            },
            {
                key: "panNumber",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        7383e9GH
                    </Text>
                ),
            },
            {
                key: "totalinvested",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {RupeeSymbol + "2300"}
                    </Text>
                ),
            },
            {
                key: "CurrentValue",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {RupeeSymbol + "2200"}
                    </Text>
                ),
            },
            {
                key: "XIRR",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        20.87%
                    </Text>
                ),
            },
            {
                key: "returns",
                content: (
                    <View className="flex flex-row justify-center text-[#686868] font-semibold w-11/12 " >
                        <Text selectable className="text-[#686868] font-semibold w-11/12">
                            19
                        </Text>
                    </View>
                ),
            },
            {
                key: "detail",
                content: (
                    <View className="flex flex-row w-10/12 justify-center">
                        <Pressable
                            onPress={() =>
                                router.push('clients/${client.id}')
                            }
                        >
                            <Icon name="ellipsis-v" size={18} color="grey" />
                        </Pressable>
                    </View>

                ),
            },
        ];
    });

    return (
        <View className="bg-white">
            {/* <View className="">
                <TableBreadCrumb name={"Client Wise"} />
            </View> */}
            <View className="border-[0.2px]  border-[#e4e4e4]">
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="Clients"
                    downloadApi={"client/download-report"}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                />

                {!isLoading ? (
                    <ScrollView className={"mt-4 z-[-1] "}>
                        <DataTable
                            headers={[
                                "Client Name",
                                "Client Code",
                                "PAN",
                                "Total Invested",
                                "Current Value",
                                "XIRR",
                                "Returns",
                                "",
                            ]}
                            cellSize={[4, 1, 1, 1, 1, 1, 1, 1]}
                            rows={transformedData}
                        />
                    </ScrollView>
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
        </View>
    );
};

export default ClientWiseDataTable;
