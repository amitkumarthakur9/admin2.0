import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
// import { theme } from '../core/theme'

export default function TextInput({ errorText, description, ...props }) {
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                selectionColor={"white"}
                underlineColor="transparent"
                mode="outlined"
                {...props}
            />
            {description && !errorText ? (
                <Text selectable style={styles.description}>
                    {description}
                </Text>
            ) : null}
            {errorText ? (
                <Text selectable style={styles.error}>
                    {errorText}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginVertical: 12,
    },
    input: {
        backgroundColor: "white",
    },
    description: {
        fontSize: 13,
        color: "white",
        paddingTop: 8,
    },
    error: {
        fontSize: 13,
        color: "red",
        paddingTop: 8,
    },
});
