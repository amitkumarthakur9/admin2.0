import React, { useState, useEffect } from "react";
import { useStorageState } from "./useStorageState";
import RemoteApi from "./RemoteApi";
import { router } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { useToast } from "native-base";
import { ToastAlert } from "src/helper/CustomToaster";

const AuthContext = React.createContext<{
    signIn: (token: string, userData: UserData) => void;
    signOut: () => void;
    token?: string | null;
    isLoading: boolean;
    userData: UserData;
} | null>(null);

interface UserData {
    _id: string;
    name: string;
    role: {
        id: number;
        name: string;
        roleType: {
            id: number;
            name: string;
        };
    };
}

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error(
                "useSession must be wrapped in a <SessionProvider />"
            );
        }
    }
    // console.log(value);

    return value;
}

export function SessionProvider(props) {
    const [[isLoading, token], setToken] = useStorageState("token");
    // console.log('session provider', token);
    const [[isLoadingUserData, userDataString], setUserData] =
        useStorageState("userData");
    const userData: UserData | null = userDataString
        ? JSON.parse(userDataString)
        : null;
    const [isLogout, setIsLogout] = useState(false);
    const toast = useToast();

    const handleSignout = async () => {
        setIsLogout(true);
        try {
            const response: any = await RemoteApi.put("/user/logout", {});

            // const response: any = await simulateApiResponse();
            console.log("response", response);

            if (response.message == "Success") {
                // setIsErrorModalVisible(false);
                setToken(null);
                console.log("setlogouttoken");
                console.log(token);
                setUserData(null);
                setIsLogout(false);
                window.location.reload();

                // router.push("/sign-in");
            } else {
                setIsLogout(false);
                // setIsErrorModalVisible(false);
                // setToken(null);
                // setUserData(null);
                // setIsErrorModalVisible(true);
                if (response) {
                    // response.errors.forEach((error, index) => {
                    toast.show({
                        render: ({ index }) => {
                            return (
                                <ToastAlert
                                    id={index}
                                    variant={"solid"}
                                    title={"unable to logout try again"}
                                    description={""}
                                    isClosable={true}
                                    toast={toast}
                                    status={"error"}
                                />
                            );
                        },
                        placement: "top",
                    });
                    // });
                }
            }
        } catch (err) {
            setIsLogout(false);
            console.log(err);
            // setIsErrorModalVisible(false);
            // setToken(null);
            // setUserData(null);
            // setIsErrorModalVisible(true);
            toast.show({
                render: ({ id }) => {
                    return (
                        <ToastAlert
                            id={id}
                            variant={"solid"}
                            title="Unable to log out"
                            description={err.message}
                            isClosable={true}
                            toast={toast}
                            status={"error"}
                        />
                    );
                },
                placement: "top",
            });
        }
    };

    // useEffect(() => {
    //     if (token === null && userData === null && isLogout) {
    //         setIsLogout(false);
    //         window.location.reload();
    //     }
    // }, [token, userData, isLogout]);

    return (
        <AuthContext.Provider
            value={{
                signIn: (token, data) => {
                    // Perform sign-in logic here
                    setToken(token);
                    setUserData(JSON.stringify(data));
                },
                signOut: handleSignout,
                token,
                isLoading,
                userData,
            }}
        >
            {isLogout ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Logging off...</Text>
                </View>
            ) : (
                props.children
            )}
        </AuthContext.Provider>
    );
}
