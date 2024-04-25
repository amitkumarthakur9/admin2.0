import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice

const IconCard = ({ icon, title, description }) => {
    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: "#CCF3FF",
                    borderRadius: 50,
                    width: 50,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <MaterialCommunityIcons name={icon} size={24} color="#0F5FC2" />
            </View>
            <View style={styles.textContainer}>
                <Text className ="text-xs font-bold text-slate-500" >{title}</Text>
                <Text className ="text-base font-bold" >{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    textContainer: {
        marginLeft: 16,
        flex: 1,
    },
    
});

export default IconCard;
