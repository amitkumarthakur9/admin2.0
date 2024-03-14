import React from "react";
import { View, StyleSheet, Text } from "react-native";

const BorderCard = ({title, description}) => {
    return (
        
        <View style={[styles.borderCard, { marginBottom: 2 }]}>
            <Text className="text-slate-500 text-xs">{title}</Text>
            <Text className="font-bold text-lg">{description}</Text>
        </View>

    );
};

const styles = StyleSheet.create({
    borderCard: {
        borderWidth: 1,
        borderColor: "#cbd5e0", // Grey border color for other sides
        borderLeftWidth: 4,
        borderLeftColor: "#0769D0", // Blue left border color
        padding: 16,
        width: "95%",
        borderRadius: 5,
       
    },
});

export default BorderCard;
