// App.js
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import MutualSipAccordion from "./MutualSipAccordion";
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
import {
    MutualSIPAnalytics,
    SIPData,
} from "src/interfaces/MutualSIPanalyticsInterface";

const MutualSipTab = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<SIPData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([
        {
            key: "",
            operator: "",
            value: [""],
        },
    ]);
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
            // page: currentPageNumber,
            // limit: itemsPerPage,
            filters: applyDirectly ? updatedFilterValues : appliedFilers,
        };

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        // data = {
        //     startDate: "2024-01-01",
        //     endDate: "2024-12-31",
        // };

        try {
            const response: MutualSIPAnalytics = await RemoteApi.post(
                "mutualfund-analytics/sip/",
                data
            );

            if (response?.message == "Success") {
                setData(response?.data);
                // setItemsPerPage(response.count)
                // setTotalItems(response.filterCount);
                setIsLoading(false);
                // setTotalPages(
                //     Math.ceil(
                //         (response.filterCount || response.data.length) /
                //             itemsPerPage
                //     )
                // );

                console.log(response.data);
            } else {
                setIsLoading(false);

                // alert("Internal Server Error");
            }
        } catch (error) {
            alert(error);
        }
    }

    async function getSchema() {
        const response: any = await RemoteApi.get(
            "mutualfund-analytics/sip/schema"
        );
        setFiltersSchema(response);
        // setSorting(response.sort);
        console.log("getshema");
    }

    React.useEffect(() => {
        getSchema();
        getDataList(
            [
                {
                    key: "createdAt",
                    operator: "between",
                    value: ["2024-01-01", "2024-12-31"],
                },
            ],
            true
        );
    }, []);

    // React.useEffect(() => {
    //     if (
    //         (appliedSorting.direction != "" && appliedSorting.key != "") ||
    //         (appliedSorting.direction == "" && appliedSorting.key == "")
    //     ) {
    //         getDataList();
    //     }
    // }, [appliedSorting]);

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

                    {!isLoading ? (
                        <View className={"mt-4 z-[-1] min-h-[500]"}>
                            {data.length == 0  ? (
                                <>
                                    <NoDataAvailable
                                        message="Select date from filter to get
                                            required data."
                                            height="200px"
                                    />
                                </>
                            ) : (
                                <MutualSipAccordion
                                    data={data}
                                    appliedFilers={appliedFilers}
                                />
                            )}
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
                {/* <Pagination
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    getDataList={getDataList}
                    currentPageNumber={currentPageNumber}
                    totalItems={totalItems}
                    setCurrentPageNumber={setCurrentPageNumber}
                /> */}
                {/* )} */}
            </View>
        </View>
    );
};

export default MutualSipTab;
