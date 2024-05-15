import * as React from "react";
import { Pressable, TouchableOpacity, View, useWindowDimensions, Text } from "react-native";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    MandateDataInterface,
    MandateResponseInterface,
} from "../../interfaces/MandateResponseInterface";
import RemoteApi from "../../services/RemoteApi";
import { OrdersResponse } from "../../interfaces/OrdersResposeInterface";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { HStack, Heading, Popover, Spinner } from "native-base";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { Card } from "./Card";
import { MandateRows } from "./MandateRows";
import NoDataAvailable from "../Others/NoDataAvailable";
import { RupeeSymbol, getInitials } from "../..//helper/helper";
import { getMandateMessage } from "../..//helper/StatusInfo";
import DataTable from "../DataTable/DataTable";

const MandateDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<MandateDataInterface[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { height, width } = useWindowDimensions();

    // let params = useLocalSearchParams<{ holdingId?: string }>();

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

        // console.log('applyDirectly', applyDirectly);
        // console.log('updatedFilterValues', updatedFilterValues);

        // if (params?.holdingId) {
        //     console.log('params', params);

        //     const checkIfHoldingIdExist = data.filters.find((filter) => filter.key == "holdingId")
        //     if (!checkIfHoldingIdExist) {
        //         console.log('inside---');

        //         data.filters.push({ "key": "holdingId", "operator": "eq", "value": Number(params.holdingId) })
        //     }
        // }

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        const response: MandateResponseInterface = await RemoteApi.post(
            "mandate/list",
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
            const response: any = await RemoteApi.get("mandate/schema");
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

    const transformedData = data?.map((mandate) => {
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row w-[99%] flex-wrap">
                    <View className="flex flex-row items-center w-[99%] justify-between flex-wrap">
                        <View className="flex flex-row items-center justify-start w-[99%] flex-wrap">
                            <Pressable
                                onPress={() =>
                                    router.push(
                                        `/clients/${mandate.id}`
                                    )
                                }
                                className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap"
                            >
                                <Text
                                    selectable
                                    className="text-white"
                                >
                                    {getInitials(
                                        mandate.account.name
                                    )}
                                </Text>
                            </Pressable>
                            <View className="flex flex-col flex-wrap w-[99%]">
                                <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12">
                                    <Text
                                        selectable
                                        className="text-black font-semibold break-all"
                                    >
                                        {mandate.account.name}&nbsp;
                                    </Text>
                                </View>
                                <View className="flex flex-row items-center mt-0">
                                    <Text
                                        selectable
                                        className="text-[#6C6A6A] text-sm"
                                    >
                                        Client code: {mandate.account.clientCode}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                ),
            },
            {
                key: "scheme",
                content: (
                    <View className="flex flex-row w-[99%] items-center justify-start flex-wrap">
                    <View className="flex flex-row flex-wrap w-[99%] items-center justify-start">
                        <Text selectable>
                            {RupeeSymbol + mandate.amount}
                        </Text>
                    </View>
                </View>
                ),
            },
            {
                key: "bankAccount",
                content: (
                    <View className="flex flex-row items-center w-[99%] justify-center flex-wrap">
                    <View className="flex flex-row flex-wrap w-[99%] items-center justify-center">
                        <View className="flex flex-col flex-wrap items-start w-[99%]">
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >
                                Bank Name:{" "}
                                {mandate.bankAccount.bankName}
                            </Text>
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >
                                Branch Name:{" "}
                                {mandate.bankAccount.branchName}
                            </Text>
                            <Text
                                selectable
                                className="text-[#686868] font-semibold"
                            >
                                IFSC Code:{" "}
                                {mandate.bankAccount.ifscCode}
                            </Text>
                        </View>
                    </View>
                </View>
                ),
            },

            {
                key: "mandateStatus",
                content: (
                    <View className="flex flex-row  w-[99%] items-center justify-start">
                                <Popover trigger={triggerProps => {
                                    return <TouchableOpacity {...triggerProps}>
                                        <Icon name="info-circle" size={12} color="black" />
                                    </TouchableOpacity>;
                                }}>
                                    <Popover.Content accessibilityLabel="Order Details" w="56">
                                        <Popover.Arrow />
                                        <Popover.CloseButton />
                                        <Popover.Header>{mandate.mandateStatus.name}</Popover.Header>
                                        <Popover.Body>
                                            <View>
                                                <Text>{getMandateMessage(mandate.mandateStatus.name)}</Text>
                                            </View>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                                <Text
                                    selectable
                                    className="p-1 text-black text-end md:text-center text-xs"
                                >
                                    {mandate.mandateStatus.name}&nbsp;
                                </Text>
                            </View>
                ),
            },
            {
                key: "action",
                content: (
                    <View className="flex flex-row items-center w-[99%] justify-start">
                                {/* <Link
                                href={{
                                    pathname: "/folio/[id]",
                                    params: { id: mandate.id }
                                }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                            </Link> */}
                                <Pressable
                                    onPress={() =>
                                        router.push(`mandates/${mandate.id}`)
                                    }
                                    className="rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-6/12 h-6"
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

       
        return itemStructure;
    });

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb
                    name={"Mandate"}
                    url={"/Mandates"}
                    getDataList={getDataList}
                />
            </View>
            <View className="h-screen">
                
                    <>
                        <View className="border-[0.2px] border-[#e4e4e4]">
                        {/* {data.length !== 0 && */}
                            <DynamicFilters
                                appliedSorting={appliedSorting}
                                setAppliedSorting={setAppliedSorting}
                                sorting={sorting}
                                fileName="Mandate"
                                downloadApi={"mandate/download-report"}
                                schemaResponse={filtersSchema}
                                setCurrentPageNumber={setCurrentPageNumber}
                                getList={getDataList}
                                appliedFilers={appliedFilers}
                                setAppliedFilers={setAppliedFilers}
                            />
                        {/* } */}

                            {!isLoading ? (
                                // data.length === 0 ? (
                                //     <NoDataAvailable />
                                // ) : (
                                <View className={"mt-4 z-[-1] "}>
                                    {width < 830 ? (
                                        <Card data={data} schema={null} />
                                    ) : (
                                        <DataTable
                                            headers={[
                                                "Client",
                                                "Amount",
                                                "Bank Account",
                                                "Mandate Status",
                                                "Action",
                                               
                                            ]}
                                            cellSize={[3,2,4,2,1]}
                                            rows={transformedData}
                                        />
                                    )}
                                </View>
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
                        {data.length !== 0 &&
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            getDataList={getDataList}
                            currentPageNumber={currentPageNumber}
                            totalPages={totalPages}
                            setCurrentPageNumber={setCurrentPageNumber}
                        />
}
                    </>
            
            </View>
        </View>
    );
};

export default MandateDataTable;
