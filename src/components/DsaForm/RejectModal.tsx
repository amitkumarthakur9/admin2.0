import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    TouchableOpacity,
} from "react-native";
import CustomCheckbox from "../Checkbox/NativeCheckbox";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "src/services/RemoteApi";

const RejectModal = ({ visible, onClose, clientId, getDataList, onBack }) => {
    const [checkedItems, setCheckedItems] = useState({
        name: false,
        email: false,
        mobileNumber: false,
        // maritalStatus: false,
        arnNumber: false,
        euinNumber: false,
        addressLine: false,
        country: false,
        city: false,
        state: false,
        pinCode: false,
        pan: false,
        incomeRange: false,
        education: false,
        occupation: false,
        esignedDocument: false,
        aadharFrontDocument: false,
        aadharBackDocument: false,
        panCardDocument: false,
        cancelledCheque: false,
        // other: false,
    });
    const [rejectInput, setRejectInput] = useState("");
    const [message, setMessage] = useState(null);
    const [showRemarkInput, setShowRemarkInput] = useState(false);

    useEffect(() => {
        if (!visible) {
            setCheckedItems({
                name: false,
                email: false,
                mobileNumber: false,
                // maritalStatus: false,
                arnNumber: false,
                euinNumber: false,
                addressLine: false,
                country: false,
                city: false,
                state: false,
                pinCode: false,
                pan: false,
                incomeRange: false,
                education: false,
                occupation: false,
                esignedDocument: false,
                aadharFrontDocument: false,
                aadharBackDocument: false,
                panCardDocument: false,
                cancelledCheque: false,
                // other: false,
            });
            setRejectInput("");
            setMessage(null);
            setShowRemarkInput(false);
            getDataList();
        }
    }, [visible]);

    const handleCheckboxChange = (key) => {
        setCheckedItems({ ...checkedItems, [key]: !checkedItems[key] });
    };

    const handleRejectSubmit = async () => {
        try {
            const data = {
                requestId: clientId,
                remark: rejectInput,
            };

            const checkdata = {
                requestId: clientId,
                ...checkedItems,
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
                setMessage("Request failed. Try Again");
            }
        } catch (error) {
            setMessage("Request failed");
        }
    };

    const handleCheckRejectSubmit = async () => {
        try {
            const checkdata = {
                requestId: clientId,
                ...checkedItems,
            };

            const response2 = await RemoteApi.post(
                "distributor-onboard/reject-reason",
                checkdata
            );

            if (response2.code == 200) {
                setShowRemarkInput(true);
            } else {
                setMessage("Request failed. Try Again");
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

    const isAnyCheckboxChecked = Object.values(checkedItems).some(
        (isChecked) => isChecked
    );

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Reject Request*</Text>
                        <Pressable onPress={onClose}>
                            <Icon name="close" size={24} color="#7C899C" />
                        </Pressable>
                    </View>
                    {!showRemarkInput ? (
                        <ScrollView
                            contentContainerStyle={styles.scrollViewContent}
                        >
                            <Text style={styles.sectionTitle}>
                                Error in Personal Details
                            </Text>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="Name"
                                        isChecked={checkedItems.name}
                                        onChange={() =>
                                            handleCheckboxChange("name")
                                        }
                                    />
                                    <CustomCheckbox
                                        label="Email Address"
                                        isChecked={checkedItems.email}
                                        onChange={() =>
                                            handleCheckboxChange("email")
                                        }
                                    />
                                </View>

                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="ARN Number"
                                        isChecked={checkedItems.arnNumber}
                                        onChange={() =>
                                            handleCheckboxChange("arnNumber")
                                        }
                                    />
                                    <CustomCheckbox
                                        label="EUIN"
                                        isChecked={checkedItems.euinNumber}
                                        onChange={() =>
                                            handleCheckboxChange("euinNumber")
                                        }
                                    />
                                </View>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="Mobile Number"
                                        isChecked={checkedItems.mobileNumber}
                                        onChange={() =>
                                            handleCheckboxChange("mobileNumber")
                                        }
                                    />
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>
                                Error in Address Details
                            </Text>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="Address Line"
                                        isChecked={checkedItems.addressLine}
                                        onChange={() =>
                                            handleCheckboxChange("addressLine")
                                        }
                                    />
                                    <CustomCheckbox
                                        label="Country"
                                        isChecked={checkedItems.country}
                                        onChange={() =>
                                            handleCheckboxChange("country")
                                        }
                                    />
                                </View>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="City"
                                        isChecked={checkedItems.city}
                                        onChange={() =>
                                            handleCheckboxChange("city")
                                        }
                                    />
                                    <CustomCheckbox
                                        label="State"
                                        isChecked={checkedItems.state}
                                        onChange={() =>
                                            handleCheckboxChange("state")
                                        }
                                    />
                                </View>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="PIN Code"
                                        isChecked={checkedItems.pinCode}
                                        onChange={() =>
                                            handleCheckboxChange("pinCode")
                                        }
                                    />
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>
                                Error in Professional Details
                            </Text>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="PAN"
                                        isChecked={checkedItems.pan}
                                        onChange={() =>
                                            handleCheckboxChange("pan")
                                        }
                                    />
                                </View>
                            </View>

                            <Text style={styles.sectionTitle}>
                                Error in Uploaded Documents
                            </Text>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="E-Signed Document"
                                        isChecked={checkedItems.esignedDocument}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "esignedDocument"
                                            )
                                        }
                                    />
                                    <CustomCheckbox
                                        label="Aadhar Card Front"
                                        isChecked={
                                            checkedItems.aadharFrontDocument
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "aadharFrontDocument"
                                            )
                                        }
                                    />
                                </View>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="Aadhar Card Back"
                                        isChecked={
                                            checkedItems.aadharBackDocument
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "aadharBackDocument"
                                            )
                                        }
                                    />
                                    <CustomCheckbox
                                        label="PAN Card"
                                        isChecked={checkedItems.panCardDocument}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "panCardDocument"
                                            )
                                        }
                                    />
                                </View>
                                <View style={styles.checkboxColumn}>
                                    <CustomCheckbox
                                        label="Cancelled Cheque"
                                        isChecked={checkedItems.cancelledCheque}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                "cancelledCheque"
                                            )
                                        }
                                    />
                                </View>
                            </View>
                            <Pressable
                                style={[
                                    styles.nextButton,
                                    {
                                        backgroundColor: isAnyCheckboxChecked
                                            ? "#114EA8"
                                            : "#B0C4DE",
                                    },
                                ]}
                                onPress={() => {
                                    if (isAnyCheckboxChecked) {
                                        setShowRemarkInput(true);
                                    }
                                }}
                                disabled={!isAnyCheckboxChecked}
                            >
                                <Text style={styles.nextButtonText}>Next</Text>
                            </Pressable>
                        </ScrollView>
                    ) : (
                        <View style={styles.remarkContainer}>
                            <Text style={styles.sectionTitle}>Remarks</Text>
                            <TextInput
                                multiline={true}
                                numberOfLines={4}
                                style={styles.input}
                                value={rejectInput}
                                onChangeText={setRejectInput}
                            />
                            <View style={styles.buttonContainer}>
                                <Pressable
                                    style={[styles.button, styles.backButton]}
                                    onPress={() => setShowRemarkInput(false)}
                                >
                                    <Text style={styles.backButtonText}>
                                        Back
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.button,
                                        styles.rejectButton,
                                        {
                                            backgroundColor: rejectInput
                                                ? "#114EA8"
                                                : "#B0C4DE",
                                        },
                                    ]}
                                    onPress={handleRejectSubmit}
                                    disabled={!rejectInput}
                                >
                                    <Text style={styles.rejectButtonText}>
                                        Submit
                                    </Text>
                                </Pressable>
                            </View>
                            {message && (
                                <Text
                                    style={[styles.message, getMessageStyle()]}
                                >
                                    {message}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        maxHeight: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    scrollViewContent: {
        paddingBottom: 20,
        width: 600,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 20,
        marginBottom: 10,
    },
    checkboxRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    checkboxColumn: {
        flexDirection: "column",
        width: "33%",
    },
    nextButton: {
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 20,
        width: "50%",
        alignSelf: "center",
    },
    nextButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    remarkContainer: {
        flex: 1,
        justifyContent: "center",
        width: 300,
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
    backButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#114EA8",
    },
    rejectButton: {
        backgroundColor: "#114EA8",
    },
    rejectButtonText: {
        color: "#ffffff",
    },
    backButtonText: {
        color: "#114EA8",
    },
});

export default RejectModal;
