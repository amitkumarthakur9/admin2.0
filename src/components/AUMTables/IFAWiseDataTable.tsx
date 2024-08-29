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
import { useUserRole } from "../../context/useRoleContext";

const IFAWiseDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<IFAwiseData[]>([]);
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

        const response: IFAwise = await RemoteApi.post(
            "aum/distributor/list",
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
            const response: any = await RemoteApi.get("aum/distributor/schema");
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
        const itemStructure =  [
            {
                key: "ifa",
                content: (
                    <View>
                        {/* <Pressable
                            onPress={() =>
                                router.push(`clients/${item?.mutualfund?.id}`)
                            }
                        >
                            <Text
                                selectable
                                className="flex flex-row text-black font-semibold break-all"
                            >
                                {item?.name
                                    ? item?.name
                                    : "-"}
                            </Text>
                        </Pressable> */}
                        <Text selectable className="text-[#686868] font-semibold">
                        {item?.name ? item?.name : "-"}
                    </Text>

                    </View>
                    
                ),
            },
            {
                key: "totalInvested",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.investedValue
                            ? RupeeSymbol + item?.investedValue.toFixed(2)
                            : "-"}
                    </Text>
                ),
            },
            {
                key: "currentValue",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.currentValue
                            ? RupeeSymbol + item?.currentValue.toFixed(2)
                            : "-"}
                    </Text>
                ),
            },
            // {
            //     key: "detail",
            //     content: (
            //         <View className="flex w-10/12 justify-center">
            //             <Pressable
            //                 onPress={() => router.push("clients/${client.id}")}
            //             >
            //                 <Icon name="ellipsis-v" size={18} color="grey" />
            //             </Pressable>
            //         </View>
            //     ),
            // },
        ];

        if (roleId > 3) {
            itemStructure.splice(1, 0, {
                key: "Manager",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.managementUserName}
                       
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
                <TableBreadCrumb name={"Scheme Wise"} />
            </View> */}
            <View className="border-[0.2px]  border-[#e4e4e4]">
            {/* {data.length !== 0 && */}
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
            {/* } */}
                {!isLoading ? (
                    // data.length === 0 ? (
                    //     <NoDataAvailable />
                    // ) : (

                        <ScrollView className={"mt-4 z-[-1] "}>
                            {roleId > 3 
                                ? 

                                <DataTable
                            headers={[
                                "IFA Name",
                                "Manager",
                                "Total Invested",
                                "Current Value",
                                // "",
                            ]}
                            cellSize={[3, 2,3, 3,]}
                            rows={transformedData}
                        />
                                 
                                
                                :<DataTable
                                headers={[
                                    "IFA Name",
                                    "Total Invested",
                                    "Current Value",
                                    // "",
                                ]}
                                cellSize={[3, 3, 3,]}
                                rows={transformedData}
                            />
                            }
                        
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
            <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                getDataList={getDataList}
                currentPageNumber={currentPageNumber}
                totalPages={totalPages}
                setCurrentPageNumber={setCurrentPageNumber}
            />
{/* } */}
        </View>
         
        </View>
    );
};

export default IFAWiseDataTable;
