import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    Center,
    HStack,
    Heading,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    Menu,
    HamburgerIcon,
    Box,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import IconCard from "../Card/IconCard";
import AvatarCard from "../Card/AvatarCard";
import { RupeeSymbol } from "../../../src/helper/helper";
import BorderCard from "../Card/BorderCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DonutPieChart from "../Chart/DonutPieChart";
import DynamicMenu from "./DynamicMenu";
import { AUMDetailResponseInterface } from "src/interfaces/AUMDetailResponseInterface";
import {
    DashboardData,
    DashboardResponse,
} from "../../../src/interfaces/DashboardInterface";
import RemoteApi from "../../../src/services/RemoteApi";

const IFADashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [receivedData1, setReceivedData1] = useState(null);
    const [receivedData2, setReceivedData2] = useState(null);
    const [data, setData] = useState<DashboardData>();
    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: DashboardResponse = await RemoteApi.get(
                `dashboard/?d=2`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            }
        }

        getDetails();
    }, []);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        // Here you can trigger your API call using the selected option
        // Example: fetch(`your-api-endpoint/${option}`)
        // Add your API call logic here
        console.log(`API call triggered with option: ${option}`);
    };

    const handleDataReceived = (data) => {
        // Handle the received data here
        console.log("Data received:", data);
    };

    const handleDataReceived1 = (data) => {
        // Handle the received data here, such as updating state in the parent component
        setReceivedData1(data);
        console.log("Data received from notification:", data);
    };

    const handleDataReceived2 = (data) => {
        // Handle the received data here, such as updating state in the parent component
        setReceivedData2(data);
        console.log("Data received from YourComponent2:", data);
    };

    const notificationData = [
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
        },
    ];

    const topClientData = [
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
        {
            imageUrl: "account",
            title: "Rohan Invested in Axis Mutual Fund",
            description: "Just Now",
            sip: "14",
            investment: "1,86,564",
        },
    ];

    const sipBreakdownChart = data?.order?.sip?.breakDown.map((item) => ({
        x: item.category,
        y: item.count,
    }));

    console.log(sipBreakdownChart);

    const aumBreakdownChart = data?.aum?.breakDown.map((item) => ({
        x: item.category,
        y: item.currentValue,
    }));

    console.log(sipBreakdownChart);

    const breakDown = [
        {
            "category": "Debt",
            "currentValue": 2154.6
        },
        {
            "category": "Equity",
            "currentValue": 1814.1522999999997
        }
    ];
    
    // Step 1: Calculate the total value of all categories
    const totalValue = breakDown.reduce((total, category) => total + category.currentValue, 0);
    
    // Step 2: Calculate the percentage of each category
    const categoryPercentages = breakDown.map(category => ({
        category: category.category,
        percentage: (category.currentValue / totalValue) * 100
    }));
    
    console.log(categoryPercentages);
    

    return (
        <>
            {isLoading ? (
                <Center>
                    <HStack
                        space={2}
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
                </Center>
            ) : (
                <ScrollView
                    className={`bg-white`}
                    showsVerticalScrollIndicator={true}
                >
                    <View className="bg-[#eaf3fe]">
                        <View className="flex flex-col p-4 gap-4">
                            <View className="flex flex-row items-center">
                                <Pressable
                                    className="mr-3"
                                    onPress={() => router.push("/clients")}
                                >
                                    <Icon
                                        name="angle-left"
                                        size={18}
                                        color={"black"}
                                    />
                                </Pressable>
                                <Text
                                    selectable
                                    className="text-base flex flex-row text-center font-bold"
                                >
                                    IFA Dashboard
                                </Text>
                            </View>

                            <View className="flex flex-row justify-between rounded bg-[#eaf3fe] pr-2">
                                <View className=" flex flex-row w-full gap-2">
                                    {" "}
                                    {/* outer Card */}
                                    <View className="flex flex-col w-8/12 rounded bg-[#eaf3fe] h-auto ">
                                        <View className="flex flex-row rounded  bg-[#eaf3fe] flex-wrap w-[99.5%] gap-1 justify-between pb-2">
                                            <View className="flex flex-col w-[32%]  rounded bg-[#0769D0] h-auto items-between gap-2">
                                                <Text className="text-[#D2CFCF]">
                                                    Total Aum
                                                </Text>
                                                <Text className="text-white font-bold text-[36px]">
                                                    {data?.aum?.total
                                                        ? RupeeSymbol +
                                                          data?.aum?.total.toFixed(
                                                              2
                                                          )
                                                        : RupeeSymbol + "0"}
                                                </Text>
                                                <Text className="text-[#00AC4F] text-xs inline-block align-text-bottom text-right">
                                                    <MaterialCommunityIcons
                                                        name="arrow-up"
                                                        size={14}
                                                        color="#00AC4F"
                                                    />
                                                    37.8%{" "}
                                                    <Text className="text-white">
                                                        this month
                                                    </Text>{" "}
                                                </Text>
                                            </View>
                                            <View className="flex flex-row w-[66%] rounded bg-white h-auto gap-2">
                                                <View className="flex flex-col w-6/12  rounded bg-white h-auto gap-1">
                                                    <IconCard
                                                        icon="account-outline"
                                                        title="Number of Clients"
                                                        description={
                                                            data?.clientCount
                                                        }
                                                    />
                                                    <IconCard
                                                        icon="chart-timeline-variant"
                                                        title="Total Running SIPs"
                                                        description={
                                                            data?.order?.sip
                                                                ?.sipCount
                                                        }
                                                    />
                                                </View>
                                                <View className="flex flex-col w-5/12  rounded bg-white h-auto gap-1">
                                                    <IconCard
                                                        icon="wallet-outline"
                                                        title="Total Lumpsun Investment"
                                                        description={
                                                            data?.order?.lumpsum
                                                                ?.total
                                                                ? RupeeSymbol +
                                                                  data?.order?.lumpsum?.total.toFixed(
                                                                      2
                                                                  )
                                                                : RupeeSymbol +
                                                                  "0"
                                                        }
                                                    />
                                                    <IconCard
                                                        icon="shopping-outline"
                                                        title="Total SIP Amount"
                                                        description={
                                                            RupeeSymbol +
                                                            "25,00,000"
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        <View className="flex flex-row rounded bg-white w-[99%]">
                                            <View
                                                className="w-[50%]  rounded bg-white p-4"
                                                style={{
                                                    borderColor: "#e4e4e4",

                                                    borderRightWidth:
                                                        StyleSheet.hairlineWidth,
                                                }}
                                            >
                                                <View className="flex flex-col justify-between">
                                                    <Text className="text-black font-bold text-lg">
                                                        AUM Breakdown
                                                    </Text>
                                                    <Pressable
                                                        className="flex flex-row mr-3"
                                                        onPress={() =>
                                                            router.push(
                                                                "/clients"
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            selectable
                                                            className="text-base flex flex-row text-center text-slate-500 font-semibold pr-4"
                                                        >
                                                            Asset class
                                                        </Text>
                                                        <Icon
                                                            name="angle-down"
                                                            size={24}
                                                            color={"#888"}
                                                        />
                                                    </Pressable>
                                                </View>

                                                <View>
                                                    <DonutPieChart
                                                        // pieData={[
                                                        //     {
                                                        //         x: data?.aum?.breakDown[0].category,
                                                        //         y: data?.aum?.breakDown[0].currentValue.toFixed(2),
                                                        //     },
                                                        //     {
                                                        //         x: data?.aum?.breakDown[1].category,
                                                        //         y: data?.aum?.breakDown[1].currentValue.toFixed(2),
                                                        //     },
                                                           
                                                        // ]}

                                                        pieData={[
                                                            {
                                                                x: "Debt",
                                                                y: 54.2,
                                                            },
                                                            {
                                                                x: "Equity",
                                                                y: 45.8,
                                                            },
                                                           
                                                        ]}

                                                        

                                                        // pieData = {[aumBreakdownChart]}
                                            
                                                    />
                                                </View>
                                            </View>
                                            <View className="w-[50%] rounded bg-white p-4">
                                                <View className="flex flex-col justify-between">
                                                    <Text className="text-black font-bold text-lg">
                                                        SIP Breakdown
                                                    </Text>
                                                    <Pressable
                                                        className="flex flex-row mr-3"
                                                        onPress={() =>
                                                            router.push(
                                                                "/clients"
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            selectable
                                                            className="text-base flex flex-row text-center text-slate-500 font-semibold pr-4"
                                                        >
                                                            Asset class
                                                        </Text>
                                                        <Icon
                                                            name="angle-down"
                                                            size={24}
                                                            color={"#888"}
                                                        />
                                                    </Pressable>
                                                </View>

                                                <View>
                                                    <DonutPieChart
                                                        pieData={[
                                                            {
                                                                x: "Equity",
                                                                y: 20,
                                                            },
                                                            {
                                                                x: "Hybrid",
                                                                y: 29,
                                                            },
                                                            {
                                                                x: "Debt",
                                                                y: 35,
                                                            },
                                                            {
                                                                x: "Others",
                                                                y: 25,
                                                            },
                                                        ]}
                                                        // pieData={[
                                                        //     sipBreakdownChart,
                                                        // ]}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="w-4/12 rounded bg-white p-4">
                                        <View className="flex flex-row justify-between">
                                            <View>
                                                <Text className="text-black">
                                                    Notification
                                                </Text>
                                            </View>

                                            <DynamicMenu
                                                onDataReceived={
                                                    handleDataReceived1
                                                }
                                                options={[
                                                    {
                                                        option: "All",
                                                        value: "4322",
                                                    },
                                                    {
                                                        option: "last 24 hour",
                                                        value: "4321",
                                                    },
                                                    {
                                                        option: "last 1 hour",
                                                        value: "4320",
                                                    },
                                                ]}
                                                apiUrl="sip"
                                            />
                                        </View>
                                        <View className="h-auto">
                                            <View className="h-96 overflow-scroll">
                                                {notificationData.map(
                                                    (item, index) => (
                                                        <AvatarCard
                                                            key={index} // Make sure to provide a unique key for each item
                                                            imageUrl={
                                                                item.imageUrl
                                                            }
                                                            title={item.title}
                                                            description={
                                                                item.description
                                                            }
                                                        />
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="bg-[#eaf3fe]">
                                <View className="flex flex-row items-center">
                                    <Text className="text-base text-slate-500 font-bold text-medium pr-4">
                                        Time Period:
                                    </Text>
                                    <DynamicMenu
                                        onDataReceived={handleDataReceived}
                                        options={[
                                            {
                                                option: "last 3 month",
                                                value: "70",
                                            },
                                            {
                                                option: "last 6 month",
                                                value: "77",
                                            },
                                            {
                                                option: "last 12 month",
                                                value: "71",
                                            },
                                        ]}
                                        apiUrl="folio"
                                    />
                                    <View
                                        style={{
                                            borderBottomColor: "gray",
                                            borderBottomWidth: 1,
                                            flex: 1,
                                            alignSelf: "center",
                                            width: "100%",
                                        }}
                                    />
                                </View>
                            </View>

                            <View className="flex flex-row justify-between rounded bg-white h-auto gap-2 pb-4">
                                <View
                                    className="flex flex-row w-[45%] h-full rounded gap-2"
                                    style={{
                                        borderColor: "#e4e4e4", // Grey border color

                                        borderRightWidth:
                                            StyleSheet.hairlineWidth, // Hairline right border width
                                    }}
                                >
                                    {/* <Text>Card</Text> */}
                                    <View className="flex flex-col w-[49%]">
                                        <BorderCard
                                            title="Investment"
                                            description={
                                                RupeeSymbol + "10,87,899"
                                            }
                                        />
                                        <BorderCard
                                            title="Redemptiom"
                                            description={data?.transaction?.redemption ? 
                                                RupeeSymbol + data?.transaction?.redemption : RupeeSymbol +"0"
                                            }
                                        />
                                        <BorderCard
                                            title="Inactive/Cancelled SIPs"
                                            description={data?.transaction?.totalSipTransactionsFailed ? 
                                                 data?.transaction?.totalSipTransactionsFailed :"0"
                                            }
                                        />
                                    </View>
                                    <View className="flex flex-col w-[49%]">
                                        <BorderCard
                                            title="New SIPs"
                                            description={data?.order?.sip?.newSip ? data?.order?.sip?.newSip : "0"}
                                        />
                                        <BorderCard
                                            title="No. of successful SIPs"
                                            description={data?.transaction?.totalSipTransactionsFailed && data?.transaction?.totalSipTransactions? 
                                                (data?.transaction?.totalSipTransactions - data?.transaction?.totalSipTransactionsFailed) :"0"
                                           }
                                        />
                                        <BorderCard
                                            title="No. of SIP Bounce"
                                            description="08"
                                        />
                                    </View>
                                </View>
                                <View
                                    className="w-[35%] h-128 rounded px-4"
                                    style={{
                                        borderColor: "#e4e4e4", // Grey border color

                                        borderRightWidth:
                                            StyleSheet.hairlineWidth, // Hairline right border width
                                    }}
                                >
                                    <Text className="font-bold ">
                                        Top 5 Clients
                                    </Text>
                                    <View className="flex flex-row py-2">
                                        <View className="w-6/12">
                                            <Text className="text-black">
                                                Name
                                            </Text>
                                        </View>
                                        <View className="w-2/12">
                                            <Text>SIPs</Text>
                                        </View>
                                        <View className="w-4/12">
                                            <Text>Investment</Text>
                                        </View>
                                    </View>
                                    <View className=" h-48 overflow-scroll">
                                        {topClientData.map((item, index) => (
                                            <View
                                                key={index}
                                                className="flex flex-row items-center"
                                            >
                                                <View className="w-6/12">
                                                    <AvatarCard
                                                        imageUrl={item.imageUrl}
                                                        title="Natali Craig"
                                                        description=""
                                                    />
                                                </View>
                                                <View className="w-2/12">
                                                    <Text
                                                        selectable
                                                        className="text-[#686868] font-semibold"
                                                    >
                                                        {item.sip}
                                                    </Text>
                                                </View>
                                                <View className="w-4/12">
                                                    <Text
                                                        selectable
                                                        className="text-[#686868] font-semibold"
                                                    >
                                                        {RupeeSymbol}{" "}
                                                        {item.investment}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View className="w-[20%] rounded pl-1">
                                    <Text className="font-bold ">
                                        Inactive Client
                                    </Text>
                                    <View className=" h-48 overflow-scroll">
                                        {topClientData.map((item, index) => (
                                            <AvatarCard
                                                key={index}
                                                imageUrl="account"
                                                title="Natali Craig"
                                                description=""
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
};

export default IFADashboard;