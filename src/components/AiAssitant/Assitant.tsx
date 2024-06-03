import React from "react";
import { Button, Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";

const CoRoverURL =
    "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/";

const Assitant = () => {
    const { height, width } = useWindowDimensions();
    const ViewHeight = height * 0.90;
    const openWebBrowser = async () => {
        let result = await WebBrowser.openBrowserAsync(
            "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/"
        );
        console.log(result);
    };

    return (
        <>
            {/* <View style={styles.container}>
      <Button title="Open Web Browser" onPress={openWebBrowser} />
    </View> */}
            <View className="h-full">
                <View className={`w-[${width}]`}>
                    {Platform.OS === "web" ? (
                        <iframe
                            src={CoRoverURL}
                            style={{ height: ViewHeight }}
                            title="Embedded Web Content"
                        />
                    ) : (
                        <WebView source={{ CoRoverURL }} />
                    )}
                </View>
            </View>
        </>
    );
};

export default Assitant;
