import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const HorizontalStackedBarChart = ({ data, colors }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <View className="flex flex-col gap-y-4">
            <View className="flex flex-row h-5">
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setHoveredIndex(index)}
                        onPressIn={() => handleMouseEnter(index)}
                        onPressOut={handleMouseLeave}
                        className={`flex-row items-center justify-center ${index === 0 && `rounded-l`} ${index + 1 === data.length && `rounded-r`}`}
                        style={{
                            flex: item.value,
                            backgroundColor: colors[index % colors.length],
                        }}
                    >
                        {hoveredIndex === index && (
                            <Text className="text-white" selectable>
                                {item.value}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <View className="flex flex-row justify-center mt-1 gap-x-4">
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setHoveredIndex(index)}
                        className="flex flex-row items-center"
                    >
                        <View
                            className={`rounded w-3 h-3`}
                            style={{
                                backgroundColor: colors[index % colors.length],
                                marginRight: 4,
                            }}
                        />
                        <Text
                            selectable
                            className={`text-xs ${hoveredIndex === index ? "text-black" : "text-gray-500"}`}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HorizontalStackedBarChart;
