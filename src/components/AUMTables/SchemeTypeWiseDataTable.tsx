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

const SchemeTypeWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<SchemeTypeWiseData[]>([]);
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

        const response: SchemeTypeWise = await RemoteApi.post(
            "aum/scheme-category/list",
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
                key: "schemeType",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.name ? item?.name : "Equity" }
                    </Text>
                ),
            },
            {
                key: "currentAmount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        
                        {item?.currentValue ? RupeeSymbol + item?.currentValue.toFixed(2) : RupeeSymbol + "2600" }
                    </Text>
                ),
            },
            {
                key: "investedAmount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                                                {item?.investedValue ? RupeeSymbol + item?.investedValue.toFixed(2) : RupeeSymbol + "2500" }

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
                
            {/* {data.length !== 0 &&
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="Clients"
                    downloadApi={"client/download-report"}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList=""
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                />
            } */}

                {!isLoading ? (
                    data.length === 0 ? (
                        <NoDataAvailable />
                    ) : (
                    <ScrollView className={"mt-4 z-[-1] "}>
                        <DataTable
                            headers={[
                                "Category",
                                "Current Amount",
                                "Invested Amount",
                                // "",
                            ]}
                            cellSize={[4, 4, 4,]}
                            rows={transformedData}
                        />
                    </ScrollView>
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
                totalItems={totalItems}
                setCurrentPageNumber={setCurrentPageNumber}
            /> */}
        </View>
        
        </View>
    );
};

export default SchemeTypeWiseDataTable;
