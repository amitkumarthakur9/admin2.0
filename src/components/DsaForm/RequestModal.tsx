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

    const handleSubmit = async () => {
        try {
            const data = {
                clientId,
                ...(type === "approve"
                    ? { dsaCode: approveInput }
                    : { remarks: rejectInput }),
            };
            await axios.post("/onboard/distributor", data);
            setMessage("Request successful");
            onSubmit && onSubmit();
        } catch (error) {
            setMessage("Request failed");
        }
    };

    return (
        <Modal
            visible={visible}
            transparent           
            onRequestClose={onClose}
        >
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
                                {type === "approve" ? "DSA Code*" : "Remarks*"}
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
                                    {type === "approve" ? "Approve" : "Reject"}
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
        color:"#97989B"
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
        color: "green",
        textAlign: "center",
    },
    button: {
        width: "100%",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
    },
    approveButton: {
        backgroundColor: "#CCF4C2",
    },
    rejectButton: {
        backgroundColor: "#FFD2D2",
    },
    approveButtonText: {
        color: "#417135",
    },
    rejectButtonText: {
        color: "#713535",
    },
});

export default RequestModal;
