import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
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
import { Button, useToast } from 'native-base'
import { ToastAlert } from '../src/helper/CustomToaster'


export default function SignIn() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const { signIn } = useSession();
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast();

    const onLoginPressed = async () => {
        setIsLoading(true)
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
            const response: any = await RemoteApi.post("/user/login", {
                email: email.value, password: password.value
            });

            if (response.message == "Success") {
                signIn(response.token)
                router.replace('/');
            } else {
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach((error, index) => {
                        toast.show({
                            render: ({
                                index
                            }) => {
                                return <ToastAlert
                                    id={index}
                                    variant={"solid"}
                                    title={error.message}
                                    description={""}
                                    isClosable={true}
                                    toast={toast}
                                    status={"error"}
                                />;
                            },
                            placement: "top"

                        })
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false)


    }

    return (
        <Background>
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
                onChangeText={(text: string) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            <Button isLoading={isLoading} isLoadingText="Logging In" marginTop={6} width={40} bgColor={"#013974"} onPress={onLoginPressed}>
                Login
            </Button>
        </Background>
    )
}
