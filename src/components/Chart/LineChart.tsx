import React from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryAxis, VictoryScatter, VictoryVoronoiContainer } from 'victory-native';
import { View } from 'react-native';

const ReusableLineChart = ({
    data,
    width = 400,   // Default width, can be overridden via props
    height = 300,   // Default height, can be overridden via props
    showTooltipAlways = false,  // Prop to control if tooltip should always show
    xLabel = 'Years',
    yLabel = 'Income (₹)'
}) => {
    const yearValues = data.map(item => item.year);
    return (
        <View>
            <VictoryChart
                theme={VictoryTheme.material}
                width={width}   // Width from props
                height={height} // Height from props
                // containerComponent={
                //     <VictoryVoronoiContainer
                //         labels={({ datum }) => `Year: ${datum.year}\nIncome: ₹${datum.income.toLocaleString()}`}
                //         labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{ fill: "white" }} />}
                //     />
                // }
            >
                {/* X-Axis */}
                <VictoryAxis
                    label={xLabel}
                    style={{
                        axisLabel: { padding: 30 },
                        tickLabels: { fontSize: 10, padding: 5 },
                        axis: { stroke: 'none' },
                    }}
                    tickValues={yearValues} 
                />

                {/* Y-Axis */}
                <VictoryAxis
                    dependentAxis
                    // label={yLabel}
                    tickFormat={(x) => `₹${x / 1000}K`}
                    style={{
                        axisLabel: { padding: 40 },
                        tickLabels: { fontSize: 10, padding: 5 },
                        axis: { stroke: 'none' },
                    }}
                />

                {/* Line Chart */}
                <VictoryLine
                    data={data}
                    x="year"
                    y="income"
                    style={{
                        data: { stroke: "#1B6700" },  // Customizing the line color
                        parent: { border: "1px solid #ccc" },
                    }}
                />

                {/* Scatter Points with Hover-Based Tooltip */}
                <VictoryScatter
                    data={data}
                    x="year"
                    y="income"
                    size={5}
                    // labels={({ datum }) =>
                    //     `Year: ${datum.year}\nIncome: ₹${datum.income.toLocaleString()}`
                    // }
                    labels={({ datum }) =>
                        `₹${(datum.income / 1000).toFixed(0)}K`
                        // `₹${datum.income.toFixed(0).toLocaleString()}`
                    }
                    // labelComponent={
                    //     <VictoryTooltip
                    //         flyoutStyle={{ fill: "white" }}
                    //         pointerLength={0}
                    //         cornerRadius={5}
                    //         flyoutPadding={{
                    //             top: 10,
                    //             bottom: 10,
                    //             left: 10,
                    //             right: 10,
                    //         }}
                    //         style={{ fontSize: 10 }}
                           
                    //     />
                    // }
                />
            </VictoryChart>
        </View>
    );
};

export default ReusableLineChart;
