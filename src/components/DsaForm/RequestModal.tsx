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
import axios from "axios";
import RemoteApi from "src/services/RemoteApi";

const RequestModal = ({ visible, onClose, type, clientId, onSubmit }) => {
    const [approveInput, setApproveInput] = useState("");
    const [rejectInput, setRejectInput] = useState("");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!visible) {
            setApproveInput("");
            setRejectInput("");
            setMessage(null);
        }
    }, [visible]);

    useEffect(() => {
        
    }, [message]);

    const handleSubmit = async () => {
        try {
            const data = {
                requestId: clientId,
                ...(type === "approve"
                    ? { dscCode: approveInput }
                    : { remark: rejectInput }),
            };

            let response = null;
            if (type === "approve") {
                response = await RemoteApi.post(
                    "distributor-onboard/approve-request",
                    data
                );
            } else {
                response = await RemoteApi.post(
                    "distributor-onboard/reject-request",
                    data
                );
            }

            if (response.code == 200) {
                setMessage("Submitted successful");
            }

            // onSubmit && onSubmit();
        } catch (error) {
            const updateState = () => {
                setMessage("Request failed");
            };

            updateState();
        }
    };

    const getMessageStyle = () => {
        return message === "Request successful"
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

                                <Pressable
                                    style={[
                                        styles.button,
                                        type === "approve"
                                            ? styles.approveButton
                                            : styles.rejectButton,
                                    ]}
                                    onPress={handleSubmit}
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
                            </>
                        ) : (
                            <Text style={styles.message}>{message}</Text>
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
    button: {
        width: "100%",
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
    approveButtonText: {
        color: "#ffffff",
    },
    rejectButtonText: {
        color: "#ffffff",
    },
});

export default RequestModal;
