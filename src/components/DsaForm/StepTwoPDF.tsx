import React from "react";
import {
    View,
    Text,
    Button,
    Platform,
    useWindowDimensions,
} from "react-native";
const CoRoverURL =
    "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/";

const StepTwoPDF = ({ onNext }) => {
    const { height, width } = useWindowDimensions();
    const ViewHeight = height * 0.9;
    return (
        <View style={{ flex: 1 }}>
            <View className={`w-[${width}]`}>
                {Platform.OS === "web" ? (
                    <iframe
                        src={CoRoverURL}
                        style={{ height: ViewHeight }}
                        title="Embedded Web Content"
                    />
                ) : (
                    <View>Not available on App</View>
                )}
                <Button title="E-sign and Submit" onPress={onNext} />
            </View>
        </View>
    );
};

export default StepTwoPDF;
