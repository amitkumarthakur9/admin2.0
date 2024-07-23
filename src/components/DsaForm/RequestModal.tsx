import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "src/services/RemoteApi";

const RequestModal = ({
    visible,
    onClose,
    type,
    clientId,
    onSubmit,
    getDataList,
    onBack,
}) => {
    const [approveInput, setApproveInput] = useState("");
    const [rejectInput, setRejectInput] = useState("");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!visible) {
            setApproveInput("");
            setRejectInput("");
            setMessage(null);
            getDataList();
        }
    }, [visible]);

    useEffect(() => {}, [message]);

    const handleApproveSubmit = async () => {
        try {
            const data = {
                requestId: clientId,
                dscCode: approveInput,
            };

            const response = await RemoteApi.post(
                "distributor-onboard/approve-request",
                data
            );

            if (response.code == 200) {
                setMessage("Submitted successfully");
            } else {
                setMessage("Request failed");
            }
        } catch (error) {
            setMessage("Request failed");
        }
    };

    const handleRejectSubmit = async () => {
        try {
            const data = {
                requestId: clientId,
                remark: rejectInput,
            };

            const checkdata = {
                requestId: clientId,
                name: true, //Optional
                email: true, //Optional
                mobileNumber: true, //Optional
                arnNumber: true, //Optional
                euinNumber: true, //Optional
                esignedDocument: true, //Optional
                aadharFrontDocument: true, //Optional
                aadharBackDocument: true, //Optional
                panCardDocument: true, //Optional
                cancelledCheque: true, //Optional
                addressLineError: false,
                countryError: false,
                stateError: false,
                cityError: false,
                pinCodeError: false,
                panError: false,
            };

            const response1 = await RemoteApi.post(
                "distributor-onboard/reject-request",
                data
            );

            const response2 = await RemoteApi.post(
                "distributor-onboard/reject-reason",
                checkdata
            );

            await Promise.all([response1, response2]);

            if (response1.code == 200 && response2.code == 200) {
                setMessage("Submitted successfully");
            } else {
                setMessage("Request failed");
            }
        } catch (error) {
            setMessage("Request failed");
        }
    };

    const getMessageStyle = () => {
        return message === "Submitted successfully"
            ? styles.successMessage
            : styles.errorMessage;
    };

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Icon name="close" size={20} color="#7C899C" />
                    </TouchableOpacity>
                    <View className="w-full p-4">
                        {!message ? (
                            <>
                                <Text style={styles.title}>
                                    {type === "approve"
                                        ? "Approve Request"
                                        : "Reject Request"}
                                </Text>
                                <Text style={styles.label}>
                                    {type === "approve"
                                        ? "DSA Code*"
                                        : "Remarks*"}
                                </Text>

                                {type === "approve" ? (
                                    <TextInput
                                        style={styles.input}
                                        value={approveInput}
                                        onChangeText={setApproveInput}
                                    />
                                ) : (
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        style={styles.input}
                                        value={rejectInput}
                                        onChangeText={setRejectInput}
                                    />
                                )}

                                <View style={styles.buttonContainer}>
                                    {type === "reject" && (
                                        <Pressable
                                            style={[
                                                styles.button,
                                                styles.backButton,
                                            ]}
                                            onPress={onBack}
                                        >
                                            <Text style={styles.backButtonText}>
                                                Back
                                            </Text>
                                        </Pressable>
                                    )}
                                    <Pressable
                                        style={[
                                            styles.button,
                                            type === "approve"
                                                ? styles.approveButton
                                                : styles.rejectButton,
                                        ]}
                                        onPress={
                                            type === "approve"
                                                ? handleApproveSubmit
                                                : handleRejectSubmit
                                        }
                                    >
                                        <Text
                                            style={
                                                type === "approve"
                                                    ? styles.approveButtonText
                                                    : styles.rejectButtonText
                                            }
                                        >
                                            {type === "approve"
                                                ? "Approve"
                                                : "Reject"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            <Text style={[styles.message, getMessageStyle()]}>
                                {message}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        width: 400,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    title: {
        fontSize: 18,
        fontWeight: "semibold",
        marginBottom: 20,
        textAlign: "left",
        width: "100%",
    },
    label: {
        fontSize: 12,
        fontWeight: "400",
        marginBottom: 10,
        textAlign: "left",
        width: "100%",
        color: "#97989B",
    },
    input: {
        width: "100%",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        textAlign: "center",
    },
    successMessage: {
        color: "green",
    },
    errorMessage: {
        color: "red",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        width: "48%",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
    },
    approveButton: {
        backgroundColor: "#114EA8",
    },
    rejectButton: {
        backgroundColor: "#114EA8",
    },
    backButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#114EA8",
    },
    approveButtonText: {
        color: "#ffffff",
    },
    rejectButtonText: {
        color: "#ffffff",
    },
    backButtonText: {
        color: "#114EA8",
    },
});

export default RequestModal;
