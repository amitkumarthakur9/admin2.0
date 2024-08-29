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
import Icon from "react-native-vector-icons/FontAwesome";
import NoDataAvailable from "../Others/NoDataAvailable";

const AMCWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<FundhouseWiseData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);

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

        // const response: AUMResponseInterface = await RemoteApi.post(
        //     "client/list",
        //     data
        // );

        const response: FundhouseWise = await RemoteApi.post(
            "aum/fundhouse/list",
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

    console.log(data);

    const downloadReport = async () => {
        setIsDownloadProcessing(true);
        let data: any = { filters: appliedFilers };

        if (appliedSorting.key != "") {
            data["orderBy"] = appliedSorting;
        }

        const response: any = await RemoteApi.downloadFile({
            endpoint: downloadApi,
            fileName: fileName,
            data: data,
        });
        setIsDownloadProcessing(false);
    };

    const transformedData = data?.map((item) => {
        return [
            {
                key: "fundhouse",
                content: (
                    <View className="flex flex-row justify-center ">
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            {item?.name ? item?.name : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "investedAmount",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.investedValue
                            ? RupeeSymbol + item?.investedValue.toFixed(2)
                            : "NA"}
                    </Text>
                ),
            },
            {
                key: "currentAmount",
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
            {/* <View className="flex flex-row justify-end items-end py-2 lg:mt-0">
                    <Pressable
                        onPress={downloadReport}
                        className={
                            "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                        }
                        accessibilityLabel="Download"
                    >
                        {isDownloadProcessing ? (
                            <Spinner
                                color={"black"}
                                size={14}
                                accessibilityLabel="Loading"
                            />
                        ) : (
                            <Icon name="download" size={14} color="#484848" />
                        )}
                        {<Text className="mx-2">Download</Text>}
                    </Pressable>
                </View> */}
            <View className="border-[0.2px]  border-[#e4e4e4]">
                {/* <DynamicFilters
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
                /> */}
                

                {!isLoading ? (
                    data.length === 0 ? (
                        <NoDataAvailable />
                    ) : (
                    <ScrollView className={"mt-4 z-[-1] "}>
                        
                        <DataTable
                            headers={[
                                "Fund House",
                                "Invested Amount",
                                "Current Value",
                                // "",
                            ]}
                            cellSize={[3, 3, 3]}
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
                totalPages={totalPages}
                setCurrentPageNumber={setCurrentPageNumber}
            /> */}
        </View>
         
        </View>
    );
};

export default AMCWiseDataTable;
