import React from "react";
import { View, Text, Pressable } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ActionItemDetail = ({ actionItem, onBack, onClose }) => {
    return (
        <>
            <View className="flex flex-row justify-between">
                <View className="p-4 flex flex-row justify-center items-center">
                    <Pressable onPress={onBack} className="">
                        <FontAwesome name={"angle-left"} size={30} color={""} />
                    </Pressable>
                    <View className="p-4">
                        <Text className="text-lg font-bold">
                            {actionItem.title}
                        </Text>
                        <Text className="text-gray-400">{actionItem.date}</Text>
                    </View>
                </View>
                <Pressable
                    onPress={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full"
                >
                    <Text className="text-xl font-bold">×</Text>
                </Pressable>
            </View>
            <View className="flex flex-row justify-between p-3">
                {/* Action Item Details */}
                <Text className="text-gray-600 mb-2">Title</Text>
                <Text className="text-gray-400 mb-4">Date</Text>
                <Text className="text-gray-400 mb-4">description</Text>
                <Pressable onPress={onClose} className="">
                    <FontAwesome name={"envelope"} size={20} color={""} />
                </Pressable>
            </View>
            <View className="flex flex-row justify-between p-3">
                {/* Action Item Details */}
                <Text className="text-gray-600 mb-2">{actionItem.title}</Text>
                <Text className="text-gray-400 mb-4">{actionItem.date}</Text>
                <Text className="text-gray-400 mb-4">
                    {actionItem.description}
                </Text>
                <Pressable onPress={onClose} className="">
                    <FontAwesome name={"envelope"} size={20} color={""} />
                </Pressable>
            </View>
        </>
    );
};

export default ActionItemDetail;
