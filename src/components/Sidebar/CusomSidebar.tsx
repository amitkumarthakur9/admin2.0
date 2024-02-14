import * as React from "react";
import { Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

const A = () => <View />;
const B = () => <View />;

export const CustomSideBar = () => (
    <View
        style={{
            position: "absolute",
            justifyContent: "space-around",
            right: 0,
            top: "25%",
            width: "10%",
            height: "50%",
            backgroundColor: "lightblue",
        }}
    >
        {"sidebar".split("").map((text) => (
            <View key={text} style={{ alignItems: "center" }}>
                <Text>{text}</Text>
            </View>
        ))}
    </View>
);
