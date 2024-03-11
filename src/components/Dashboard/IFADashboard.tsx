import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    Center,
    HStack,
    Heading,
    Pressable,
    ScrollView,
    Spinner,
    Text,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import IconText from "./IconText";
import AvatarText from "./AvatarText";
import { RupeeSymbol } from "../../../src/helper/helper";
import CustomBox from "./CustomBox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SimplePieChart from "./SimplePieChart";

const IFADashboard = () => {
    const [isLoading, setIsLoading] = useState(false);

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
                                    <View className="flex flex-col w-8/12 rounded bg-[#eaf3fe] h-auto ">
                                        {/* <Text>Hidden outer Card</Text> */}
                                        <View className="flex flex-row rounded  bg-[#eaf3fe] flex-wrap w-[99.5%] gap-1 justify-between pb-2">
                                            {/* <Text>Pie chart</Text> */}
                                            <View className="flex flex-col w-[32%]  rounded bg-[#0769D0] h-auto items-between gap-2">
                                                <Text className="text-[#D2CFCF]">
                                                    Total Aum
                                                </Text>
                                                <Text className="text-white font-bold text-[36px]">
                                                    1.8 Cr
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
                                                {/* <Text>4 icon Card</Text> */}

                                                <View className="flex flex-col w-6/12  rounded bg-white h-auto gap-1">
                                                    <IconText
                                                        icon="account-outline"
                                                        title="Number of Clients"
                                                        description="1087"
                                                    />
                                                    <IconText
                                                        icon="chart-timeline-variant"
                                                        title="Total Running SIPs"
                                                        description="457"
                                                    />
                                                </View>
                                                <View className="flex flex-col w-5/12  rounded bg-white h-auto gap-1">
                                                    <IconText
                                                        icon="wallet-outline"
                                                        title="Total Lumpsun Investment"
                                                        description={
                                                            RupeeSymbol +
                                                            "2,00,756"
                                                        }
                                                    />
                                                    <IconText
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
                                            {/* <Text>Pie charts</Text> */}
                                            <View
                                                className="w-[50%]  rounded bg-white p-4"
                                                style={{
                                                    borderColor: "#e4e4e4", // Grey border color

                                                    borderRightWidth:
                                                        StyleSheet.hairlineWidth, // Hairline right border width
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
                                                    <SimplePieChart />
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
                                                    <SimplePieChart />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="w-4/12 rounded bg-white p-4">
                                        <View className="flex flex-row justify-between">
                                            <Text className="text-black">
                                                Notification
                                            </Text>
                                            <Pressable
                                                className="flex flex-row mr-3"
                                                onPress={() =>
                                                    router.push("/clients")
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-base flex flex-row text-center text-slate-500 font-semibold pr-4"
                                                >
                                                    All
                                                </Text>
                                                <Icon
                                                    name="angle-down"
                                                    size={24}
                                                    color={"#888"}
                                                />
                                            </Pressable>
                                        </View>

                                        <View className=" h-96 overflow-scroll">
                                            {notificationData.map(
                                                (item, index) => (
                                                    <AvatarText
                                                        key={index} // Make sure to provide a unique key for each item
                                                        imageUrl={item.imageUrl}
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
                            <View className="bg-[#eaf3fe]">
                                <View className="flex flex-row">
                                    <Text className="text-base text-slate-500 font-bold text-medium pr-4">
                                        Time Period:
                                    </Text>

                                    <Pressable
                                        className="flex flex-row mr-3"
                                        onPress={() => router.push("/clients")}
                                    >
                                        <Text
                                            selectable
                                            className="text-base flex flex-row text-center text-slate-500 font-semibold pr-4"
                                        >
                                            last 3 months
                                        </Text>
                                        <Icon
                                            name="angle-down"
                                            size={24}
                                            color={"#888"}
                                        />
                                    </Pressable>
                                    <View
                                        style={{
                                            borderBottomColor: "gray",
                                            borderBottomWidth: 1,
                                            flex: 1,
                                            alignSelf: "center", // Aligns the line to the center horizontally
                                            width: "100%", // Makes the line span the width of the parent container
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
                                        <CustomBox
                                            title="Investment"
                                            description={
                                                RupeeSymbol + "10,87,899"
                                            }
                                        />
                                        <CustomBox
                                            title="Redemptiom"
                                            description={
                                                RupeeSymbol + "9,77,877"
                                            }
                                        />
                                        <CustomBox
                                            title="Inactive/Cancelled SIPs"
                                            description="15"
                                        />
                                    </View>
                                    <View className="flex flex-col w-[49%]">
                                        <CustomBox
                                            title="New SIPs"
                                            description="115"
                                        />
                                        <CustomBox
                                            title="No. of successful SIPs"
                                            description="10459"
                                        />
                                        <CustomBox
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
                                                    <AvatarText
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
                                            <AvatarText
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
