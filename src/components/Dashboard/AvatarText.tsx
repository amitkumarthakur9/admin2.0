import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice

const AvatarText = ({ imageUrl, title, description }) => {
    return (
        <View className="flex flex-row py-2 items-center w-full flex-wrap ">
            <View
                className={"flex flex-row items-center justify-start w-[99%]"}
            >
                {/* <Image
    alt="fundHouse"
    className="mr-2"
    style={{
        width: 40,
        height: 40,
        objectFit: "contain",
    }}
    source={{
        uri: {imageUrl},
    }}
/> */}
                <View className="w-6 h-6 rounded-[50%] bg-gray-500 mx-2" />
                <View className={"flex flex-col justify-end items-start"}>
                <View className="">
                    <Text selectable className="text-black text-sm">
                        {title}
                    </Text>
                    </View>

                    <View className="flex flex-row items-center w-[99%]">
                        <Text selectable className="text-grey-300 text-xs">
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default AvatarText;
