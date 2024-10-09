import React from "react";
import { View, Text } from "react-native";
import { VictoryPie, VictoryTooltip } from "victory";

const DoubleDonutPieChart = ({
    outerPieData,
    innerPieData,
    totalValue = "NA",
    width = 400,
}) => {
    const outerColorScale = ["#42A5F5", "#EC4899"]; // Colors for outer pie
    const innerColorScale = ["#B0BEC5", "#EC4899"]; // Colors for inner pie

    const isZeroValue = totalValue === "NA" || totalValue === "0";

    const zeroData = [{ x: "No Data", y: 100 }];
    const zeroColorScale = ["#d3d3d3"];

    const displayOuterData = isZeroValue ? zeroData : outerPieData;
    const displayInnerData = isZeroValue ? zeroData : innerPieData;
    const displayOuterColorScale = isZeroValue
        ? zeroColorScale
        : outerColorScale;
    const displayInnerColorScale = isZeroValue
        ? zeroColorScale
        : innerColorScale;

    return (
        <View className="flex flex-col items-center">
            {/* Double Concentric Donut Chart */}
            <View className="relative">
                {/* Outer Donut Chart */}
                <VictoryPie
                    data={displayOuterData}
                    colorScale={displayOuterColorScale}
                    innerRadius={100}
                    radius={130} // Outer radius to create outer ring
                    labels={({ datum }) => `${datum.y.toFixed(1)}%`}
                    labelRadius={140}
                    style={{ labels: { fill: "black", fontSize: 20 } }}
                    width={width}
                    labelComponent={<VictoryTooltip style={{ fontSize: 20 }} />}
                />

                {/* Inner Donut Chart */}
                <View className="absolute inset-0 flex justify-center items-center">
                    <VictoryPie
                        data={displayInnerData}
                        colorScale={displayInnerColorScale}
                        innerRadius={50}
                        radius={80} // Smaller radius for inner ring
                        labels={({ datum }) => `${datum.y.toFixed(1)}%`}
                        labelRadius={100}
                        style={{ labels: { fill: "black", fontSize: 16 } }}
                        width={width}
                        labelComponent={
                            <VictoryTooltip style={{ fontSize: 16 }} />
                        }
                    />
                </View>
            </View>

            {/* Labels Below the Donut */}
            <View className="flex flex-row justify-around w-full p-4">
                <View className="flex items-center gap-2">
                    <Text className="">Average</Text>
                    <Text className="font-semibold">{totalValue}</Text>
                </View>
                <View className="border border-gray-300 mx-2"></View>
                <View className="flex items-center gap-2">
                    <Text className="">Performance</Text>
                    <View className="px-2 py-1 rounded-full bg-blue-100">
                        <Text className=" text-blue-600">
                            {outerPieData[0]?.y}%
                        </Text>
                    </View>
                </View>
                <View className="border border-gray-300 mx-2"></View>
                <View className="flex items-center gap-2">
                    <Text className="">Business</Text>
                    <View className="px-2 py-1 rounded-full bg-pink-100">
                        <Text className=" text-pink-600">
                            {innerPieData[0]?.y}%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DoubleDonutPieChart;
