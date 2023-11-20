import { Slot } from 'expo-router';
import { SessionProvider } from '../src/services/ctx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';

export default function Root() {
    // Set up the auth context and render our layout inside of it.
    return (
        <SafeAreaProvider>
            <NativeBaseProvider>
                <SessionProvider>
                    <Slot />
                </SessionProvider>
            </NativeBaseProvider>
        </SafeAreaProvider>
    );
}
