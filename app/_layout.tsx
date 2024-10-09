import { Slot } from "expo-router";
import Head from "expo-router/head";

import { SessionProvider } from "../src/services/ctx";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { Provider as PaperProvider } from "react-native-paper";
import InjectScript from "./InjectScript";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function Root() {
    // Set up the auth context and render our layout inside of it.
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <NativeBaseProvider>
                    <PaperProvider>
                        <Provider store={store}>
                            <SessionProvider>
                                <Slot />
                                <Head>
                                    <meta
                                        name="description"
                                        content="This is my blog."
                                    />
                                </Head>
                                <InjectScript />
                            </SessionProvider>
                        </Provider>
                    </PaperProvider>
                </NativeBaseProvider>
            </SafeAreaProvider>
        </SafeAreaView>
    );
}
