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
import NoDataAvailable from "../Others/NoDataAvailable";
import { useUserRole } from "../../context/useRoleContext";

const IFADataTable = () => {
    const { roleId } = useUserRole();
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

    // const dummyData = [
    //     {
    //         id: "1",
    //         name: "EESHAN SHUKLAA",
    //         panNumber: "MALPS3268K",
    //         arn: "ARNS3268K",
    //         euin: "EUINS3268K",
    //         activeAccountCount: 20,
    //         activeSipCount: 37,
    //     },
    // ];

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

        if (response.code == 200 || response.message == "Success") {
            setData(response?.data);
            setTotalItems(response.filterCount);
            setIsLoading(false);
            setTotalPages(
                Math.ceil(
                    (response.filterCount || response.data.length) /
                        itemsPerPage
                )
            );
        } else {
            // setData(dummyData);
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("distributor/schema");
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
                key: "ifaName",
                content: (
                    <View className="flex flex-row items-center justify-start w-full">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(item?.name || "")}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-9/12">
                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12 mb-2">
                                <Pressable
                                    // onPress={() =>
                                    //     router.push(`ifa/${item?.id}`)
                                    // }
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
                        {item?.panNumber || "NA"}
                    </Text>
                ),
            },
            {
                key: "ARN",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.arn || "NA"}
                    </Text>
                ),
            },
            {
                key: "euin",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.euin || "NA"}
                    </Text>
                ),
            },
            {
                key: "activeAccountCount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.activeAccountCount || "NA"}
                    </Text>
                ),
            },
            {
                key: "activeSipCount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.activeSipCount || "NA"}
                    </Text>
                ),
            },
        ];

        // if (roleId > 2) {
        //     itemStructure.splice(2, 0, {
        //         key: "distributor",
        //         content: (
        //             <Text selectable className="text-[#686868] font-semibold">
        //                 {item?.distributor?.name}
        //             </Text>
        //         ),
        //     });
        // }

        if (roleId > 3) {
            itemStructure.splice(2, 0, {
                key: "Manager",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.managementUsers?.[0].name}
                    </Text>
                ),
            });
        }

        return itemStructure;
    });

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb name={"Distributor Reports"} />
            </View>
            <View className="h-screen">
                <>
                    <View className="border-[0.2px]  border-[#e4e4e4]">
                        {/* {data.length !== 0 && ( */}
                            <DynamicFilters
                                appliedSorting={appliedSorting}
                                setAppliedSorting={setAppliedSorting}
                                sorting={sorting}
                                fileName="distributor"
                                downloadApi={""}
                                schemaResponse={filtersSchema}
                                setCurrentPageNumber={setCurrentPageNumber}
                                getList={getDataList}
                                appliedFilers={appliedFilers}
                                setAppliedFilers={setAppliedFilers}
                                // newComponent={<AddNewClient />}
                            />
                        {/* )} */}
                        {!isLoading ? (
                            // data.length === 0 ? (
                            //     <NoDataAvailable />
                            // ) : (
                                <>
                                    <ScrollView className={"mt-4 z-[-1] "}>
                                        {width < 830 ? (
                                            <MobileClientsRows
                                                data={data}
                                                schema={null}
                                            />
                                        ) : roleId > 3 ? (
                                            <DataTable
                                                headers={[
                                                    "Name",
                                                    "PAN No.",
                                                    "Manager",
                                                    "ARN No.",
                                                    "EUIN No.",
                                                    "No. of Clients",
                                                    "Active SIP Count",
                                                ]}
                                                cellSize={[2, 2, 2, 2, 2, 1, 1]}
                                                rows={transformedData}
                                            />
                                        ) : (
                                            <DataTable
                                                headers={[
                                                    "Name",
                                                    "PAN No.",
                                                    "ARN No.",
                                                    "EUIN No.",
                                                    "No. of Clients",
                                                    "Active SIP Count",
                                                ]}
                                                cellSize={[2, 2, 2, 2, 2, 2]}
                                                rows={transformedData}
                                            />
                                        )}
                                    </ScrollView>
                                </>
                            // )
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

export default IFADataTable;
