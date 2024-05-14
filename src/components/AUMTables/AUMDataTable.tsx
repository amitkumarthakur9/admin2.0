import * as React from "react";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
    TouchableOpacity,
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
import DataGrid from "../DataGrid/DataGrid";
import HorizontalStackedBarChart from "../Chart/HorizontalBarChart";
import FolioWiseDataTable from "./FolioWiseDataTable";
import ClientWiseDataTable from "./ClientWiseDataTable";
import SchemeWiseDataTable from "./SchemeWiseDataTable";
import AMCWiseDataTable from "./AMCWiseDataTable";
import RTAWiseDataTable from "./RTAWiseDataTable";
import IFAWiseDataTable from "./IFAWiseDataTable";
import RMWiseDataTable from "./RMWiseDataTable";
import HoldingWiseDataTable from "./HoldingWiseDataTable";
import SchemeTypeWiseDataTable from "./SchemeTypeWiseDataTable";
import CardWithTabs from "../Card/CardWithTabs";
import { useStorageState } from "../../services/useStorageState";
import { jwtDecode } from "jwt-decode";
const roldID = () => {
    const [[isLoading, token], setToken] = useStorageState("token");
    // const [roleId, setroleID] = useState(null);
    // useEffect(() => {

    if (token) {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        // setroleID(decoded.roleId);
        console.log(decoded.roleId);
        return decoded.roleId;
    }
};

const AUMDataTable = (role) => {
    // console.log("role");
    // console.log(role);
    // const [[isLoading, token], setToken] = useStorageState("token");

    const roles: number = roldID();

    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AccountItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();

    // async function getDataList(
    //     updatedFilterValues = [],
    //     applyDirectly = false
    // ) {
    //     setIsLoading(true);
    //     let data: any = {
    //         page: currentPageNumber,
    //         limit: itemsPerPage,
    //         filters: applyDirectly ? updatedFilterValues : appliedFilers,
    //     };

    //     if (appliedSorting.key != "") {
    //         data.orderBy = appliedSorting;
    //     }

    //     const response: AccountsResponse = await RemoteApi.post(
    //         "client/list",
    //         data
    //     );

    //     if (response.code == 200) {
    //         setData(response.data);
    //         // setItemsPerPage(response.count)
    //         setTotalItems(response.filterCount);
    //         setIsLoading(false);
    //         setTotalPages(
    //             Math.ceil(
    //                 (response.filterCount || response.data.length) /
    //                     itemsPerPage
    //             )
    //         );
    //     }else{
    //         setIsLoading(false);

    //         alert("Internal Server Error");
    //     }
    // }

    // React.useEffect(() => {
    //     async function getSchema() {
    //         const response: any = await RemoteApi.get("client/schema");
    //         setFiltersSchema(response);
    //         setSorting(response.sort);
    //     }
    //     getSchema();
    // }, []);

    // React.useEffect(() => {
    //     if (
    //         (appliedSorting.direction != "" && appliedSorting.key != "") ||
    //         (appliedSorting.direction == "" && appliedSorting.key == "")
    //     ) {
    //         getDataList();
    //     }
    // }, [appliedSorting]);

    const AUMCard = ({ data }) => {
        const [selectedTab, setSelectedTab] = useState(1);

        const handleTabPress = (tab) => {
            setSelectedTab(tab);
        };

        const assetBifurcation = [
            { label: "Equity", value: 20 },
            { label: "Hybrid", value: 20 },
            { label: "Debt", value: 20 },
            { label: "Others", value: 40 },
        ];

        const assetBifurcationColors = [
            "#715CFA",
            "#69E1AB",
            "#39C3E2",
            "#FA8B5C",
        ];

        const tabContent = [
            {
                key: "client-wise",
                name: "Client Wise",
                content: <ClientWiseDataTable />,
            },
            {
                key: "holding-wise",
                name: "Holding Wise",
                content: <HoldingWiseDataTable />,
            },
            {
                key: "folio-wise",
                name: "Folio Wise",
                content: <FolioWiseDataTable />,
            },
            {
                key: "amc-wise",
                name: "AMC Wise",
                content: <AMCWiseDataTable />,
            },
            {
                key: "scheme-wise",
                name: "Scheme Wise",
                content: <SchemeWiseDataTable />,
            },
            {
                key: "category",
                name: "Category",
                content: <SchemeTypeWiseDataTable />,
            },
            {
                key: "rta-wise",
                name: "RTA Wise",
                content: <RTAWiseDataTable />,
            },
            // {
            //     key: "ifa-wise",
            //     name: "IFA Wise",
            //     content: <IFAWiseDataTable />,
            // },
            // {
            //     key: "rm-wise",
            //     name: "RM Wise",
            //     content: <RMWiseDataTable />,
            // },
        ];
        console.log("aumrole");

        console.log(roles);

        if (roles == 3 || roles == 4) {
            tabContent.push({
                key: "ifa-wise",
                name: "IFA Wise",
                content: <IFAWiseDataTable />,
            });
        }

        if (roles == 4) {
            tabContent.push({
                key: "rm-wise",
                name: "RM Wise",
                content: <RMWiseDataTable />,
            });
        }

        const AUMCardWithTabs = ({
            selectedTab,
            handleTabPress,
            tabContent,
            tabscount = 3,
        }) => {
            return (
                <View className="flex-1 bg-white rounded shadow h-full overflow-auto w-full">
                    <View>
                        {/* <View className="w-full flex flex-row mb-2 overflow-scroll ">
                         */}
                        <ScrollView
                            horizontal={true} // Set horizontal to true for horizontal scrolling
                            showsHorizontalScrollIndicator={true} // Hide the horizontal scrollbar
                            //   invertStickyHeaders={true}
                            className="flex flex-row"
                        >
                            {tabContent?.map((tab, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() =>
                                            handleTabPress(index + 1)
                                        }
                                        className={`w-[20%] py-4 px-6 flex flex-row justify-center items-center border-b-2 ${
                                            selectedTab === index + 1
                                                ? "border-black bg-gray-800"
                                                : "border-b-gray-100 bg-white"
                                        }`}
                                    >
                                        <Text
                                            className={`font-bold ${
                                                selectedTab === index + 1
                                                    ? "text-white"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {tab?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            {/* </View>
                             */}
                        </ScrollView>

                        {tabContent[selectedTab - 1]?.content}
                    </View>
                </View>
            );
        };

        return (
            <View className="overflow-auto">
                {/* <View className="w-full"> */}

                <AUMCardWithTabs
                    key="aum-tables"
                    selectedTab={selectedTab}
                    handleTabPress={handleTabPress}
                    tabContent={tabContent}
                />
                {/* </View> */}
            </View>
        );
    };

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb name={"AUM Reports"} />
            </View>
            <View className="border-[0.2px]  border-[#e4e4e4]">
                {/* <DynamicFilters
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
                /> */}

                {!isLoading ? (
                    <ScrollView className={"mt-0 z-[-1] "}>
                        <View className="w-12/12 h-full rounded">
                            <AUMCard data={data} />
                        </View>
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

            {/* <Pagination
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                getDataList={getDataList}
                currentPageNumber={currentPageNumber}
                totalPages={totalPages}
                setCurrentPageNumber={setCurrentPageNumber}
            /> */}
        </View>
    );
};

export default AUMDataTable;
