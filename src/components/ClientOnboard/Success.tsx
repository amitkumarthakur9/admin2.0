import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "native-base";

const Success = ({ isKYCSuccessful, onNext }) => {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {/* Display the success or failure icon */}
            <View className="flex flex-row justify-center pb-4">
                {isKYCSuccessful ? (
                    <Image
                        alt="Success"
                        source={require("../../../assets/images/Tick.png")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                ) : (
                    <Image
                        alt="Pending"
                        source={require("../../../assets/Exclude.svg")}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                )}
            </View>

            {/* Display success or failure messages */}
            <View className="flex flex-col justify-center">
                {isKYCSuccessful ? (
                    <View>
                        <Text className="text-center color-[#009429] text-xl font-bold p-2">
                            Client’s KYC Verification is Successful!
                        </Text>
                        <Text className="text-center text  p-2">
                            Please save your nominee details now.
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text className="text-center text-[#F2BE0C] text-xl font-bold p-2">
                            KYC is Pending!
                        </Text>
                        <Text className="text-center text p-2">
                            KYC Pending for approval
                        </Text>
                    </>
                )}
            </View>

            {/* Display button with conditional text and action */}
            {/* <View style={styles.buttonRow}> */}

            {/* <Pressable
                    style={({ pressed }) => [
                        styles.skipButton,
                        { opacity: pressed ? 0.6 : 1 },
                    ]}
                    // You can add functionality for closing the modal or navigation here if needed
                >
                    <Text style={styles.buttonText}>Close</Text>
                </Pressable> */}
            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    { opacity: pressed ? 0.6 : 1 },
                ]}
                onPress={() => onNext()} // Keep onNext for both conditions
            >
                <Text style={styles.confirmButtonText}>
                    {isKYCSuccessful ? "Add Nominee" : "Complete KYC"}
                </Text>
            </Pressable>
            {/* </View> */}
        </View>
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
