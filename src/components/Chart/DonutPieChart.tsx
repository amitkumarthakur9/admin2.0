import React from "react";
import { View } from "react-native";
import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";

const DonutPieChart = ({pieData , width=500}) => {

    const colorScale = ["#715CFA", "#B0ED8B", "#FE9090", "#FFE456"];

    return (
        <div style={{ display: "flex" }}>
            <View className="w-4/12">
                <VictoryLegend
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
                />
            </View>
            <View className="w-8/12">
                <VictoryPie
                    data={pieData}
                    colorScale={colorScale}
                    innerRadius={100}
                    labels={({ datum }) =>
                        `${datum.x}: ${datum.y.toFixed(1)}${"%"}`
                    }
                    style={{ labels: { fill: "black" } }}
                    width={width}
                    labelComponent={
                        <VictoryTooltip
                            dy={0}
                            centerOffset={{ x: 25 }}
                            flyoutHeight={40}
                            style={{ fontSize: 16 }}
                        />
                    }
                />
            </View>
        </div>
    );
};

export default DonutPieChart;
