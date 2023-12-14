import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value?: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, undefined],
): UseStateHook<T> {
    return React.useReducer(
        (state: [boolean, T | null], action: T | null = null) => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

// export async function setStorageItemAsync(key: string, value: string | null) {
//     if (Platform.OS === 'web') {
//         try {
//             if (value === null) {
//                 localStorage.removeItem(key);
//                 // Cookies.remove(key);
//             } else {
//                 localStorage.setItem(key, value);
//                 // Cookies.set(key, value, { expires: 1 });
//             }
//         } catch (e) {
//             console.error('Local storage is unavailable:', e);
//         }
//     } else {
//         if (value == null) {
//             await SecureStore.deleteItemAsync(key);
//         } else {
//             await SecureStore.setItemAsync(key, value);
//         }
//     }
// }

export function useStorageState(key: any): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    React.useEffect(() => {
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    setState(localStorage.getItem(key));
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        } else {
            // SecureStore.getItemAsync(key).then(value => {
            //     setState(value);
            // });
            AsyncStorage.getItem(key).then(value => {
                // console.log("token", value);

                setState(value);
            });
        }
    }, [key]);

    // Set
    const setValue = React.useCallback(
        async (value: string | null) => {
            // console.log('checkingggg-->', value);

            // setStorageItemAsync(key, value).then(() => {
            //     setState(value);
            // });
            if (value) {
                AsyncStorage.setItem(key, value).then(() => {
                    // console.log('token3', value);

                    setState(value);
                });
            } else {
                AsyncStorage.removeItem(key).then(() => {
                    // console.log('token3', value);

                    setState(value);
                });
            }

        }, [key]
    );

    return [state, setValue];
}
