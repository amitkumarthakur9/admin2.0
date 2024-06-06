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
        <View className="flex-1 bg-white rounded h-full">
            <View className="w-full flex flex-row">
                {tabContent?.map((tab, index) => {
                    return (
                        <View className={`w-1/${tabsCount}`}>
                            <Pressable
                                key={index}
                                onPress={() => handleTabPress(index + 1)}
                                className={` py-4 px-6 flex h-12 flex-row justify-center items-center border-b-2 ${
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

export default CardWithTabs;
