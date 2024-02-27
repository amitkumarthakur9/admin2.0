// CardWithTabs.js
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "native-base";

const CardWithTabs = ({ selectedTab, handleTabPress, tabContent, tabsCount = 3 }) => {

    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto">
            <View>
                <View className="w-full flex flex-row mb-2 overflow-scroll">
                    {tabContent?.map((tab, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleTabPress(index + 1)}
                                className={`w-1/${tabsCount} py-4 px-6 flex flex-row justify-center items-center border-b-2 ${
                                    selectedTab === index + 1
                                    ? "border-black bg-gray-800"
                                    : "border-b-gray-400"
                                }`}
                            >
                                <Text
                                    className={`font-bold ${selectedTab === index + 1 ? "text-white" : "text-gray-600"}`}
                                >
                                    {tab?.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {tabContent[selectedTab - 1]?.content}
            </View>
        </View>
    );
};

export default CardWithTabs;
