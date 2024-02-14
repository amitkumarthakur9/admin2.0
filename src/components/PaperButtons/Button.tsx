import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button as PaperButton } from "react-native-paper";
// import { theme } from '../core/theme'

interface args {
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
    style?: ViewStyle;
    props?: any;
}

export default function Button({ mode, style, ...props }: args) {
    return (
        <PaperButton
            children
            style={[
                styles.button,
                mode === "outlined" && { backgroundColor: "black" },
                style,
            ]}
            labelStyle={styles.text}
            mode={mode}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        marginVertical: 10,
        paddingVertical: 2,
    },
    text: {
        fontWeight: "bold",
        fontSize: 15,
        lineHeight: 26,
    },
});
