import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import {
    
    Image,
} from "native-base";

const Success = ({ message = "Try Again", code }) => {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View className="flex flex-row  justify-center pb-4">
                <Image
                    className=""
                    alt="ico"
                    source={require("../../../assets/images/Tick.png")}
                    style={{
                        // flex: 1,
                        // justifyContent: 'end',
                        width: 100, // specify the desired width
                        height: 100,
                    }}
                />
            </View>

            <View className="flex flex-row justify-center md:pt-8">
                {code == 200 ? (
                    <Text
                        style={{
                            color: message.startsWith("Download Success")
                                ? "green"
                                : "red",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </Text>
                ) : (
                    <Text className="text-center font-semibold color-[#114EA8]">
                        {message}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default Success;
