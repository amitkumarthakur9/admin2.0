import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import RemoteApi from "src/services/RemoteApi";

const ProceedSign = ({ onNext, onPrevious }) => {
    const [isLoadingState, setIsLoadingState] = useState(false);
    const [bankAddress, setBankAddress] = useState(null);

    async function getUserDetail() {
        setIsLoadingState(true);
        try {
            const response: any = await RemoteApi.get("user/me");
            if (response.code === 200) {
                setBankAddress(response.data);
            } else {
                alert("Failed to fetch state list");
            }
        } catch (error) {
            alert("An error occurred while fetching the state list");
        } finally {
            setIsLoadingState(false);
        }
    }

    useEffect(() => {
        getUserDetail();
        console.log(bankAddress);
    }, []);

    if (isLoadingState || !bankAddress) {
        return (
            <View>
                <Text>Loading.....</Text>
            </View>
        );
    } else {
        {
            console.log(bankAddress);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formRow}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Account Number*</Text>
                    <Text style={styles.input}>
                        {bankAddress
                            ? bankAddress?.bankAccount[0]?.accountNumber
                            : ""}
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Bank IFSC*</Text>
                    <Text style={styles.input}>
                        {bankAddress
                            ? bankAddress?.bankAccount[0]?.bankBranch.ifscCode
                            : ""}
                    </Text>
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Account Type*</Text>
                    <Text style={styles.input}>
                        {bankAddress
                            ? bankAddress?.bankAccount[0]?.bankAccountType.name
                            : ""}
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <>
                        <View className="flex flex-row py-1">
                            <Text className="pr-2 color-gray-600">
                                Bank Name:
                            </Text>
                            <Text className="">
                                {bankAddress
                                    ? bankAddress?.bankAccount[0]?.bank.name
                                    : ""}
                            </Text>
                        </View>
                        <View className="flex flex-row py-4">
                            <Text className="pr-2 color-gray-600">
                                Address:
                            </Text>
                            <Text className="">
                                {bankAddress
                                    ? bankAddress?.address[0]?.line1 +
                                      ", " +
                                      bankAddress?.address[0]?.line2 +
                                      ", " +
                                      bankAddress?.address[0]?.district?.name +
                                      ", " +
                                      bankAddress?.address[0]?.state.name +
                                      ", " +
                                      bankAddress?.address[0]?.pincode
                                    : ""}
                            </Text>
                        </View>
                    </>
                </View>
            </View>
            <View>
                <Text className="text-center color-[#114EA8] text-lg font-bold p-4">
                    Bank Verification Successful
                </Text>
            </View>
            <View className="flex flex-row justify-center gap-2">
                <View className="w-3/12">
                    <Pressable
                        style={({ pressed }) => [
                            styles.proceed,
                            {
                                borderColor: "#0066cc",
                                opacity: pressed ? 0.6 : 1,
                            },
                        ]}
                        onPress={() => onNext()}
                    >
                        <Text style={[styles.buttonText, { color: "#ffffff" }]}>
                            {"Proceed to E - Sign"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "#f2f2f2",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f2f2f2",
        color: "#333",
    },
    link: {
        color: "#0066cc",
        textDecorationLine: "underline",
        marginTop: 5,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    bankDetails: {
        marginVertical: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 500,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        width: "100%",
    },
    confirmButton: {
        width: "100%",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#114EA8",
    },
    confirmButtonDisabled: {
        backgroundColor: "gray",
    },
    confirmButtonText: {
        color: "#ffffff",
    },
    confirmButtonTextDisabled: {
        color: "lightgray",
    },
    error: {
        color: "red",
        marginTop: 5,
    },
    back: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
    buttonText: {
        fontSize: 16,
    },
});

export default ProceedSign;
