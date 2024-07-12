import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Success from "./Success";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import RemoteApi from "src/services/RemoteApi";
import PersonalDetailsForm from "./PersonalDetailsForm";
import ProfessionalDetailsForm from "./ProfessionalDetailsForm";
import { ActivityIndicator } from "react-native-paper";
import { getResponse } from "src/helper/helper";

const MainComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formData, setFormData] = useState({
        fullName: null,
        email: "",
        mobileNumber: "",
        panNumber: "",
        pincode: "",
        country: "",
        arn: "",
        maritalStatus: null,
        incomeRange: null,
        education: null,
        occupation: null,
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        accountNumber: "",
        accountType: "",
        ifscCode: "",
        bankName: "",
        bankAddress: "",
        district: "",
        remark: null,
        dsaCode: null,
    });

    const handleNext = (values) => {
        setFormData({ ...formData, ...values });
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSuccess = () => setStep(3);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    const handleSubmit = async (values) => {
        const finalData = { ...formData, ...values };
        try {
            const response = await RemoteApi.post(
                "/onboard/distributor",
                finalData
            );
            console.log(response);
            // Handle successful submission
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <View style={styles.container}>
            <View className="flex flex-col p-4 gap-4">
                <View className="flex flex-row items-center">
                    <Pressable
                        className="mr-3"
                        onPress={() => router.push("/dashboard")}
                    >
                        <Icon name="angle-left" size={18} color={"black"} />
                    </Pressable>
                    <Text
                        selectable
                        className="text-base flex flex-row text-center font-bold"
                    >
                        Add Distributor
                    </Text>
                </View>
                <View style={styles.stepContainer}>
                    <View style={styles.stepHeader}>
                        <Text style={styles.stepText}>Steps to complete</Text>
                        <TouchableOpacity
                            onPress={toggleTooltip}
                            style={styles.tooltipIcon}
                        >
                            <FontAwesome
                                name="info"
                                size={12}
                                color="#0066cc"
                            />
                        </TouchableOpacity>
                    </View>
                    {showTooltip && (
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>
                                Steps to complete your DSA Application
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Fill in your Details
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Generate and Sign Agreement
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Upload your documents such as aadhar card
                                front, aadhar card back, PAN card, bank account
                                check copy (supported formats .PNG, JPEG, JPG &
                                PDF)
                            </Text>
                        </View>
                    )}
                    <View style={styles.steps}>
                        {[
                            "Personal Details",
                            "Address",
                            "Professional Details",
                            "Bank Details",
                            "Sign Document",
                            "Upload Documents",
                        ].map((label, index) => (
                            <React.Fragment key={index}>
                                <View className="">
                                    <View className="flex flex-row w-full justify-center items-center">
                                        <View className="">
                                            {index == 0 && (
                                                <View
                                                    style={[styles.firstLine]}
                                                ></View>
                                            )}
                                            {index < 6 && index > 0 && (
                                                <View
                                                    style={[
                                                        styles.line,
                                                        step >= index + 1 &&
                                                            styles.lineActive,
                                                    ]}
                                                ></View>
                                            )}
                                        </View>
                                        <View
                                            style={[
                                                styles.step,
                                                step >= index + 1 &&
                                                    styles.stepActive,
                                                step > index + 1 &&
                                                    styles.stepCompleted,
                                            ]}
                                        >
                                            {step > index + 1 ? (
                                                <FontAwesome
                                                    name="check"
                                                    size={18}
                                                    color="#fff"
                                                />
                                            ) : (
                                                <Text
                                                    style={[
                                                        styles.stepNumber,
                                                        step >= index + 1 &&
                                                            styles.stepNumberActive,
                                                    ]}
                                                >
                                                    {`0${index + 1}`}
                                                </Text>
                                            )}
                                        </View>
                                        <View>
                                            {index < 5 && (
                                                <View
                                                    style={[
                                                        styles.line,
                                                        step >= index + 2 &&
                                                            styles.lineActive,
                                                    ]}
                                                ></View>
                                            )}
                                            {index == 5 && (
                                                <View
                                                    style={[styles.firstLine]}
                                                ></View>
                                            )}
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.stepLabel}>
                                            {label}
                                        </Text>
                                    </View>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                <>
                    <View style={{ flex: 1, padding: 20 }}>
                        {step === 1 && (
                            <PersonalDetailsForm
                                onNext={handleNext}
                                initialValues={formData}
                            />
                        )}

                        {step === 2 && (
                            <ProfessionalDetailsForm
                                onSubmit={handleSubmit}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                initialValues={formData}
                            />
                        )}

                        {step === 3 && (
                            <Success
                                successMessages={[
                                    "Application successfully submitted.",
                                    "Approval Pending.",
                                ]}
                            />
                        )}
                    </View>
                </>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    stepContainer: {
        padding: 20,
        position: "relative",
        zIndex: 1,
    },
    stepHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0066cc",
        marginRight: 5,
    },
    tooltipIcon: {
        borderWidth: 2,
        borderColor: "#0066cc",
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    tooltip: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderColor: "#d3d3d3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
    },
    tooltipText: {
        color: "#333",
        marginBottom: 5,
    },
    steps: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    stepWrapper: {
        alignItems: "center",
    },
    step: {
        backgroundColor: "#fff",
        borderColor: "#d3d3d3",
        borderWidth: 2,
        padding: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    stepActive: {
        borderColor: "#0066cc",
    },
    stepCompleted: {
        backgroundColor: "#0066cc",
    },
    stepNumber: {
        color: "#d3d3d3",
        fontWeight: "bold",
    },
    stepNumberActive: {
        color: "#0066cc",
    },
    line: {
        backgroundColor: "#d3d3d3",
        alignSelf: "center",
        marginHorizontal: 10,
        paddingTop: 2,
        paddingBottom: 2,
        width: "100%",
        borderColor: "#d3d3d3",
        borderWidth: 1,
        padding: 10,
    },
    firstLine: {
        backgroundColor: "#ffffff",
        alignSelf: "center",
        marginHorizontal: 10,
        paddingTop: 2,
        paddingBottom: 2,
        width: "100%",
        borderColor: "#ffffff",
        borderWidth: 1,
        padding: 10,
    },
    lineActive: {
        backgroundColor: "#0066cc",
        borderColor: "#0066cc",
    },
    stepLabel: {
        marginTop: 5,
        fontSize: 12,
        color: "#333",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: 20,
    },
    buttonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
});

export default MainComponent;
