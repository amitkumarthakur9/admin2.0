import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import CustomCheckbox from "../Checkbox/NativeCheckbox";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RemarkCheckModal = ({ visible, onClose, onNext }) => {
    const [checkedItems, setCheckedItems] = useState({
        name: false,
        emailAddress: false,
        mobileNumber: false,
        maritalStatus: false,
        arnNumber: false,
        euin: false,
        addressLine: false,
        country: false,
        city: false,
        state: false,
        pinCode: false,
        pan: false,
        incomeRange: false,
        education: false,
        occupation: false,
        eSignedDocument: false,
        aadharCardFront: false,
        aadharCardBack: false,
        panCard: false,
        cancelledCheque: false,
        other: false,
        arn_certificate: false,
        nism_certificate: false,
        euin_certificate: false,
    });

    const handleCheckboxChange = (key) => {
        setCheckedItems({ ...checkedItems, [key]: !checkedItems[key] });
    };

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-lg font-semibold">
                            Select Reason to Reject Request
                        </Text>
                        <Pressable onPress={onClose}>
                            <Icon name="close" size={24} color="#7C899C" />
                        </Pressable>
                    </View>

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
                                    isChecked={checkedItems.emailAddress}
                                    onChange={() =>
                                        handleCheckboxChange("emailAddress")
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
                                    isChecked={checkedItems.euin}
                                    onChange={() =>
                                        handleCheckboxChange("euin")
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
                                    onChange={() => handleCheckboxChange("pan")}
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
                                    isChecked={checkedItems.eSignedDocument}
                                    onChange={() =>
                                        handleCheckboxChange("eSignedDocument")
                                    }
                                />
                                <CustomCheckbox
                                    label="Aadhar Card Front"
                                    isChecked={checkedItems.aadharCardFront}
                                    onChange={() =>
                                        handleCheckboxChange("aadharCardFront")
                                    }
                                />
                            </View>
                            <View style={styles.checkboxColumn}>
                                <CustomCheckbox
                                    label="Aadhar Card Back"
                                    isChecked={checkedItems.aadharCardBack}
                                    onChange={() =>
                                        handleCheckboxChange("aadharCardBack")
                                    }
                                />
                                <CustomCheckbox
                                    label="PAN Card"
                                    isChecked={checkedItems.panCard}
                                    onChange={() =>
                                        handleCheckboxChange("panCard")
                                    }
                                />
                            </View>
                            <View style={styles.checkboxColumn}>
                                <CustomCheckbox
                                    label="Cancelled Cheque"
                                    isChecked={checkedItems.cancelledCheque}
                                    onChange={() =>
                                        handleCheckboxChange("cancelledCheque")
                                    }
                                />
                            </View>
                            <View style={styles.checkboxColumn}>
                                <CustomCheckbox
                                    label="ARN Certificate"
                                    isChecked={checkedItems.arn_certificate}
                                    onChange={() =>
                                        handleCheckboxChange("arn_certificate")
                                    }
                                />
                            </View>
                            <View style={styles.checkboxColumn}>
                                <CustomCheckbox
                                    label="EUIN Certificate"
                                    isChecked={checkedItems.euin_certificate}
                                    onChange={() =>
                                        handleCheckboxChange("euin_certificate")
                                    }
                                />
                            </View>
                            <View style={styles.checkboxColumn}>
                                <CustomCheckbox
                                    label="NISM Certificate"
                                    isChecked={checkedItems.nism_certificate}
                                    onChange={() =>
                                        handleCheckboxChange("nism_certificate")
                                    }
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View className="flex flex-row justify-center">
                        <Pressable style={styles.nextButton} onPress={onNext}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </Pressable>
                    </View>
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
        width: "50%",
        maxHeight: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
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
        backgroundColor: "#114EA8",
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 20,
        width: "50%",
    },
    nextButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        alignSelf: "flex-end",
    },
});

export default RemarkCheckModal;
