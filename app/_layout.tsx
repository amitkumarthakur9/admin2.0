import { Slot } from "expo-router";
import { SessionProvider } from "../src/services/ctx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { Provider as PaperProvider } from "react-native-paper";

export default function Root() {
    // Set up the auth context and render our layout inside of it.
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NativeBaseProvider>
                <PaperProvider>
                    <SessionProvider>
                        <Slot />
                    </SessionProvider>
                    </PaperProvider>

                </NativeBaseProvider>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}
