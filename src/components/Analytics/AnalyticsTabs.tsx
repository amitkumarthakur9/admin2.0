import * as React from "react";
import { useEffect, useState, useRef } from "react";
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
    Icon,
    Spinner,
    WarningIcon,
    Button,
    ArrowForwardIcon,
} from "native-base";

import RemoteApi from "../../services/RemoteApi";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import DataGrid from "../DataGrid/DataGrid";
import CardWithTabs from "../Card/CardWithTabs";
import { useStorageState } from "../../services/useStorageState";
import { jwtDecode } from "jwt-decode";
import MutualSipAnalytics from "./MutualSipAnalytics";
import LumpsumAnalytics from "./LumpsumAnalytics";
import MutualSipTab from "./MutualSipTab";
import MutualSipTable from "./MutualSipTable";
import MutualLumpsumTab from "./MutualLumpsumTab";
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

const AnalyticsTabs = () => {
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
                key: "MutualSipAnalytics",
                name: "SIP",
                content: <MutualSipTab />,
            },
            {
                key: "MutualLumpsumAnalytics",
                name: "Lumpsum",
                content: <MutualLumpsumTab />,
            },
        ];

        const AUMCardWithTabs = ({
            selectedTab,
            handleTabPress,
            tabContent,
            tabscount = 2,
        }) => {
            const scrollViewRef = useRef(null);
            const { width: windowWidth } = useWindowDimensions();

            useEffect(() => {
                if (scrollViewRef.current) {
                    const tabWidth = windowWidth / 5; // Adjust based on the number of tabs
                    const xOffset =
                        (selectedTab - 1) * tabWidth -
                        (windowWidth - tabWidth) / 2;
                    scrollViewRef.current.scrollTo({
                        x: xOffset,
                        animated: true,
                    });
                }
            }, [selectedTab]);

            const tabWidth = windowWidth / tabscount;
            console.log("tabWidth");
            console.log(tabWidth);

            return (
                <View className="flex-1 bg-white rounded h-full">
                    <View className="w-full flex flex-row">
                        {tabContent?.map((tab, index) => {
                            return (
                                <View className="w-1/2">
                                    <Pressable
                                        key={index}
                                        onPress={() =>
                                            handleTabPress(index + 1)
                                        }
                                        className={`py-4 px-6 flex h-12 flex-row justify-center items-center border-b-2 ${
                                            selectedTab === index + 1
                                                ? "border-[#114EA8]"
                                                : "border-b-gray-100"
                                        }`}
                                    >
                                        <Text
                                            className={`font-bold ${
                                                selectedTab === index + 1
                                                    ? "text-[#114EA8]"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {tab?.name}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>

                    <View className="w-full h-full">
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
                <TableBreadCrumb
                    name={"Analytics"}
                    icon={require("../../../assets/aumReport.png")}
                />
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
                    // <ScrollView className={"mt-0 z-[-1] "}>
                    <View className="w-12/12 h-full rounded">
                        <AUMCard data={data} />
                    </View>
                ) : (
                    // </ScrollView>
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

export default AnalyticsTabs;
