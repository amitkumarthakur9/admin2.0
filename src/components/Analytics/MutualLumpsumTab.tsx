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
import MutualLumpsumAccordion from "./MutualLumpsumAccordion";

// RM Name
// Lumpsum Amount
// Lumpsum Count
// Redemption Amount
// Redemption Count
// CAMS Transfer-in Amount
// CAMS Transfer-in Count
// Switch in Amount
// Switch in Count
// Switch out Amount
// Switch out Count
// SIP Amount
// SIP Count

const MutualLumpsumTab = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<ClientWiseData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([
        {
            key: "createdAt",
            operator: "between",
            value: ["2024-01-01", "2024-12-31"],
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

        try {
            const response: ClientWiseResponse = await RemoteApi.post(
                "mutualfund-analytics/transaction/",
                data
            );

            if (response.message == "Success") {
                setData(response.data);
                // setItemsPerPage(response.count)
                // setTotalItems(response.filterCount);
                setIsLoading(false);
                // setTotalPages(
                //     Math.ceil(
                //         (response.filterCount || response.data.length) /
                //             itemsPerPage
                //     )
                // );
            } else {
                setIsLoading(false);

                // alert("Internal Server Error");
            }
        } catch (error) {
            alert(error);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get(
                "mutualfund-analytics/transaction/schema"
            );
            setFiltersSchema(response);
            // setSorting(response.sort);
        }
        getSchema();
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
                            <MutualLumpsumAccordion
                                data={data}
                                appliedFilers={appliedFilers}
                            />
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
                    totalPages={totalPages}
                    setCurrentPageNumber={setCurrentPageNumber}
                /> */}
                {/* )} */}
            </View>
        </View>
    );
};

export default MutualLumpsumTab;
