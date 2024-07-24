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
import CreatePassword from "./CreatePassword";
import { ActivityIndicator } from "react-native-paper";
import { getResponse } from "src/helper/helper";
import StepProgressBar from "./StepProgressBar";

const ManagementUserForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        employeeCode: "",
        password: "",
        passwordConfirm: "",
        assignedRole: "0",
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

    const handleAddManager = () => {
        setFormData({
            ...formData,
            fullName: "",
            email: "",
            mobileNumber: "",
            employeeCode: "",
            password: "",
            passwordConfirm: "",
            assignedRole: "",
        });

        setStep(1);
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
                        Add Management User
                    </Text>
                </View>
                <View style={styles.stepContainer}>
                    <StepProgressBar
                        step={step}
                        stepLabel={["Personal Details", "Create Password"]}
                    />
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
                            <CreatePassword
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                initialValues={formData}
                            />
                        )}

                        {step === 3 && (
                            <View className="flex flex-col justify-center items-center">
                                <Success
                                    successMessages={[
                                        "successfully submitted.",
                                    ]}
                                />
                                <View className="w-3/12">
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.proceed,
                                            {
                                                borderColor: "#0066cc",
                                                opacity: pressed ? 0.6 : 1,
                                            },
                                        ]}
                                        onPress={() => handleAddManager()}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                { color: "#ffffff" },
                                            ]}
                                        >
                                            {"Add Management User"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
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

export default ManagementUserForm;
