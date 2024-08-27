import React, { useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    Pressable,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BasicDetails from "./BasicDetails";
import StepProgressBar from "../AddManagementUser/StepProgressBar";
import BankDetailForm from "./BankDetailForm";
import Additonalinfo from "./Additionalinfo";
import AddNominee from "./AddNominee";
import AddSignature from "./AddSignature";
import ClientVerify from "./ClientVerify";
import AddressForm from "./AddressForm";
import PanVerify from "./PanVerify";
import BankVerify from "./BankVerify";

const ClientOnboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [visible, setVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [modalTitle, setModalTitle] = useState("Client Details");

    const [formData, setFormData] = useState({
        fullName: "Saffi",
        email: "saffi@gmail.com",
        mobileNumber: "98876767",
        isTaxpayer: "",
        passportNumber: "0",
        dateOfBirth: "20-04-1997",
        panNumber: "ABCDE1234G",
        isPoliticalExposed: "",
        placeOfBirth: "Bangalore",
        gender: null,
        occupation: "1",
        accountNumber: "20278353143",
        accountType: "1",
        ifsc: "SBI00007",
        incomeRange: "",
        mismatchDob: false,
        panVerified: true,
        addressMismatch: true,
        mismatchName: false,
        isResidentIndian: null,
        country: null,
    });
    const [loading, setLoading] = useState(false);

    const handleNext = (values) => {
        setFormData({ ...formData, ...values });
        if (values?.addressMismatch && values?.basicDetailSubmitted) {
            setStep(step + 1);
        } else if (
            values?.addressMismatch == false &&
            values?.basicDetailSubmitted
        ) {
            setStep(step + 2);
        } else {
            setStep(step + 1);
        }
    };

    const mockVerifyDetails = (data) => {
        console.log("Verifying details", data);
        return new Promise((resolve) =>
            setTimeout(
                () =>
                    resolve({
                        panVerified: false,
                        mismatchName: false,
                        mismatchDob: false,
                        addressMismatch: false,
                    }),
                2000
            )
        );
    };

    const saveAsDraft = async (values) => {
        console.log("Saving draft", values);
        // Simulate API call to save draft
        alert("Draft saved successfully");
    };

    const submitBasicDetails = async (values) => {
        setIsLoading(true);
        try {
            // const response = await RemoteApi.post("/api/submitDetails", values);
            console.log("handleSubmit");
            const response = {
                data: {
                    mismatchDob: false,
                    panVerified: true,
                    addressMismatch: true,
                    mismatchName: true,
                },
            };
            if (response.data.success) {
                handleNext(values);
            } else if (response.data.addressMismatch) {
                console.log("mismatch");
                setStep(2);
                // setShowAddressForm(true); // Show AddressForm if there is an address mismatch
            } else {
                // actions.setErrors(response.data.errors);
            }
        } catch (error) {
            Alert.alert("Error", "Submission failed. Please try again.");
        }
        setIsLoading(false);
        // actions.setSubmitting(false);
    };

    const submitBankDetails = async (values) => {
        setIsLoading(true);
        try {
            // const response = await RemoteApi.post("/api/submitDetails", values);
            console.log("handleSubmit");
            const response = {
                data: {
                    mismatchDob: false,
                    panVerified: true,
                    addressMismatch: true,
                    mismatchName: true,
                },
            };
            if (response.data.success) {
                handleNext(values);
            } else if (response.data.addressMismatch) {
                console.log("mismatch");
                setStep(2);
                // setShowAddressForm(true); // Show AddressForm if there is an address mismatch
            } else {
                // actions.setErrors(response.data.errors);
            }
        } catch (error) {
            Alert.alert("Error", "Submission failed. Please try again.");
        }
        setIsLoading(false);
        // actions.setSubmitting(false);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleAddClientDetails = () => {
        setShowDropdown(false);
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
    };

    return (
        <View>
            {/* Button to add a new client */}
            <Pressable
                style={styles.addButton}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Icon name="account-plus" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add New Client</Text>
            </Pressable>

            {/* Dropdown menu */}
            {showDropdown && (
                <View style={styles.dropdown}>
                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={handleAddClientDetails}
                    >
                        <Text style={styles.dropdownItemText}>
                            Add Clients Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem}>
                        <Text style={styles.dropdownItemText}>
                            Invite Client
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal to show BasicDetails component */}
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {modalTitle}
                                    </Text>
                                    <Pressable onPress={closeModal}>
                                        <Icon
                                            name="close"
                                            size={24}
                                            color="#000"
                                        />
                                    </Pressable>
                                </View>
                                {(step === 1 || step === 3 || step === 4) && (
                                    <StepProgressBar
                                        step={step}
                                        stepLabel={[
                                            "Basic Details",
                                            "Bank Details",
                                            "Additional Info",
                                        ]}
                                    />
                                )}

                                <View style={{ flex: 1, width: "100%" }}>
                                    {step === 1 && (
                                        <BasicDetails
                                            initialValues={formData}
                                            onNext={handleNext}
                                            onSaveDraft={saveAsDraft}
                                        />
                                    )}
                                    {step === 2 && (
                                        <AddressForm
                                            onPrevious={handlePrevious}
                                            onNext={handleNext}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 3 && (
                                        <BankDetailForm
                                            onPrevious={handlePrevious}
                                            onNext={handleNext}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 4 && (
                                        <Additonalinfo
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 5 && (
                                        <AddNominee
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 7 && (
                                        <ClientVerify
                                            clientEmail={"john@gmail.com"}
                                            clientNumber={"98765433"}
                                            title={
                                                "Account and Nominee Verification"
                                            }
                                            subTitle={
                                                "Please verify to move forward"
                                            }
                                            apiEndpoint={"submit/otp"}
                                            onClose
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            submitText={"Verify"}
                                        />
                                    )}
                                    {step === 8 && (
                                        <ClientVerify
                                            apiEndpoint={"submit/otp"}
                                            clientEmail={"john@gmail.com"}
                                            clientNumber={"98765433"}
                                            title={
                                                "Account and Nominee Verification"
                                            }
                                            subTitle={
                                                "Please verify to move forward"
                                            }
                                            onClose
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            submitText={"start Investing"}
                                        />
                                    )}
                                    {/* {step === 2 && (
                                        <PanVerify
                                            onPrevious={handlePrevious}
                                            onNext={handleNext}
                                            initialValues={formData}
                                        />
                                    )} */}

                                    {/* {step === 4 && (
                                        <BankVerify
                                            onPrevious
                                            onNext={handleNext}
                                            initialValues={formData}
                                        />
                                    )} */}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#114EA8",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    addButtonText: {
        color: "white",
        fontSize: 14,
        marginLeft: 8,
        fontWeight: "bold",
    },
    dropdown: {
        backgroundColor: "white",
        borderRadius: 5,
        marginTop: 5,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 200,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        height: "80%",
        width: "70%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
});

export default ClientOnboard;
