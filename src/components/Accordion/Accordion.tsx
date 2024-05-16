import { Image } from "native-base";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

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
                                <Image
                                    alt="bank"
                                    className="mr-2"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        objectFit: "contain",
                                    }}
                                    source={{
                                        uri: item?.logoUrl,
                                    }}
                                />
                                <View>
                                    <Text className="text-normal">
                                        {item.title}
                                    </Text>
                                    {item.subcontent}
                                </View>
                            </View>
                            <AntDesign
                                style={{
                                    marginRight: 5,
                                }}
                                color={"black"}
                                name={
                                    openIndex === index
                                        ? "caretup"
                                        : "caretdown"
                                }
                                size={15}
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
