import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Spinner, VStack, View } from "native-base";

const GradientBar = ({ labels, value }) => {
    const unfilledHeight = value ? `${(1 - value / 10) * 100}%` : "100%";

    return (
        <View
            style={{
                height: 400,
                backgroundColor: "transparent",
                borderRadius: 10,
                overflow: "hidden",
            }}
        >
            <LinearGradient
                colors={["#013974", "#398c06"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{ flex: 1, borderRadius: 10 }}
            />
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: unfilledHeight,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
            ></View>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                {labels.map((el, index) => (
                    <View className="w-full h-1/5 flex flex-row items-center justify-center">
                        <Text
                            key={index}
                            style={{
                                color: "white",
                                paddingVertical: 2,
                                fontWeight: "bold",
                            }}
                        >
                            {el}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export const SingleBarChart = ({ title, data, labels, loading = false }) => {
    return (
        <View className="h-fit flex flex-col gap-y-4">
            <Text className="font-bold text-lg text-center">{title}</Text>
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
                <VStack className="h-full">
                    {data?.map((item, index) => (
                        <GradientBar
                            key={index}
                            labels={labels}
                            value={item.value}
                        />
                    ))}
                </VStack>
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
