import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView, Text, Image, useWindowDimensions } from 'react-native'
import Background from '../src/components/Others/Background'
import Logo from '../src/components/Others/Logo'
import Header from '../src/components/Others/Header'
import TextInput from '../src/components/Others/TextInput'
import { emailValidator } from '../src/helper/emailValidator'
import { passwordValidator } from '../src/helper/passwordValidator'
import BackButton from '../src/components/Others/BackButton'
import { useSession } from '../src/services/ctx'
import { Redirect, router } from 'expo-router'
import RemoteApi from '../src/services/RemoteApi'
import { AuthInterface } from '../src/interfaces/AuthInterface'
import ApiRequest from '../src/services/NewRemoteApi'
import { Box, Button, Center, FormControl, Input, Pressable, Stack, WarningOutlineIcon, useToast } from 'native-base'
import { ToastAlert } from '../src/helper/CustomToaster'
import Icon from 'react-native-vector-icons/FontAwesome';


export default function SignIn() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [password, setPassword] = useState({ value: '', error: '' })
    const { signIn } = useSession();
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast();
    const { height, width } = useWindowDimensions();
    // console.log('in login------');
    const onLoginPressed = async () => {
        // console.log('clicked');

        setIsLoading(true)
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            setIsLoading(false)
            return
        }

        // console.log(process.env.API_ENDPOINT);

        try {
            const response: any = await RemoteApi.post("/user/login", {
                // email: email.value, password: password.value
                email: "bhupendrajogi@gmail.com", password: "US me bohot jagha gaye hai"
            });

            console.log("response", response);


            if (response.message == "Success") {
                signIn(response.token)
                router.replace('/orders');
                setIsLoggedIn(true)
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
    const [show, setShow] = useState(false);
    // return <>

    //     {!isLoggedIn ? <Background>
    //         <Logo />
    //         <Header className="text-black">Welcome back.</Header>
    //         <TextInput
    //             description={""}
    //             label="Email"
    //             returnKeyType="next"
    //             value={email.value}
    //             onChangeText={(text) => setEmail({ value: text, error: '' })}
    //             error={!!email.error}
    //             errorText={email.error}
    //             autoCapitalize="none"
    //             autoCompleteType="email"
    //             textContentType="emailAddress"
    //             keyboardType="email-address"

    //         />
    //         <TextInput
    //             description={""}
    //             label="Password"
    //             returnKeyType="done"
    //             value={password.value}
    //             onChangeText={(text: string) => setPassword({ value: text, error: '' })}
    //             error={!!password.error}
    //             errorText={password.error}
    //             secureTextEntry

    //         />
    //         <Button isLoading={isLoading} isLoadingText="Logging In" marginTop={6} width={40} bgColor={"#013974"} onPress={onLoginPressed}>
    //             Login
    //         </Button>
    //     </Background>
    //         : <Redirect href="/" />
    //     }

    // </>

    return <View className='' style={{ height }}>
        <Background />

        <ScrollView automaticallyAdjustKeyboardInsets={true}>

            <View className='flex flex-col items-center justify-center pb-[100px]' style={{ position: "absolute", left: 0, right: 0, top: 150 }}>
                <Logo />
                <Header className="text-black">Welcome back.</Header>
                <Box w={{
                    base: "75%",
                    md: "60%",
                    sm: "75%",
                    lg: "60%"
                }} alignItems="center" my={5}>
                    <FormControl isInvalid={!!email.error}>
                        {/* <FormControl.Label>Password</FormControl.Label> */}
                        <Input
                            autoCapitalize="none"
                            returnKeyType="next"
                            autoComplete="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            placeholder="Email"
                            value={email.value}
                            onChangeText={(text) => setEmail({ value: text, error: '' })}
                        />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Try different from previous passwords.
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Box>

                <Box w={{
                    base: "75%",
                    md: "60%",
                    sm: "75%",
                    lg: "60%"
                }} alignItems="center">
                    <FormControl isInvalid={!!password.error}>
                        {/* <FormControl.Label>Password</FormControl.Label> */}
                        <Input
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={(text: string) => setPassword({ value: text, error: '' })}
                            type={show ? "text" : "password"}
                            InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                <Icon name={show ? "eye" : "eye-slash"} style={{ marginHorizontal: 10 }} size={14} color="#484848" />
                            </Pressable>} placeholder="Password" />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Try different from previous passwords.
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Box>


                {/* <Input
                    type="text"
                    marginY={3}
                    w={{
                        base: "75%",
                        md: "25%"
                    }} placeholder="Email" />
                <Input
                    w={{
                        base: "75%",
                        md: "25%"
                    }}
                    type={show ? "text" : "password"}
                    InputRightElement={<Pressable onPress={() => setShow(!show)}>
                        <Icon name={show ? "eye" : "eye-slash"} style={{ marginRight: 10 }} size={14} color="#484848" />
                    </Pressable>} placeholder="Password" /> */}
                <Button isLoading={isLoading} isLoadingText="Logging In" marginTop={6} width={40} bgColor={"#013974"} onPress={onLoginPressed}>
                    Login
                </Button>
            </View>
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    scrollViewContent: {
        // flexGrow: 1,
        // flex: 1,
        display: "flex",
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
});