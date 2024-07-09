import React from "react";
import { View, Text } from "react-native";
import { Image } from "native-base";

const Success = ({ successMessages = [], failedMessages = [] }) => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* <View className="flex flex-row  justify-center pb-4">
                <Image
                    className=""
                    alt="ico"
                    source={require("../../../assets/images/Tick.png")}
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
            </View> */}

            <View className="flex flex-col justify-center md:pt-8">
                {successMessages.map((message, index) => (
                    <Text
                        key={`success-${index}`}
                        style={{
                            color: "green",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </Text>
                ))}
                {failedMessages.map((message, index) => (
                    <Text
                        key={`failed-${index}`}
                        style={{
                            color: "red",
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default Success;
