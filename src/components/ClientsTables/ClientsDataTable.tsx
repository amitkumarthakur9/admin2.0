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
import AddNewClient from "./AddNewClient";
import { useUserRole } from "../../../src/context/useRoleContext";
import NoDataAvailable from "../Others/NoDataAvailable";
import { dateTimeFormat } from "../../../src/helper/DateUtils";

const ClientsDataTable = () => {
    const { roleId } = useUserRole();
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<ClientDataResponse[]>([]);
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

        const response: ApiResponse<ClientDataResponse[]> =
            await RemoteApi.post("client/list", data);

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

            alert("Internal Server Error");
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
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center justify-start w-[99%]">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-[40px] w-[40px]  items-center justify-center flex-wrap ">
                            <Text selectable className="text-white">
                                {getInitials(item?.name)}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-8/12">
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
                            <View className="flex flex-row items-center mt-0 w-1/12">
                                {!item?.kycStatus && <Tag>KYC Not Done</Tag>}
                                <Tag>SIP({item?.activeSip})</Tag>
                                <Tag>Autopay active</Tag>
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "panNumber",
                content: (
                    <View className="w-[99%]">
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.panNumber || "-"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "clientCode",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.clientCode}
                    </Text>
                ),
            },
            {
                key: "doi",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        NA
                    </Text>
                ),
            },
            {
                key: "lastInvestment",
                content: (
                    <View className="flex flex-col flex-wrap w-9/12">
                        <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12 mb-1">
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >

                                {item?.lastInvestment
                                    ? dateTimeFormat(item?.lastInvestment)
                                    : "NA"}

                            </Text>
                        </View>
                        {/* <View className="flex flex-row items-center mt-0">
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >
                                -
                            </Text>
                        </View> */}
                    </View>
                ),
            },
            {
                key: "externalFundDate",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">

                        {item?.externalFundLastUpdatedOn
                            ? dateTimeFormat(item?.externalFundLastUpdatedOn)
                            : "NA"}

                    </Text>
                ),
            },
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
                <TableBreadCrumb name={"Clients"} />
            </View>

            <View className="h-screen">
                <>
                    <View className="border-[0.2px] border-[#e4e4e4]">
                        {/* {data.length !== 0 && ( */}
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
                                                    "PAN No",
                                                    "Distributor",
                                                    "Manager",
                                                    "Client Code",
                                                    "Client DOI",
                                                    "Last Investment",
                                                    "External Fund Update Date",
                                                ]}
                                                cellSize={[
                                                    3, 1, 1, 1, 1, 1, 1, 2,
                                                ]}
                                                rows={transformedData}
                                            />
                                        ) : roleId > 2 ? (
                                            <DataTable
                                                headers={[
                                                    "Name",
                                                    "PAN No",
                                                    "Distributor",
                                                    "Client Code",
                                                    "Client DOI",
                                                    "Last Investment",
                                                    "External Fund Update Date",
                                                ]}
                                                cellSize={[3, 1, 1, 1, 2, 2, 2]}
                                                rows={transformedData}
                                            />
                                        ) : (
                                            <DataTable
                                                headers={[
                                                    "Name",
                                                    "PAN No",
                                                    "Client Code",
                                                    "Client DOI",
                                                    "Last Investment",
                                                    "External Fund Update Date",
                                                ]}
                                                cellSize={[4, 2, 1, 1, 2, 2]}
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
                            totalPages={totalPages}
                            setCurrentPageNumber={setCurrentPageNumber}
                        />
                    {/* )} */}
                </>
            </View>
        </View>
    );
};

export default ClientsDataTable;
