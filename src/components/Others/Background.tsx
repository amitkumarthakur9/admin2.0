import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, View, Platform } from 'react-native'
// import { theme } from '../core/theme'

export default function Background({ children }) {
    return (
        // <View></View>
        <ImageBackground
            source={require('../../../assets/background_dot.png')}
            resizeMode="repeat"
            style={styles.background}
        >
            {/* <KeyboardAvoidingView className='w-4/6 lg:w-3/6' style={styles.container} behavior={Platform.OS == "web" ? undefined : 'height'}> */}
            <View className='flex flex-row w-full justify-center overflow-hidden h-full items-center'>
                <KeyboardAvoidingView className='w-4/6 lg:w-3/6 items-center' behavior='height'>

                    {children}

                </KeyboardAvoidingView>
            </View>

            {/* </KeyboardAvoidingView> */}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: "100%",
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        // padding: 20,
        // width: '60%',
        // maxWidth: "340",
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
})