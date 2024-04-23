import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Spinner, View } from "native-base";

const GradientBar = ({ label, value, maxValue }) => {
    const widthPercent = (value / maxValue) * 100 + "%";

    return (
        <View className="mb-4">
            <View className="h-8 w-full bg-transparent rounded">
                <LinearGradient
                    colors={["#FFCD71", "rgba(255,255,255,0)"]}
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

export const BarChart = ({ title, data, loading = false }) => {
    const maxValue = data?.length
        ? Math.max(...data.map((item) => item.value))
        : 1;

    return (
        <View className="p-2">
            <Text className="text-md font-bold mb-8">{title}</Text>
            {loading ? (
                <View
                    space={2}
                    marginTop={20}
                    marginBottom={20}
                    justifyContent="center"
                >
                    <Spinner
                        color={"black"}
                        accessibilityLabel="Loading order"
                    />
                </View>
            ) : data?.length ? (
                data?.map((item, index) => (
                    <GradientBar
                        key={index}
                        label={item.label}
                        value={item.value}
                        maxValue={maxValue}
                    />
                ))
            ) : (
                <View className="h-full flex flex-col items-center justify-center gap-8">
                    <Image
                        width="72px"
                        height="72px"
                        source={require("../../../assets/images/noData.png")}
                    />
                    <Text className="text-md font-bold">No Data Available</Text>
                </View>
            )}
        </View>
    );
};
