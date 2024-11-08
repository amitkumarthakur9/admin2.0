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
import Icon from 'react-native-vector-icons/FontAwesome';
import NoDataAvailable from "../Others/NoDataAvailable";

const SchemeWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AumSchemeWiseData[]>([]);
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

        const response: AumSchemeWise = await RemoteApi.post(
            "aum/scheme/list",
            data
        );

        // const response: AUMResponseInterface = await RemoteApi.post(
        //     "aum/scheme/list",
        //     data
        // );

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
            const response: any = await RemoteApi.get("aum/scheme/schema");
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
                key: "schemeName",
                content: (
                    <View className="w-[99%]">
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
                                    : "NA"}
                            </Text>
                        </Pressable> */}
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.name ? item?.name : "NA"}
                    </Text>
                    </View>
                ),
            },
            {
                key: "category",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                         {item?.category ? item?.category : "NA"}
                    </Text>
                ),
            },
            {
                key: "optiontype",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                         {item?.optionType ? item?.optionType : "NA"}
                    </Text>
                ),
            },
            {
                key: "dividendtype",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.dividendType ? item?.dividendType : "NA"}
                    </Text>
                ),
            },
            {
                key: "totalinvested",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                       {item?.investedValue
                            ? RupeeSymbol + item?.investedValue.toFixed(2)
                            : "NA"}
                    </Text>
                ),
            },
            {
                key: "currentValue",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.currentValue
                            ? RupeeSymbol + item?.currentValue.toFixed(2)
                            : "NA"}
                    </Text>
                ),
            },
            // {
            //     key: "detail",
            //     content: (
            //         <View className="flex w-10/12 justify-center">
            //             <Pressable
            //             onPress={() =>
            //                 router.push('clients/${client.id}')
            //             }
            //         >
            //             <Icon name="ellipsis-v" size={18} color="grey" />
            //         </Pressable>

            //         </View>
                    
            //     ),
            // },
        ];
    });

    return (
        <View className="h-screen">

       
        <View className="bg-white">
            {/* <View className="">
                <TableBreadCrumb name={"Scheme Wise"} />
            </View> */}
            <View className="border-[0.2px]  border-[#e4e4e4]">
            {/* {data.length !== 0 && */}
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="aum-scheme"
                    downloadApi={""}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                />
            {/* } */}

                {!isLoading ? (
                    //  data.length === 0 ? (
                    //     <NoDataAvailable />
                    // ) : (
                    <ScrollView className={"mt-4 z-[-1] "}>
                        <DataTable
                            headers={[
                                "Scheme Name",
                                "Category",
                                "Option Type",
                                "Dividend Type",
                                "Total Invested",
                                "Current Value",
                                // "",
                            ]}
                            cellSize={[3, 1, 1, 1, 2, 2,]}
                            rows={transformedData}
                        />
                    </ScrollView>
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
            {/* {data.length !== 0 && */}
            {/* <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                getDataList={getDataList}
                currentPageNumber={currentPageNumber}
                totalItems={totalItems}
                setCurrentPageNumber={setCurrentPageNumber}
            /> */}
{/* } */}
        </View>

    </View>
    );
};

export default SchemeWiseDataTable;
