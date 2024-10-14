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
import RemoteApi from "src/services/RemoteApi";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
        .length(6, "OTP must be exactly 6 digits")
        .required("OTP is required"),
});

const OtpVerify = ({
    onClose,
    onNext,
    onPrevious,
    initialValues,
    generateOtpApi,
    title,
    subTitle,
    clientEmail,
    arnNumber,
    submitText,
    verifyOtpApi,
    closeModal,
}) => {
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(120);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [apiError, setApiError] = useState(""); // New state for API error
    const otpRefs = useRef([]);

    // Use useEffect to decrement the resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(
                () => setResendTimer(resendTimer - 1),
                1000
            );
            return () => clearTimeout(timerId);
        } else {
            setResendEnabled(true); // Enable resend button when timer reaches 0
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
        setIsVerifying(true);
        setApiError("");
        const data = {
            otp: otpValues.join(""),
            arnNumber: arnNumber,
        };
        // Clear previous API error before submitting
        if (submitText == "Verify") {
            try {
                const response: any = await RemoteApi.post(verifyOtpApi, data);

                // const response = {
                //     code: 300,
                //     message: "Incorrect OTP",
                //     data: {
                //         token: "otpnonieetoken",
                //     }, // Example API error message
                // };

                console.log("response");
                console.log(response);

                if (response.code === 200) {
                    // const valuesWithToken = {
                    //     ...initialValues,
                    //     token: response.data.token,
                    //     currentStep: 7,
                    // };
                    onNext(initialValues);
                    // onNext(valuesWithToken);

                    setVerified(true);
                } else {
                    // setIsVerifing(false); // Stop loading
                    console.log("ElseError");

                    setApiError(response.message); // Store the error message from the API
                    setIsVerifying(false);
                }
            } catch (error) {}
        }

        setIsVerifying(false);
    };

    const handleResendOtp = async () => {
        const data = {
            arnNumber: arnNumber,
        };
        try {
            const response: any = await RemoteApi.post(generateOtpApi, data);

            // const response = {
            //     code: 200,
            //     message: "Incorrect OTP",
            //     data: {
            //         token: "otpnonieetoken",
            //     }, // Example API error message
            // };

            console.log("response");
            console.log(response);

            if (response.code === 200) {
            } else {
                console.log("ElseError");
                setApiError(response.message); // Store the error message from the API
                setIsVerifying(false);
            }
        } catch (error) {
            setApiError("Something went wrong. Please try again."); // Handle unexpected errors
            setIsVerifying(false);
        }
    };

    const isOtpComplete = otpValues.every((val) => val !== "");

    useEffect(() => {
        handleResendOtp();
    }, []);

    if (verified) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="black" />
                    </Pressable> */}
                    <Text style={styles.verifiedTitle}>
                        Verified Successfully
                    </Text>
                    <Text style={styles.verifiedSubTitle}>
                        You can now start investing!
                    </Text>
                    <Pressable
                        style={styles.startInvestingButton}
                        onPress={() => router.push(`clients`)}
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
        <>
            <View className="w-full gap-y-2">
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-[18px] font-bold">{title}</Text>

                    <Pressable onPress={closeModal}>
                        <Icon name="close" size={20} color="#000" />
                    </Pressable>
                </View>

                <Text className="text-[12px]">{subTitle}</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.content}>
                    <Formik
                        initialValues={{ otp: "" }}
                        // validationSchema={otpValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit }) => (
                            <>
                                <Text style={styles.enterOtp}>Enter OTP</Text>
                                <Text style={styles.infoText}>
                                    A 6 digit code has been sent to{" "}
                                    <Text className="text-semibold">
                                        {arnNumber}
                                    </Text>{" "}
                                    <Text className="text-semibold">
                                        {clientEmail}
                                    </Text>
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
                                {/* Show API error message if exists */}
                                {apiError ? (
                                    <Text style={styles.errorText}>
                                        {apiError}
                                    </Text>
                                ) : null}

                                <Pressable
                                    style={[
                                        styles.resendButton,
                                        resendEnabled && resendTimer === 0
                                            ? null
                                            : styles.resenddisabledButton,
                                    ]}
                                    onPress={handleResendOtp}
                                    disabled={!resendEnabled || resendTimer > 0}
                                >
                                    <Text>
                                        Resend OTP
                                        <Text style={styles.resendText}>
                                            {resendTimer > 0
                                                ? ` in ${resendTimer}s`
                                                : ""}
                                        </Text>
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
                                    onPress={() => handleSubmit()}
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
        </>
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
        // elevation: 3,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
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
        fontSize: 14,
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
    resenddisabledButton: {
        backgroundColor: "",
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
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
});

export default OtpVerify;
