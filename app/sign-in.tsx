import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import Background from '../src/components/Others/Background'
import Logo from '../src/components/Others/Logo'
import Header from '../src/components/Others/Header'
import TextInput from '../src/components/Others/TextInput'
import { emailValidator } from '../src/helper/emailValidator'
import { passwordValidator } from '../src/helper/passwordValidator'
import BackButton from '../src/components/Others/BackButton'
import { useSession } from '../src/services/ctx'
import { router } from 'expo-router'
import RemoteApi from '../src/services/RemoteApi'
import { AuthInterface } from '../src/interfaces/AuthInterface'
import ApiRequest from '../src/services/NewRemoteApi'


export default function SignIn() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const { signIn } = useSession();

    const onLoginPressed = async () => {
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
        // console.log(process.env.API_ENDPOINT);

        try {
            const response: AuthInterface = await RemoteApi.post("/user/login", {
                email: email.value, password: password.value
            });

            if (response.message == "Success") {
                signIn(response.token)
            }
        } catch (err) {
            console.log(err);
        }
        router.replace('/');
    }

    return (
        <Background>
            {/* <BackButton goBack={navigation.goBack} /> */}
            <Logo />
            <Header className="text-black">Welcome back.</Header>
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
                    onPress={() => router.replace("/forgot-password")}
                >
                    <Text selectable style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View> */}
            <Button style={{ backgroundColor: "#013974" }} mode="contained" onPress={onLoginPressed}>
                Login
            </Button>
            {/* <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/register")}>
                    <Text selectable style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View> */}
        </Background>
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