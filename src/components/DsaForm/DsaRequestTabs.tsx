import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { HStack, Heading, Spinner } from "native-base";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import DsaAllRequestTable from "./DsaAllRequestTable";
import DsaApprovedRequestTable from "./DsaApprovedRequestTable";
import DsaRejectRequestTable from "./DsaRejectRequestTable";

const DsaRequestTabs = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const AUMCard = () => {
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
                key: "AllRequest",
                name: "All Request",
                content: <DsaAllRequestTable />,
            },
            {
                key: "Approved",
                name: "Approved",
                content: <DsaApprovedRequestTable />,
            },
            {
                key: "Rejected",
                name: "Rejected",
                content: <DsaRejectRequestTable />,
            },
        ];

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
                                        <View className="w-1/3" style={{width: "400px"}}>
                                            <Pressable
                                                key={index}
                                                onPress={() =>
                                                    handleTabPress(index + 1)
                                                }
                                                className={` py-4 px-6 flex h-12 flex-row justify-center items-center border-b-2 ${
                                                    selectedTab === index + 1
                                                        ? "border-[#114EA8]"
                                                        : "border-b-gray-100"
                                                }`}
                                            >
                                                <Text
                                                    className={`font-bold ${
                                                        selectedTab ===
                                                        index + 1
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
                            </ScrollView>
                        </View>

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
                    name={"DSA Requests"}
                    icon={require("../../../assets/aumReport.png")}
                />
            </View>
            <View className="border-[0.2px]  border-[#e4e4e4]">
                {!isLoading ? (
                    // <ScrollView className={"mt-0 z-[-1] "}>
                    <View className="w-12/12 h-full rounded">
                        <AUMCard />
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

export default DsaRequestTabs;
