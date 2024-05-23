import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RupeeSymbol } from "src/helper/helper";
import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";

const DonutPieChart = ({ pieData, totalValue="", width = 400, children=<></> }) => {
    const colorScale = [
        "#715CFA",
        "#B0ED8B",
        "#FE9090",
        "#FFE456",
        "#42A5F5",
        "#FFA726",
        "#26A69A",
    ];

    // const chartData = pieData.map((item, index) => ({
    //     name: `${item.x}: ${item.y.toFixed(1)}%`,
    //     symbol: { fill: colorScale[index] }
    // }));

    console.log("pieData" + JSON.stringify(pieData));
    return (
        <>
        <View className="flex flex-row">
            <View className="w-4/12">
                {children}
                {/* <VictoryLegend
                    x={0}
                    y={-140}
                    orientation="vertical"
                    gutter={2}
                    data={pieData?.map((item, index) => ({
                        name: `${item.x}: ${item.y.toFixed(1)}${"%"}`,
                        symbol: { fill: colorScale[index] },
                    }))}
                    style={{
                        labels: {
                            fontSize: 32,
                            flex: 1,
                            flexDirection: "col",
                            flexWrap: "wrap",
                        },
                    }}
                /> */}
                <View className="w-1/12 pt-2">
                    {pieData?.map((item, index) => (
                        <View
                            key={index}
                            className="flex flex-row justify-start items-center w-[50%] pb-1"
                        >
                            <View
                                className="h-[12px] w-[12px] rounded-full"
                                style={{ backgroundColor: colorScale[index] }}
                            ></View>
                            <View className="flex flex-row">
                                <View className="">
                                    <Text className="text-xs text-gray-600">
                                        {" "}
                                        {item.x}:{" "}
                                    </Text>
                                </View>
                                <View >
                                    <Text className="text-xs text-slate-800">{`${item.y.toFixed(
                                        1
                                    )}%`}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View className="w-8/12 flex justify-center items-center">
                    <VictoryPie
                        data={pieData}
                        colorScale={colorScale}
                        innerRadius={100}
                        labelRadius={120}
                        labels={({ datum }) =>
                            `${datum.x}: ${datum.y.toFixed(1)}${"%"}`
                        }
                        style={{ labels: { fill: "black" } }}
                        width={width}
                        labelComponent={
                            <VictoryTooltip
                                dy={0}
                                centerOffset={{ x: 25 }}
                                flyoutHeight={48}
                                style={{ fontSize: 20 }}
                            />
                        }
                    />
                    <Text className="absolute text-xs">{totalValue}</Text>
                </View>
            </div>
            </View>
        </>
    );
};

export default DonutPieChart;
