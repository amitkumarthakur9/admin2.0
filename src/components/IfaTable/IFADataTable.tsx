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
import { MobileClientsRows } from "./MobileClientsRows";
import { getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import {
    IfaListResponse,
    Investor,
} from "../../interfaces/IfaResponseInterface";

const IFADataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<Investor[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();

    const dummyData = [
        {
            id: "1",
            name: "EESHAN SHUKLAA",
            panNumber: "MALPS3268K",
            arn: "ARNS3268K",
            euin: "EUINS3268K",
            activeAccountCount: 20,
            activeSipCount: 37,
        },
    ];

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

        const response: IfaListResponse = await RemoteApi.post(
            "distributor/list",
            data
        );

        if (response.code == 200) {
            setData(response?.data);

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
            setData(dummyData);
            setIsLoading(false);
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
                key: "ifaName",
                content: (
                    <View className="flex flex-row items-center justify-start w-full">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(item?.name || "Harsh Mundra")}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-9/12">
                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12 mb-2">
                                <Pressable
                                    onPress={() =>
                                        router.push(`ifa/${item?.id}`)
                                    }
                                >
                                    <Text
                                        selectable
                                        className="flex flex-row text-black font-semibold break-all"
                                    >
                                        {item?.name}&nbsp;{" "}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "panNumber",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.panNumber || "-"}
                    </Text>
                ),
            },
            {
                key: "ARN",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.arn || "-"}
                    </Text>
                ),
            },
            {
                key: "euin",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.euin || "-"}
                    </Text>
                ),
            },
            {
                key: "activeAccountCount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.activeAccountCount || "-"}
                    </Text>
                ),
            },
            {
                key: "activeSipCount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.activeSipCount || "-"}
                    </Text>
                ),
            },
        ];
    });

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb name={"IFA Report"} />
            </View>
            <View className="border-[0.2px]  border-[#e4e4e4]">
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="IFA"
                    downloadApi={"ifa/download-report"}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                    // newComponent={<AddNewClient />}
                />

                {!isLoading ? (
                    <ScrollView className={"mt-4 z-[-1] "}>
                        {width < 830 ? (
                            <MobileClientsRows data={data} schema={null} />
                        ) : (
                            <DataTable
                                headers={[
                                    "Name",
                                    "PAN No.",
                                    "ARN No.",
                                    "EUIN No.",
                                    "Active Account Count",
                                    "Active SIP Count",
                                ]}
                                cellSize={[2, 2, 2, 2, 2, 2]}
                                rows={transformedData}
                            />
                        )}
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

export default IFADataTable;