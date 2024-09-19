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
import ClientVerify from "./ClientVerify";
import AddressForm from "./AddressForm";
import Success from "./Success";
import { router } from "expo-router";
import UploadBankDocument from "./UploadBankDocument";

const ClientOnboard = () => {
    const [step, setStep] = useState(1);
    const [visible, setVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

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
        isAddressNeeded: false,
        isBankVerificationFailed: false,
        bankVerifyFailMessage: "",
        showUploadDocument: false,
        currentStep: 1,
        isKYCSuccessful: true,
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
    //     isAddressNeeded: false,
    //     isBankVerificationFailed: false,
    //     bankVerifyFailMessage: "",
    //     showUploadDocument: false,
    //     currentStep: 1,
    //     isKYCSuccessful: true,
    // });
    const [loading, setLoading] = useState(false);

    const handleNext = (values) => {
        setFormData((prevData) => {
            // Merge the new values into the existing state
            const updatedData = {
                ...prevData,
                ...values,
            };

            return updatedData;
        });

        console.log("clientOnboarData");
        console.log(formData);
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

    const showAddNomiee = () => {
        const valuesWithToken = {
            ...formData,
            currentStep: 5,
        };
        handleNext(valuesWithToken);
    };

    const showNotifyClient = () => {};

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
            height: formData.currentStep > 3 ? 500 : 700,
            width: formData.currentStep > 3 ? 500 : 780,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 40,
            alignItems: "center",
        },
        // modalHeader: {
        //     width: "100%",
        //     flexDirection: "column",
        //     justifyContent: "space-between",
        //     alignItems: "center",
        //     marginBottom: 20,
        // },
        modalTitle: {
            fontSize: 22,
            fontWeight: "600",
        },
        modalSubTitle: {
            fontSize: 12,
            fontWeight: "400",
        },
    });

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
                                {(formData.currentStep === 3 ||
                                    (formData.currentStep === 2 &&
                                        !formData.isBankVerificationFailed) ||
                                    (formData.currentStep === 1 &&
                                        !formData.isAddressNeeded)) && (
                                    <>
                                        <View className="w-full gap-y-2">
                                            <View className="flex flex-row justify-between items-center">
                                                <Text className="text-[18px] font-bold">
                                                    Add New Client
                                                </Text>

                                                <Pressable onPress={closeModal}>
                                                    <Icon
                                                        name="close"
                                                        size={20}
                                                        color="#000"
                                                    />
                                                </Pressable>
                                            </View>

                                            <Text className="text-[12px]">
                                                Please fill all mandatory field
                                                to successfully add client.
                                            </Text>
                                        </View>
                                        <View className="w-full py-4">
                                            <StepProgressBar
                                                step={formData.currentStep}
                                                stepLabel={[
                                                    "Basic Details",
                                                    "Bank Details",
                                                    "Additional Info",
                                                ]}
                                            />
                                        </View>
                                    </>
                                )}

                                <View style={{ flex: 1, width: "100%" }}>
                                    {formData.currentStep === 1 &&
                                        !formData.isAddressNeeded && (
                                            <BasicDetails
                                                initialValues={formData}
                                                onNext={handleNext}
                                                onSaveDraft={saveAsDraft}
                                                onPrevious={handlePrevious}
                                                closeModal={closeModal}
                                            />
                                        )}

                                    {formData.currentStep === 2 &&
                                        !formData.isBankVerificationFailed && (
                                            <BankDetailForm
                                                onPrevious={() =>
                                                    handlePrevious
                                                }
                                                onNext={handleNext}
                                                initialValues={formData}
                                                closeModal={closeModal}
                                            />
                                        )}
                                    {formData.isAddressNeeded &&
                                        formData.currentStep === 1 && (
                                            <AddressForm
                                                initialValues={formData}
                                                onNext={handleNext}
                                                onPrevious={handlePrevious}
                                                closeModal={closeModal}
                                            />
                                        )}

                                    {formData.isBankVerificationFailed &&
                                        formData.currentStep === 2 && (
                                            <UploadBankDocument
                                                onPrevious={handlePrevious}
                                                onNext={handleNext}
                                                initialValues={formData}
                                                closeModal={closeModal}
                                            />
                                        )}
                                    {formData.currentStep === 3 && (
                                        <Additonalinfo
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            closeModal={closeModal}
                                            // setFormData={setFormData}
                                        />
                                    )}
                                    {formData.currentStep === 4 &&
                                        formData.isKYCSuccessful && (
                                            <Success
                                                onNext={handleNext}
                                                initialValues={formData}
                                                success={
                                                    formData?.isKYCSuccessful
                                                }
                                                mainMessage={
                                                    "Client’s KYC Verification is Successful!"
                                                }
                                                subMessage={
                                                    "Please save your nominee details now."
                                                }
                                                buttonText={"Add Nominee"}
                                                handleSubmit={showAddNomiee}
                                                closeModal={closeModal}
                                            />
                                        )}
                                    {formData.currentStep === 4 &&
                                        !formData.isKYCSuccessful && (
                                            <Success
                                                onNext={handleNext}
                                                initialValues={formData}
                                                success={
                                                    formData?.isKYCSuccessful
                                                }
                                                mainMessage={" KYC is Pending!"}
                                                subMessage={
                                                    "Client’s KYC details does not exist, Please complete his/her KYC."
                                                }
                                                buttonText={"Notify Client"}
                                                handleSubmit={showNotifyClient}
                                                closeModal={closeModal}
                                            />
                                        )}

                                    {formData.currentStep === 5 && (
                                        <AddNominee
                                            onNext={handleNext}
                                            onPrevious={handlePrevious}
                                            initialValues={formData}
                                            closeModal={closeModal}
                                        />
                                    )}
                                    {formData.currentStep === 6 && (
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
                                            closeModal={closeModal}
                                        />
                                    )}
                                    {formData.currentStep === 7 && (
                                        <Success
                                            onNext={handleNext}
                                            initialValues={formData}
                                            success={true}
                                            mainMessage={
                                                "Client Added Successful!"
                                            }
                                            subMessage={""}
                                            buttonText={""}
                                            handleSubmit={""}
                                            closeModal={closeModal}
                                        />
                                    )}

                                    {/* {formData.currentStep === 7 && (
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

export default ClientOnboard;
