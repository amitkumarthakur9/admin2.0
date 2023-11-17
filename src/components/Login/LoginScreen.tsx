import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Background from '../Others/Background'
import Logo from '../Others/Logo'
import Header from '../Others/Header'
import TextInput from '../Others/TextInput'
import { emailValidator } from '../../helper/emailValidator'
import { passwordValidator } from '../../helper/passwordValidator'
import BackButton from '../Others/BackButton'


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })

    const onLoginPressed = () => {
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            return
        }
        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Dashboard' }],
        // })
    }

    return (
        <View>
            {/* <BackButton goBack={navigation.goBack} /> */}
            <BackButton goBack={{}} />
            <Logo />
            <Header>Welcome back.</Header>
            <TextInput
                description={""}
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                description={""}
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            {/* <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ResetPasswordScreen')}
                >
                    <Text selectable style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View> */}
            <Button style={{}} mode="contained" onPress={onLoginPressed}>
                Login
            </Button>
            <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => { }}>
                    {/* <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}> */}
                    <Text selectable style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: "black",
    },
    link: {
        fontWeight: 'bold',
        color: "black",
    },
})