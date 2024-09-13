import React, { useState, useEffect, useCallback } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    useWindowDimensions,
} from "react-native";
import Background from "../src/components/Others/Background";
import Logo from "../src/components/Others/Logo";
import Header from "../src/components/Others/Header";
import TextInput from "../src/components/Others/TextInput";
import { emailValidator } from "../src/helper/emailValidator";
import { passwordValidator } from "../src/helper/passwordValidator";
import BackButton from "../src/components/Others/BackButton";
import { useSession } from "../src/services/ctx";
import { Redirect, router } from "expo-router";
import RemoteApi from "../src/services/RemoteApi";
import { AuthInterface } from "../src/interfaces/AuthInterface";
import ApiRequest from "../src/services/NewRemoteApi";
import {
    Box,
    Button,
    Center,
    FormControl,
    Input,
    Pressable,
    Stack,
    WarningOutlineIcon,
    useToast,
} from "native-base";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import GoogleRecaptchaV3 from "../src/components/ReCaptcha";
import { ToastAlert } from "../src/helper/CustomToaster";
import Icon from "react-native-vector-icons/FontAwesome";
import ForgotPassword from "../src/components/Password/ForgotPassword";

export default function SignIn() {
    const [email, setEmail] = useState({ value: "", error: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState({ value: "", error: "" });
    const { signIn } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { height, width } = useWindowDimensions();
    const [token, setToken] = useState(null);
    const [gtoken, setGtoken] = useState(null);
    const onLoginPressed = async () => {
        setIsLoading(true);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setIsLoading(false);
            return;
        }

        try {
            const response: any = await RemoteApi.post("/user/login", {
                email: email.value,
                password: password.value,
                pass: "SkipRecaptcha",
                recaptchaToken: gtoken,
            });

            if (response?.message == "Success") {
                signIn(response?.token, response?.data);
                router.replace("/orders");
                setIsLoggedIn(true);
            } else {
                if (response.errors && response.errors.length > 0) {
                    // response.errors.forEach((error, index) => {
                    toast.show({
                        render: ({ index }) => {
                            return (
                                <ToastAlert
                                    id={index}
                                    variant={"solid"}
                                    title={response.message}
                                    description={""}
                                    isClosable={true}
                                    toast={toast}
                                    status={"error"}
                                />
                            );
                        },
                        placement: "top",
                    });
                }

                
                if(response?.errors[0]?.message.includes("password")){
                    setPassword({ ...email, error: response?.errors[0]?.message });
                }else{
                    setEmail({ ...email, error: response?.errors[0]?.message });
                }
               
            }
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };
    const [show, setShow] = useState(false);

    const handleKeyPress = useCallback(
        (event) => {
            if (event.key === "Enter") {
                onLoginPressed();
            }
        },
        [onLoginPressed]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <View className="" style={{ height, backgroundColor: "white" }}>
            <Background />

            <ScrollView automaticallyAdjustKeyboardInsets={true} style={{}}>
                <View
                    className="flex flex-col items-center justify-center pb-[100px]"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 150,
                    }}
                >
                    <Logo />
                    <Header className="text-black">Welcome back.</Header>
                    <Box
                        w={{
                            base: "75%",
                            md: "60%",
                            sm: "75%",
                            lg: "60%",
                        }}
                        alignItems="center"
                        my={5}
                    >
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
                                onChangeText={(text) =>
                                    setEmail({ value: text, error: "" })
                                }
                                onKeyPress={handleKeyPress}
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                {email.error}
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </Box>

                    <Box
                        w={{
                            base: "75%",
                            md: "60%",
                            sm: "75%",
                            lg: "60%",
                        }}
                        alignItems="center"
                    >
                        <FormControl isInvalid={!!password.error}>
                            {/* <FormControl.Label>Password</FormControl.Label> */}
                            <Input
                                returnKeyType="done"
                                value={password.value}
                                onChangeText={(text: string) =>
                                    setPassword({ value: text, error: "" })
                                }
                                type={show ? "text" : "password"}
                                InputRightElement={
                                    <Pressable onPress={() => setShow(!show)}>
                                        <Icon
                                            name={show ? "eye" : "eye-slash"}
                                            style={{ marginHorizontal: 10 }}
                                            size={14}
                                            color="#484848"
                                        />
                                    </Pressable>
                                }
                                placeholder="Password"
                                onKeyPress={handleKeyPress}
                            />
                            <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                {password.error}
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </Box>

                    <Box
                        w={{
                            base: "75%",
                            md: "60%",
                            sm: "75%",
                            lg: "60%",
                        }}
                        alignItems="center"
                    >
                        <FormControl isInvalid={!!password.error}>
                            <GoogleReCaptchaProvider
                                useRecaptchaNet
                                reCaptchaKey="6Lcf0SUqAAAAAIsMoed1c16vYiq7g_K--2uSov3h"
                                scriptProps={{
                                    async: true,
                                    defer: true,
                                    appendTo: "body",
                                }}
                            >
                                <GoogleRecaptchaV3 updateToken={setGtoken} />
                            </GoogleReCaptchaProvider>
                        </FormControl>
                    </Box>
                    <Button
                        isLoading={isLoading}
                        isLoadingText="Logging In"
                        marginTop={6}
                        width={40}
                        bgColor={"#013974"}
                        onPress={onLoginPressed}
                    >
                        Login
                    </Button>
                    <ForgotPassword />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        // flexGrow: 1,
        // flex: 1,
        display: "flex",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
    },
});
