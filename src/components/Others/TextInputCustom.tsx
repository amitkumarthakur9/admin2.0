import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input, MD3Colors } from 'react-native-paper'
// import { theme } from '../core/theme'

export default function TextInputCustom({ errorText, description, ...props }) {
    return (
        <View className='my-4'>
            <Input
                // className='border-[0.2px] border-black'
                style={styles.input}
                selectionColor={"white"}
                underlineColor="transparent"
                mode="outlined"
                {...props}
                theme={{ roundness: 0, mode: "adaptive" }}

            />
            {description && !errorText ? (
                <Text selectable style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text selectable style={styles.error}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({

    input: {
        backgroundColor: "white",
        borderRadius: 2,
        borderColor: "0px solid black"
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
})