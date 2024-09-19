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
    // const handleSubmit = () => {
    //     if (initialValues.isKYCSuccessful) {
    //         const valuesWithToken = {
    //             ...initialValues,
    //             // token: response.data.token,
    //             currentStep: 5,
    //             // isKYCSuccessful: response.data.isKycDone,
    //         };
    //         onNext(valuesWithToken);
    //     } else {
    //         try {
    //             // const response: any = await RemoteApi.post(
    //             //     verifyOtpApi,
    //             //     data
    //             // );

    //             const response = {
    //                 code: 200,
    //                 message: "Incorrect OTP", // Example API error message
    //             };

    //             console.log("response");
    //             console.log(response);

    //             if (response.code === 200) {
    //             } else {
    //                 // setIsVerifing(false); // Stop loading
    //                 console.log("ElseError");
    //             }
    //         } catch (error) {}
    //     }
    // };
    return (
        <>
            <View className="w-full gap-y-2">
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-[18px] font-bold"></Text>

                    <Pressable onPress={closeModal}>
                        <Icon name="close" size={14} color="#000" />
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
                {/* Display the success or failure icon */}
                <View className="flex flex-row justify-center pb-4">
                    {/* {initialValues.isKYCSuccessful ? ( */}
                    <Image
                        alt="Success"
                        source={imageSource()}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                    {/* ) : (
                    <Image
                        alt="Pending"
                        source={require("../../../assets/Exclude.svg")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                )} */}
                </View>

                {/* Display success or failure messages */}
                <View className="flex flex-col justify-center">
                    {/* {initialValues.isKYCSuccessful ? ( */}
                    <View>
                        <Text className={messageClass()}>{mainMessage}</Text>
                        <Text className="text-center text  p-2">
                            {subMessage}
                        </Text>
                    </View>
                    {/* ) : (
                    <>
                        <Text className="text-center text-[#F2BE0C] text-xl font-bold p-2">
                            KYC is Pending!
                        </Text>
                        <Text className="text-center text p-2">
                            Client’s KYC details does not exist, Please complete
                            his/her KYC.
                        </Text>
                    </>
                )} */}
                </View>

                {/* Display button with conditional text and action */}
                {/* <View style={styles.buttonRow}> */}
                {buttonText && (
                    // <Pressable
                    //         style={({ pressed }) => [
                    //             styles.skipButton,
                    //             { opacity: pressed ? 0.6 : 1 },
                    //         ]}
                    //         // You can add functionality for closing the modal or navigation here if needed
                    //     >
                    //         <Text style={styles.buttonText}>Close</Text>
                    //     </Pressable>
                    <View className="flex flex-row justify-center w-full ">
                        {/* <View className="w-[48%]">
                                    <CustomButton
                                        onPress={onPrevious}
                                        title="Save and Continue"
                                        disabled={false}
                                        buttonStyle={"outline"}
                                    />
                                </View> */}
                        <View className="w-[48%]">
                            <CustomButton
                                onPress={() => handleSubmit()}
                                title={buttonText}
                                // disabled={isVerifing === true}
                                buttonStyle={"full"}
                            />
                        </View>
                    </View>
                    // <Pressable
                    //     style={({ pressed }) => [
                    //         styles.saveButton,
                    //         { opacity: pressed ? 0.6 : 1 },
                    //     ]}
                    //     onPress={() => handleSubmit()} // Keep onNext for both conditions
                    // >
                    //     <Text style={styles.confirmButtonText}>
                    //         {/* {initialValues.isKYCSuccessful
                    //     ? "Add Nominee"
                    //     : "Notify Client"} */}
                    //         {buttonText}
                    //     </Text>
                    // </Pressable>
                )}
                {/* </View> */}
            </View>
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
