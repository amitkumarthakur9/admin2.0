// CardWithTabs.js
import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "native-base";

const CardWithTabs = ({
    selectedTab,
    handleTabPress,
    tabContent,
    tabsCount = 3,
}) => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-scroll">
            <View className="w-full flex flex-row">
                {tabContent?.map((tab, index) => {
                    return (
                        <Pressable
                            key={index}
                            onPress={() => handleTabPress(index + 1)}
                            className={`w-1/${tabsCount} py-4 px-6 flex h-12 flex-row justify-center items-center border-b-2 ${
                                selectedTab === index + 1
                                    ? "border-black bg-gray-800"
                                    : "border-b-gray-400"
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
                        </Pressable>
                    );
                })}
            </View>
            <View className="w-full h-full">
                {tabContent[selectedTab - 1]?.content}
            </View>
        </View>
    );
};

export default CardWithTabs;
