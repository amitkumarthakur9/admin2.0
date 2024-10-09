import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import Carousel from "../Carousel/Carousel";
import Performance from "./Performance";
import IFADashboard from "./IFADashboard";
import QuickActions from "./QuickActions";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice

const TabSwitcher = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].key); // Set the default active tab

    const handleTabChange = (key) => {
        setActiveTab(key);
        onTabChange(key); // Notify parent component about the active tab change
    };

    return (
        <View className="flex flex-row justify-between rounded-xl p-2 bg-gray-200">
            {tabs.map((tab) => (
                <Pressable
                    key={tab.key}
                    onPress={() => handleTabChange(tab.key)}
                    className={`p-2 rounded-lg ${
                        activeTab === tab.key ? "bg-white" : ""
                    }`}
                >
                    <Text
                        className={`text-center ${
                            activeTab === tab.key
                                ? "text-blue-500 font-semibold"
                                : "text-black"
                        }`}
                    >
                        {tab.name}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
};

const DashboardTabContent = [
    {
        key: "Dashboard",
        name: "Dashboard",
        content: <Performance />,
    },
    {
        key: "pendingTask",
        name: "Pending Task",
        content: <IFADashboard />,
    },
];

export default function Dashboard() {
    const [showCarousel, setShowCarousel] = useState(true);
    const [selectedTab, setSelectedTab] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };
    const [activeTab, setActiveTab] = useState(DashboardTabContent[0].key);

    // Find the content corresponding to the active tab
    const activeContent = DashboardTabContent.find(
        (tab) => tab.key === activeTab
    )?.content;

    // Function to handle tab change
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const items = [
        {
            title: "What’s New!",
            description:
                " What’s New! Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            bgImage: "https://your-bg-image-url.com/image1.jpg",
        },
        {
            title: "New Features Released",
            description:
                "New Features Released Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
            bgImage: "https://your-bg-image-url.com/image2.jpg",
        },
    ];

    const data = [
        {
            title: "orders",
            date: "15 MAY 2024, 11:00 PM",
            name: "",
        },
    ];

    const accordionData = data.map((item) => {
        return {
            title: item?.name,
            subcontent: (
                <View className="mb-4">
                    <Text className="text-gray-600">
                        Search Subscription Digest
                    </Text>
                    <Text className="text-gray-400">15 MAY 2024, 11:00 PM</Text>
                </View>
            ),
            content: (
                <ScrollView className="w-full p-4 h-[350px]">
                    <View className="mb-4">
                        <Text className="text-gray-600">
                            Search Subscription Digest
                        </Text>
                        <Text className="text-gray-400">
                            15 MAY 2024, 11:00 PM
                        </Text>
                    </View>
                </ScrollView>
            ),
        };
    });
    return (
        <ScrollView className="bg-gray-100 gap-2 p-2">
            {showCarousel && (
                <View>
                    <Carousel
                        items={items}
                        onClose={() => setShowCarousel(false)}
                        height={100}
                        width={"100%"} // Use screen width dynamically
                        autoscroll={true} // Enable auto-scrolling
                        scrollInterval={1000} // Set scroll interval to 5 seconds
                        visibleItems={1} // Control how many items are visible at once
                    />
                </View>
            )}
            {!showCarousel && <Text>Carousel Closed</Text>}
            {/* User Section */}
            <View className="flex flex-row justify-between w-full bg-white p-4 rounded-lg ">
                <View className="flex-row justify-center items-center gap-2">
                    <Text className="text-lg font-bold">Vishwas Patel</Text>
                    <View className="flex-row items-center">
                        <View className="bg-green-200  p-1 rounded border border-green-600">
                            <Text className="text-green-700">Active</Text>
                        </View>
                    </View>
                </View>
                <TabSwitcher
                    tabs={DashboardTabContent}
                    onTabChange={handleTabChange}
                />
            </View>
            <View>
                <QuickActions />
            </View>
            <View>{activeContent}</View>
        </ScrollView>
    );
}
