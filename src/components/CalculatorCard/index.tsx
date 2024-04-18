import React from "react";
import { Text, Pressable } from "native-base";

const CalculatorCard = ({ title, description, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            className="bg-white p-4 m-2 rounded-lg shadow"
        >
            <Text className="text-lg font-bold mb-2">{title}</Text>
            <Text className="text-sm text-gray-600">{description}</Text>
        </Pressable>
    );
};

export default CalculatorCard;
