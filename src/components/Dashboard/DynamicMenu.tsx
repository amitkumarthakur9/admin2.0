import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Menu } from "native-base"; 
import Icon from "react-native-vector-icons/FontAwesome";
import RemoteApi from "../../../src/services/RemoteApi";

const DynamicMenu = ({ onDataReceived, options, apiUrl }) => {
    const [selectedOption, setSelectedOption] = useState(options[0].option);
    const [isOpen, setIsOpen] = useState(false);
    // const [value, setValue] = useState(options[0].value);
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (value !== null) {
            const url = `${apiUrl}/${value}`;
            async function getDetails() {
                try {
                    const response:any = await RemoteApi.get(url);
                    if (response && response.data) {
                        onDataReceived(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            getDetails();
        }
    }, [value]);

    const handleOptionSelect = (option, optionValue) => {
        setSelectedOption(option);
        setValue(optionValue); 
        setIsOpen(false); 
    };

    return (
        <View>
            <Menu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                trigger={(triggerProps) => {
                    return (
                        <Pressable
                            accessibilityLabel="More options menu"
                            {...triggerProps}
                            onPress={() => setIsOpen(!isOpen)}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    selectable
                                    style={{
                                        fontSize: 16,
                                        color: "#52606D",
                                        fontWeight: "bold",
                                        paddingRight: 4,
                                    }}
                                >
                                    {selectedOption || "Select Option"}
                                </Text>
                                <Icon
                                    name={isOpen ? "angle-up" : "angle-down"}
                                    style={{
                                        color: "#888",
                                        fontSize: 24,
                                    }}
                                />
                            </View>
                        </Pressable>
                    );
                }}
            >
                {options.map((item, index) => (
                    <Menu.Item
                        key={index}
                        onPress={() => handleOptionSelect(item.option, item.value)}
                    >
                        {item.option}
                    </Menu.Item>
                ))}
            </Menu>
        </View>
    );
};

export default DynamicMenu;
