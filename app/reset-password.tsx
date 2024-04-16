import React, { useState } from "react";
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
import { ToastAlert } from "../src/helper/CustomToaster";
import Icon from "react-native-vector-icons/FontAwesome";
import ForgotPassword from "../src/components/Password/ForgotPassword";
import ResetPassword from "../src/components/Password/ResetPassword";

export default function ResetPasswordScreen() {
    const [email, setEmail] = useState({ value: "", error: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState({ value: "", error: "" });
    const { signIn } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { height, width } = useWindowDimensions();
    // console.log('in login------');
    const onLoginPressed = async () => {
        // console.log('clicked');

        setIsLoading(true);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setIsLoading(false);
            return;
        }

        // console.log(process.env.API_ENDPOINT);

        try {
            const response: any = await RemoteApi.post("/user/login", {
                email: email.value,
                password: password.value,
                // email: "bhupendrajogi@gmail.com", password: "US me bohot jagha gaye hai"
            });

            console.log("response", response);

            if (response.message == "Success") {
                signIn(response.token, response.data);
                router.replace("/orders");
                setIsLoggedIn(true);
            } else {
                if (response.errors && response.errors.length > 0) {
                    response.errors.forEach((error, index) => {
                        toast.show({
                            render: ({ index }) => {
                                return (
                                    <ToastAlert
                                        id={index}
                                        variant={"solid"}
                                        title={error.message}
                                        description={""}
                                        isClosable={true}
                                        toast={toast}
                                        status={"error"}
                                    />
                                );
                            },
                            placement: "top",
                        });
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };
    const [show, setShow] = useState(false);
    

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
                    
                    <ResetPassword />
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
