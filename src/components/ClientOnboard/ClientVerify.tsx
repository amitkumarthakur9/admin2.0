import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";

const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
        .length(6, "OTP must be exactly 6 digits")
        .required("OTP is required"),
});

const ClientVerify = ({
    onClose,
    onNext,
    onPrevious,
    initialValues,
    apiEndpoint,
    title,
    subTitle,
    clientEmail,
    clientNumber,
    submitText,
}) => {
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const otpRefs = useRef([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(
                () => setResendTimer(resendTimer - 1),
                1000
            );
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const handleOtpChange = (value, index) => {
        if (/^\d$/.test(value) || value === "") {
            const newOtpValues = [...otpValues];
            newOtpValues[index] = value;
            setOtpValues(newOtpValues);
            if (value !== "" && index < 5) {
                otpRefs.current[index + 1].focus();
            }
        }
    };

    const handleOtpKeyPress = (e, index) => {
        if (
            e.nativeEvent.key === "Backspace" &&
            otpValues[index] === "" &&
            index > 0
        ) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        if(submitText=="Verify"){

        }
        if(submitText=="Start investing"){

        }
        setIsVerifying(true);
        setResendTimer(120); // Start resend timer for 2 minutes
        setResendEnabled(true); // Enable resend button after verification attempt

        setTimeout(() => {
            setIsVerifying(false);
            setVerified(true);

            // Show the verified message briefly before calling onNext
            setTimeout(() => {
                onNext(); // Trigger onNext after showing the success message
            }, 2000); // Adjust the delay as needed to give time for the success message to be visible
        }, 2000); // Mock API call for verification
    };

    const handleResendOtp = () => {
        if (resendEnabled && resendTimer === 0) {
            setResendTimer(120); // Restart the timer for 2 minutes
            // Logic to resend OTP
        }
    };

    const isOtpComplete = otpValues.every((val) => val !== "");

    if (verified) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable>
                    <Text style={styles.verifiedTitle}>
                        Verified Successfully
                    </Text>
                    <Text style={styles.verifiedSubTitle}>
                        You can now start investing!
                    </Text>
                    <Pressable
                        style={styles.startInvestingButton}
                        onPress={onNext}
                    >
                        <Text style={styles.startInvestingButtonText}>
                            Start Investing
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="black" />
                </Pressable>

                <Text style={styles.title}>
                    {title}
                   
                </Text>
                <Text style={styles.subTitle}>
                    {subTitle}
                </Text>

                <Formik
                    initialValues={{ otp: "" }}
                    // validationSchema={otpValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <>
                            <Text style={styles.enterOtp}>Enter OTP</Text>
                            <Text style={styles.infoText}>
                                A 6 digit code has been sent to {clientNumber} &
                               {clientEmail}
                            </Text>
                            <View style={styles.otpContainer}>
                                {otpValues.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles.otpInput}
                                        onChangeText={(text) =>
                                            handleOtpChange(text, index)
                                        }
                                        onKeyPress={(e) =>
                                            handleOtpKeyPress(e, index)
                                        }
                                        value={value}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        ref={(ref) =>
                                            (otpRefs.current[index] = ref)
                                        }
                                    />
                                ))}
                            </View>

                            <Pressable
                                style={[
                                    styles.resendButton,
                                    resendEnabled && resendTimer === 0
                                        ? null
                                        : styles.disabledButton,
                                ]}
                                onPress={handleResendOtp}
                                disabled={!resendEnabled || resendTimer > 0}
                            >
                                <Text style={styles.resendText}>
                                    Resend OTP
                                    {resendTimer > 0
                                        ? ` in ${resendTimer}s`
                                        : ""}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.verifyButton,
                                    isOtpComplete
                                        ? null
                                        : styles.disabledButton,
                                ]}
                                // onPress={handleSubmit}
                                onPress = {() =>handleSubmit()}
                                disabled={!isOtpComplete || isVerifying}
                            >
                                {isVerifying ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.verifyButtonText}>
                                        {submitText}
                                    </Text>
                                )}
                            </Pressable>
                        </>
                    )}
                </Formik>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    closeButton: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: "#718096",
    },
    enterOtp: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    infoText: {
        fontSize: 14,
        textAlign: "center",
        color: "#718096",
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        textAlign: "center",
        fontSize: 18,
        borderRadius: 10,
    },
    resendButton: {
        marginBottom: 20,
        alignItems: "center",
    },
    resendText: {
        color: "#0066cc",
    },
    verifyButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "100%",
    },
    verifyButtonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    disabledButton: {
        backgroundColor: "#A0AEC0",
    },
    verifiedTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    verifiedSubTitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#718096",
        marginBottom: 20,
    },
    startInvestingButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "100%",
    },
    startInvestingButtonText: {
        fontSize: 16,
        color: "#ffffff",
    },
});

export default ClientVerify;
