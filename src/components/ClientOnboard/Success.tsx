import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../Buttons/CustomButton";

const Success = ({
    initialValues,
    onNext,
    success,
    mainMessage,
    subMessage,
    buttonText,
    handleSubmit,
    closeModal,
}) => {
    const imageSource = () => {
        if (!success) {
            return require("../../../assets/Exclude.svg");
        } else {
            return require("../../../assets/images/Tick.png");
        }
    };

    const messageClass = () => {
        if (success) {
            return "text-center color-[#009429] text-xl font-bold p-2";
        } else {
            return "text-center color-[#F2BE0C] text-xl font-bold p-2";
        }
    };

    return (
        <>
            <View className="w-full gap-y-2">
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-[18px] font-bold"></Text>

                    <Pressable onPress={closeModal}>
                        <Icon name="close" size={20} color="#000" />
                    </Pressable>
                </View>

                <Text className="text-[12px]"></Text>
            </View>

            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View className="flex flex-row justify-center pb-4">
                    <Image
                        alt="Success"
                        source={imageSource()}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </View>

                <View className="flex flex-col justify-center">
                    <View>
                        <Text className={messageClass()}>{mainMessage}</Text>
                        <Text className="text-center text  p-2">
                            {subMessage}
                        </Text>
                    </View>
                </View>
            </View>
            {buttonText && (
                <View className="flex flex-row justify-between w-full ">
                    <View className="w-[48%]">
                        <CustomButton
                            onPress={closeModal}
                            title="Close"
                            disabled={false}
                            buttonStyle={"outline"}
                        />
                    </View>
                    <View className="w-[48%]">
                        <CustomButton
                            onPress={() => handleSubmit()}
                            title={buttonText}
                            // disabled={isVerifing === true}
                            buttonStyle={"full"}
                        />
                    </View>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    skipButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "#0066cc",
        width: "48%",
    },
    saveButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "48%",
    },
    buttonText: {
        fontSize: 16,
        color: "#0066cc",
    },
    confirmButtonText: {
        fontSize: 16,
        color: "#fff",
    },
});

export default Success;
