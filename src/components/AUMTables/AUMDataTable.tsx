import * as React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
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

const AUMDataTable = () => {
    const roles: number = roldID();
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = useState<AccountItem[]>([]);

    const { width } = useWindowDimensions();

    const AUMCard = ({ data }) => {
        const [selectedTab, setSelectedTab] = useState(1);

        const handleTabPress = (tab) => {
            setSelectedTab(tab);
        };

        const tabContent = useMemo(() => {
            const baseTabs = [
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

            return baseTabs;
        }, [roles]);

        // Memoize each tab's content to avoid unnecessary re-renders
        const renderTabContent = useMemo(() => {
            return tabContent[selectedTab - 1]?.content;
        }, [selectedTab, tabContent]);

        const AUMCardWithTabs = ({
            selectedTab,
            handleTabPress,
            tabContent,
            tabscount = 3,
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

            return (
                <View className="flex-1 bg-white rounded shadow h-full overflow-auto w-full">
                    <View className="">
                        <View className="w-[99%]">
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal={true} // Set horizontal to true for horizontal scrolling
                                showsHorizontalScrollIndicator={true} // Show the horizontal scrollbar
                                className="flex flex-row pb-2"
                            >
                                {tabContent?.map((tab, index) => {
                                    return (
                                        <Pressable
                                            key={index}
                                            onPress={() =>
                                                handleTabPress(index + 1)
                                            }
                                            className={`w-3/12 py-4 px-6 flex h-12 flex-row justify-center items-center border-b-2 ${
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
                                    );
                                })}
                            </ScrollView>
                        </View>
                        {/* <View>{renderTabContent()}</View> */}
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
                    name={"AUM Reports"}
                    icon={require("../../../assets/aumReport.png")}
                />
            </View>
            <View className="border-[0.2px]  border-[#e4e4e4]">
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
        </View>
    );
};

export default AUMDataTable;
