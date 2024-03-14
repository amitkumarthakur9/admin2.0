import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import AntdIcon from "react-native-vector-icons/AntDesign";

const Accordion = ({ accordionData, renderItem }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <View className="w-full gap-y-2">
            {accordionData.map((item, index) => (
                <View
                    key={index}
                    className={`border border-gray-100 rounded ${
                        openIndex === index ? "bg-gray-100" : "bg-white"
                    }`}
                >
                    <Pressable onPress={() => toggleAccordion(index)}>
                        <View
                            className={`flex flex-row justify-between items-center p-4 rounded `}
                        >
                            <View className="flex flex-row items-center gap-2">
                                <View className="w-8 h-8 rounded bg-gray-500" />
                                <View>
                                    <Text className="text-normal">
                                        {item.title}
                                    </Text>
                                    {item.subcontent}
                                </View>
                            </View>
                            <AntdIcon
                                name={openIndex === index ? "up" : "down"}
                                style={{ fontWeight: "100" }}
                                size={12}
                                color="grey"
                            />
                        </View>
                    </Pressable>
                    {openIndex === index && renderItem(item)}
                </View>
            ))}
        </View>
    );
};

export default Accordion;
