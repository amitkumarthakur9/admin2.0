import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice

const IconCard = ({ iconPostion="row", icon, iconColor="#0F5FC2",iconWidth=50,borderRadius=50,iconBg="#CCF3FF", title, description }) => {
   
    const iconAlign = iconPostion==="row" ? "flex flex-row justify-center items-center " : "flex flex-col justify-start items-start "
    const textAlign = iconPostion==="row" ? "flex-1 p-2" : "flex flex-col justify-start items-start py-1 "
   
    return (
        <View className={iconAlign}>
            <View
                style={{
                    backgroundColor: iconBg,
                    borderRadius: borderRadius,
                    width: iconWidth,
                    height: iconWidth,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
            </View>
            <View className={textAlign}>
                <Text className ="text-xs font-bold text-slate-500" >{title}</Text>
                <Text className ="text-base font-bold" >{description}</Text>
            </View>
        </View>
    );
};



export default IconCard;
