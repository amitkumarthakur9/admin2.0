import React from "react";
import { View } from "react-native";
import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";

const DonutPieChart = ({pieData}) => {

    const colorScale = ["#715CFA", "#FE9090", "#FFE456", "#B0ED8B"]; // Example colors

    return (
        <div style={{ display: "flex" }}>
            <View className="w-8/12">
                <VictoryPie
                    data={pieData}
                    colorScale={colorScale}
                    innerRadius={100} // Adjust inner radius for donut shape
                    labels={({ datum }) => `${datum.x}: ${datum.y.toFixed(1)}${"%"}`} // Show data in labels
                    style={{ labels: { fill: "black" } }} // Style for labels
                    width={500} // Adjust width of pie chart
                    labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} flyoutHeight={40} style={{ fontSize: 24 }} />
                    }
                />
            </View>
            <View className="w-4/12">
                <VictoryLegend
                    x={0}
                    y={-200}
                    orientation="vertical"
                    gutter={2} // Adjust spacing between legend items
                    data={pieData.map((item, index) => ({
                        
                        name: `${item.x}: ${item.y.toFixed(1)}${"%"}`,
                        symbol: { fill: colorScale[index] },
                    }))}
                    // width={500}
                    style={{ labels: { fontSize: 40, flex: 1, flexDirection: 'col', flexWrap: 'wrap',} }} // Adjust font size
                />
            </View>
        </div>
    );
};

export default DonutPieChart;
