import React from 'react';
import { useStorageState } from './useStorageState';
import RemoteApi from './RemoteApi';
import { router } from 'expo-router';

const AuthContext = React.createContext<{ signIn: (token: string) => void; signOut: () => void; token?: string | null, isLoading: boolean } | null>(null);

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    // console.log(value);

    return value;
}

export function SessionProvider(props) {
    const [[isLoading, token], setToken] = useStorageState('token');
    // console.log('session provider', token);

    return (
        <AuthContext.Provider
            value={{
                signIn: (token) => {
                    // Perform sign-in logic here
                    setToken(token);
                },
                signOut: () => {
                    setToken(null);
                    router.push('/sign-in');
                },
                token,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
