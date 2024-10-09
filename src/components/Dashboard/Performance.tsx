import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Carousel from "../Carousel/Carousel";
import Accordion from "../Accordion/Accordion";
import CardWithTabs from "../Card/CardWithTabs";
import Icon from "react-native-vector-icons/FontAwesome";
import DataTable from "../DataTable/DataTable";
import DonutPieChart from "../Chart/DonutPieChart";
import DoubleDonutPieChart from "../Chart/DoubleDonutChart";
import ActionItems from "./Actionitems";
import IconCard from "../Card/IconCard";

const statsdata = [
    {
        key: 1,
        icon: "account-outline",
        title: "Number of Clients",
        description: "Clients",
        iconWidth: 20,
        iconBg: "none",
        bgCard: "none",
        iconColor: "",
    },
];

export default function Performance() {
    const [showCarousel, setShowCarousel] = useState(true);
    const [selectedTab, setSelectedTab] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const pieDataExample = {
        outerPieData: [
            { x: "Performance", y: 60 },
            { x: "Remaining", y: 40 },
        ],
        innerPieData: [
            { x: "Business", y: 70 },
            { x: "Remaining", y: 30 },
        ],
        totalValue: "65%", // Total average value in center
    };

    const items = [
        {
            title: "What’s New!",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            bgImage: "https://your-bg-image-url.com/image1.jpg",
        },
        {
            title: "New Features Released",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            bgImage: "https://your-bg-image-url.com/image2.jpg",
        },
    ];

    const activityFeed = [
        {
            title: "Orders - Payment Reminder",
            date: "15 MAY 2024, 11:00 PM",
            name: "",
        },
    ];

    const pendingTask = [
        {
            title: " Auction Status - Bid Losing",
            date: "15 MAY 2024, 11:00 PM",
            name: "",
        },
    ];

    const tabContent = [
        {
            key: "activityFeed",
            name: "Activity Feed",
            content: activityFeed.map((item) => {
                return (
                    <View className="mb-4 flex flex-row">
                        <Text className="text-gray-600">{item.title}</Text>
                        <Text className="text-gray-400 text-xs">
                            {" "}
                            {item.date}
                        </Text>
                    </View>
                );
            }),
        },
        {
            key: "pendingTask",
            name: "Pending Task",
            content: pendingTask.map((item) => {
                return (
                    <DataTable
                        key="holdings"
                        headers={["", "", ""]}
                        cellSize={[8, 2, 2]}
                        mobileCellSize={[4, 2, 2, 3]}
                        rows={pendingTask?.map((item) => {
                            return [
                                {
                                    key: "scheme",
                                    data: item,
                                    content: (
                                        <View className="mb-4 flex flex-row">
                                            <Text className="text-gray-600">
                                                {item.title}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {" "}
                                                {item.date}
                                            </Text>
                                        </View>
                                    ),
                                },
                            ];
                        })}
                        hasActions={true}
                        options={[
                            {
                                key: "Edit",
                                name: "Edit",
                                onClick: () => setShowModal(true),
                            },
                            {
                                key: "Open Tab",
                                name: "Open Tab",
                                onClick: () => setShowModal(true),
                            },
                            {
                                key: "Close and Follow Up",
                                name: "Close and Follow Up",
                                onClick: () => setShowModal(true),
                            },
                            {
                                key: "Close",
                                name: "Close",
                                onClick: () => setShowModal(false),
                            },
                        ]}
                    />
                );
            }),
        },
    ];

    return (
        <View className="flex flex-row w-full justify-between gap-2">
            <View className=" flex flex-col w-[60%]">
                {/* Stats Section */}
                <View className=" rounded-lg shadow-sm gap-2 w-[100%] pr-4">
                    <View className="flex-row justify-between">
                        <View className="w-1/4 p-4 bg-red-100 rounded-lg shadow">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-green-100 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-blue-100 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-purple-100 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <View className="w-1/4 p-4 bg-yellow-100 rounded-lg shadow">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-blue-200 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-green-200 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                        <View className="w-1/4 p-4 bg-red-100 rounded-lg shadow ml-2">
                            <IconCard
                                icon="account-outline"
                                title="Number of Clients"
                                description={"Clients"}
                                iconWidth={20}
                                iconBg={"none"}
                                iconPostion={"col"}
                            />
                        </View>
                    </View>
                </View>
                <View className="flex flex-row  rounded bg-white w-[100%] ">
                    <View className="flex flex-col w-[40%] justify-between items-center ">
                        <Text className="text-lg text-start font-bold p-2">
                            Performance
                        </Text>
                        <View className="w-1/2">
                            <DoubleDonutPieChart
                                outerPieData={pieDataExample.outerPieData}
                                innerPieData={pieDataExample.innerPieData}
                                totalValue={pieDataExample.totalValue}
                                width={600} // Set the width of the chart
                            />
                        </View>
                    </View>

                    <View className="flex flex-col w-[60%] pr-4">
                        <ActionItems />
                        <View className="flex-row justify-between ">
                            <View className="w-1/2 bg-white rounded-lg p-4 shadow">
                                <Text className="text-green-700 font-bold">
                                    Pro's
                                </Text>
                                <Text className="mt-2">- Quae ab illo</Text>
                                <Text className="mt-2">
                                    - Error sit voluptatem
                                </Text>
                            </View>
                            <View className="w-1/2 bg-white rounded-lg p-4 shadow ml-2">
                                <Text className="text-red-700 font-bold">
                                    Con's
                                </Text>
                                <Text className="mt-2">
                                    - Error est voluptatem
                                </Text>
                                <Text className="mt-2">
                                    - Unde omnis iste natus
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Activity Feed Section */}
            <View className="bg-white p-4 rounded-lg shadow-sm flex flex-col w-[40%]">
                <CardWithTabs
                    key="portfolio"
                    selectedTab={selectedTab}
                    handleTabPress={handleTabPress}
                    tabContent={tabContent}
                    tabsCount={2}
                />
            </View>
        </View>
    );
}
