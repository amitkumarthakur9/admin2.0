import React, { useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    Pressable,
    ActivityIndicator,
    ScrollView,
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
import Success from "./Success";
import { router } from "expo-router";

const ClientOnboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [visible, setVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [modalTitle, setModalTitle] = useState("Client Onboarding");
    const [isAdditionalDetailsSubmitted, setIsAdditionalDetailsSubmitted] =
        useState(false); // Track submission

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        isTaxpayer: false,
        passportNumber: "",
        dateOfBirth: "",
        panNumber: "",
        isPoliticalExposed: null,
        placeOfBirth: "",
        gender: null,
        occupation: "",
        accountNumber: "",
        accountType: "",
        ifsc: "",
        incomeRange: "",
        mismatchDob: false,
        panVerified: true,
        addressMismatch: true,
        mismatchName: false,
        isResidentIndian: null,
        taxStatus: "Non-Resident Indian",
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
        country: "",
        nomineeDateOfBirth: "",
        guardianDateOfBirth: "",
        relationship: "",
        nomineeName: "",
        guardianName: "",
        token: "",
        branchId: "",
        serverError: "",
    });

    // const [formData, setFormData] = useState({
    //     fullName: "Harsh Mundhra",
    //     email: "harshmundhra001@gmail.com",
    //     mobileNumber: "9473351515",
    //     isTaxpayer: false,
    //     passportNumber: "",
    //     dateOfBirth: "2000-09-23",
    //     panNumber: "GHMPM1801C",
    //     isPoliticalExposed: null,
    //     placeOfBirth: "Bangalore",
    //     gender: null,
    //     occupation: "",
    //     accountNumber: "3047884268",
    //     accountType: "",
    //     ifsc: "KkBK0008066",
    //     incomeRange: "",
    //     mismatchDob: false,
    //     panVerified: true,
    //     addressMismatch: true,
    //     mismatchName: false,
    //     isResidentIndian: null,
    //     taxStatus: "Non-Resident Indian ",
    //     addressLine1: "Bangalore",
    //     addressLine2: "Bangalore",
    //     postalCode: "751006",
    //     country: "",
    //     nomineeDateOfBirth: "2024-04-30",
    //     guardianDateOfBirth: "1997-04-30",
    //     relationship: "",
    //     nomineeName: "",
    //     guardianName: "",
    //     token: "",
    //     branchId: "",
    //     serverError: "",
    // });
    const [loading, setLoading] = useState(false);

    const handleNext = (values) => {
        // setFormData({ ...formData, ...values });

        setFormData((prevData) => ({
            ...prevData,
            ...values,
        }));

        setStep(step + 1);
    };

    const saveAsDraft = async (values) => {
        console.log("Saving draft", values);
        // Simulate API call to save draft
        alert("Draft saved successfully");
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
                <Icon name="account-plus" size={16} color="#fff" />
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
                    <TouchableOpacity
                        onPress={() => router.push(`invite-contact`)}
                        style={styles.dropdownItem}
                    >
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
                                {!isAdditionalDetailsSubmitted &&
                                    (step === 1 ||
                                        step === 2 ||
                                        step === 3) && (
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
                                            onPrevious={handlePrevious}
                                        />
                                    )}

                                    {step === 2 && (
                                        <BankDetailForm
                                            onPrevious={handlePrevious}
                                            onNext={handleNext}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 3 && (
                                        <Additonalinfo
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            onSubmitSuccess={
                                                setIsAdditionalDetailsSubmitted
                                            } // Track when additional details are submitted
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {step === 4 && (
                                        <AddNominee
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                        />
                                    )}
                                    {step === 5 && (
                                        <ClientVerify
                                            clientEmail={"john@gmail.com"}
                                            clientNumber={"98765433"}
                                            title={
                                                "Account and Nominee Verification"
                                            }
                                            subTitle={
                                                "Please verify to move forward"
                                            }
                                            generateOtpApi={
                                                "/onboard/client/generate-otp"
                                            }
                                            verifyOtpApi={
                                                "/onboard/client/verify-otp"
                                            }
                                            onClose
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            submitText={"Verify"}
                                        />
                                    )}
                                    {step === 6 && (
                                        <ClientVerify
                                            generateOtpApi={
                                                "/onboard/client/generate-otp"
                                            }
                                            verifyOtpApi={
                                                "/onboard/client/verify-otp"
                                            }
                                            clientEmail={"john@gmail.com"}
                                            clientNumber={"98765433"}
                                            title={"E-log Verification"}
                                            subTitle={
                                                "Please verify to complete onboarding"
                                            }
                                            onClose
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            submitText={"start Investing"}
                                        />
                                    )}
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
        paddingHorizontal: 8,
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
        marginTop: 48,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 200,
        position: "absolute",
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
