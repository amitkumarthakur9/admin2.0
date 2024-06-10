import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import StepOneForm from "./StepOneForm";
import StepTwoPDF from "./StepTwoPDF";
import StepThreeUpload from "./StepThreeUpload";
import Success from "./Success";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";

const MainComponent = () => {
    const [step, setStep] = useState(1);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleNext = () => setStep(step + 1);
    const handleSuccess = () => setStep(4);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
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
                    DSA Form
                </Text>
            </View>
            <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                    <Text style={styles.stepText}>Steps to complete</Text>
                    <TouchableOpacity
                        onPress={toggleTooltip}
                        style={styles.tooltipIcon}
                    >
                        <FontAwesome name="info" size={12} color="#0066cc" />
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
                            • Upload your documents such as aadhar card front,
                            aadhar card back, PAN card, bank account check copy
                            (supported formats .PNG, JPEG, JPG & PDF)
                        </Text>
                    </View>
                )}
                <View style={styles.steps}>
                    <View style={[styles.step, step >= 1 && styles.stepActive]}>
                        <Text
                            style={[
                                styles.stepNumber,
                                step >= 1 && styles.stepNumberActive,
                            ]}
                        >
                            01
                        </Text>
                    </View>
                    <View
                        style={[styles.line, step >= 2 && styles.lineActive]}
                    />
                    <View style={[styles.step, step >= 2 && styles.stepActive]}>
                        <Text
                            style={[
                                styles.stepNumber,
                                step >= 2 && styles.stepNumberActive,
                            ]}
                        >
                            02
                        </Text>
                    </View>
                    <View
                        style={[styles.line, step >= 3 && styles.lineActive]}
                    />
                    <View style={[styles.step, step >= 3 && styles.stepActive]}>
                        <Text
                            style={[
                                styles.stepNumber,
                                step >= 3 && styles.stepNumberActive,
                            ]}
                        >
                            03
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, padding: 20 }}>
                {step === 1 && <StepThreeUpload onNext={handleNext} />}
                {step === 2 && <StepTwoPDF onNext={handleNext} />}
                {step === 3 && <StepThreeUpload onSuccess={handleSuccess} />}
                {step === 4 && <Success />}
            </View>
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
    step: {
        backgroundColor: "#fff",
        borderColor: "#d3d3d3",
        borderWidth: 2,
        padding: 10,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    stepActive: {
        borderColor: "#0066cc",
    },
    stepNumber: {
        color: "#d3d3d3",
        fontWeight: "bold",
    },
    stepNumberActive: {
        color: "#0066cc",
    },
    line: {
        width: 40,
        height: 2,
        backgroundColor: "#d3d3d3",
    },
    lineActive: {
        backgroundColor: "#0066cc",
    },
});

export default MainComponent;
