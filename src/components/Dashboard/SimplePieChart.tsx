import React from "react";
import { View } from "react-native";
import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";

const SimplePieChart = () => {
    const data = [
        { x: "Equity", y: 20 },
        { x: "Hybrid", y: 29 },
        { x: "Debt", y: 35 },
        { x: "Others", y: 25 },
    ];

    const colorScale = ["#715CFA", "#FE9090", "#FFE456", "#B0ED8B"]; // Example colors

    return (
        <div style={{ display: "flex" }}>
            <View className="w-9/12 pt-4">
                <VictoryPie
                    data={data}
                    colorScale={colorScale}
                    innerRadius={100} // Adjust inner radius for donut shape
                    labels={({ datum }) => `${datum.x}: ${datum.y}`} // Show data in labels
                    style={{ labels: { fill: "black" } }} // Style for labels
                    width={500} // Adjust width of pie chart
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} flyoutHeight={40} style={{ fontSize: 24 }} />
                    }
                />
            </View>
            <View className="w-3/12">
                <VictoryLegend
                    x={50}
                    y={0}
                    orientation="vertical"
                    gutter={2} // Adjust spacing between legend items
                    data={data.map((item, index) => ({
                        name: `${item.x}: ${item.y}`,
                        symbol: { fill: colorScale[index] },
                    }))}
                    style={{ labels: { fontSize: 60 } }} // Adjust font size
                />
            </View>
        </div>
    );
};

export default SimplePieChart;
