import React from "react";
import { useStorageState } from "./useStorageState";
import RemoteApi from "./RemoteApi";
import { router } from "expo-router";

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
    const [[isLoadingUserData, userDataString], setUserData] = useStorageState("userData");
    const userData: UserData | null = userDataString ? JSON.parse(userDataString) : null;


    return (
        <AuthContext.Provider
            value={{
                signIn: (token, data) => {
                    // Perform sign-in logic here
                    setToken(token);
                    setUserData(JSON.stringify(data));
                },
                signOut: () => {
                    setToken(null);
                    setUserData(null); 
                    router.push("/sign-in");
                },
                token,
                isLoading,
                userData,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
