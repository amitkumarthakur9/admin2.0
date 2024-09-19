import React from "react";
import { Text, Pressable } from "react-native";

const CustomButton = ({
    onPress,
    title,
    disabled = false,
    style = { button: "bg-[#114EA8]", text: "text-white" },
    buttonStyle = "full",
}) => {
    const buttonStyles = {
        backgroundColor: "",
        textColor: "",
    };

    if (disabled) {
        buttonStyles.backgroundColor = "bg-gray-200"; // Gray color when disabled
        buttonStyles.textColor = "text-gray-400"; // Gray color when disabled
    } else if (buttonStyle === "full") {
        buttonStyles.backgroundColor = `bg-[#114EA8]`; // Blue color when enabled
        buttonStyles.textColor = `${style.text}`; // Blue color when enabled
    } else if (buttonStyle === "outline") {
        buttonStyles.backgroundColor = `bg-[#ffffff]`; // Blue color when enabled
        buttonStyles.textColor = `text-[#114EA8]`; // Blue color when enabled
    } else {
        buttonStyles.backgroundColor = `${style.button}`; // Blue color when enabled
        buttonStyles.textColor = `${style.text}`; // Blue color when enabled
    }

    console.log(buttonStyles.backgroundColor);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`flex flex-row justify-center items-center border-[1px] border-[#114EA8] rounded px-4 h-[42px] ${buttonStyles.backgroundColor}`}
        >
            <Text className={`${buttonStyles.textColor}`}>{title}</Text>
        </Pressable>
    );
};

export default CustomButton;
