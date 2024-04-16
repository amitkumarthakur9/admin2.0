import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientBar = ({ label, value, maxValue }) => {
    const widthPercent = (value / maxValue) * 100 + "%";

    return (
        <View className="mb-4">
            <View className="h-8 w-full bg-transparent rounded">
                <LinearGradient
                    colors={["#f0ab00", "rgba(255,255,255,0)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        width: widthPercent,
                    }}
                    className={`flex-row h-full p-2 rounded-lg`}
                >
                    <View className="w-full flex flex-row items-center justify-between">
                        <Text className="font-bold">{label}</Text>
                        <Text className="px-2 text-xs text-gray-800">{`₹${
                            value / 1000
                        }K`}</Text>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

export const BarChart = ({ title, data }) => {
    const maxValue = Math.max(...data.map((item) => item.value));

    return (
        <View className="p-2">
            <Text className="text-lg font-bold mb-8">{title}</Text>
            {data.map((item, index) => (
                <GradientBar
                    key={index}
                    label={item.label}
                    value={item.value}
                    maxValue={maxValue}
                />
            ))}
        </View>
    );
};
