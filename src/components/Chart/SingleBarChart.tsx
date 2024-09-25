import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { View, VStack, Image, Spinner } from "native-base";

const labelPositions = {
    Aggressive: 100, // Fill to the top
    "Moderately Aggressive": 80, // 80% fill
    Moderate: 60, // 60% fill
    "Moderate Conservative": 40, // 40% fill
    Conservative: 20, // 20% fill
};

const GradientBar = ({ labels, riskLevel }) => {
    // Calculate the unfilled height based on the risk level
    const filledHeight = labelPositions[riskLevel] || 0;
    const unfilledHeight = `${100 - filledHeight}%`;

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
                colors={["#7188ff", "#84fecb"]}
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
            />
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
                    <View
                        key={index}
                        className="w-full h-1/5 flex flex-row items-center justify-center"
                    >
                        <Text
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

export const SingleBarChart = ({
    title,
    labels,
    riskLevel,
    loading = false,
}) => {
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
            ) : (
                <VStack className="h-full">
                    <GradientBar labels={labels} riskLevel={riskLevel} />
                </VStack>
            )}
        </View>
    );
};
