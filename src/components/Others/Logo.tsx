import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Logo() {
    // return <View></View>
    return (
        <Image
            source={require("../../../assets/Fundexpertlogo.png")}
            style={styles.image}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 110,
        marginBottom: 8,
        objectFit: "scale-down",
    },
});
