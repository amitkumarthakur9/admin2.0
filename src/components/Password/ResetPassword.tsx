import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
    Modal,
    Pressable,
    FormControl,
    Button,
    Text,
    Input,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import RemoteApi from "../../../src/services/RemoteApi";

const ResetPassword = ({authToken}) => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
        token: authToken,
    });
    const [passwordVisible, setPasswordVisible] = useState({
        newPassword: false,
        confirmPassword: false,
    });
    const [validation, setValidation] = useState({
        length: false,
        upperCase: false,
        number: false,
        specialChar: false,
    });
    const [showModal, setShowModal] = useState(true);
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        newPassword: null,
        confirmPassword: null,
    });

    const newErrors = {
        newPassword: null,
        confirmPassword: null,
    }; // Initialize empty error object

    const handleChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        console.log(formData);
        validatePassword("new", formData.newPassword);

        if (formData.confirmPassword !== "") {
            validatePassword("confirm", formData.confirmPassword);
        }
    }, [formData]);

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validatePassword = (key, password) => {
        const lengthRegex = /.{8,20}/;
        const upperCaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[^A-Za-z0-9]/;
        console.log(formData.confirmPassword);
        console.log(formData.newPassword);

        setValidation({
            length: lengthRegex.test(password),
            upperCase: upperCaseRegex.test(password),
            number: numberRegex.test(password),
            specialChar: specialCharRegex.test(password),
        });

        if (key == "confirm") {
            const newErrors = { ...errors }; // Copy current errors object

            if (
                !formData.confirmPassword ||
                formData.newPassword !== formData.confirmPassword
            ) {
                newErrors.confirmPassword = !formData.confirmPassword
                    ? "Confirm the Password"
                    : "Password is mismatched";
            } else {
                newErrors.confirmPassword = null; // Clear error message if validation passes
            }

            setErrors(newErrors);

            // Return validation result
            return Object.values(newErrors).every((error) => error === null); // Return true if there are no errors
        }

        if (
            lengthRegex.test(password) &&
            upperCaseRegex.test(password) &&
            numberRegex.test(password) &&
            specialCharRegex.test(password) &&
            formData.newPassword === formData.confirmPassword // Check if passwords match
        ) {
            setConfirmButtonDisabled(false);
        } else {
            setConfirmButtonDisabled(true);
        }
    };

    const makePatchRequest = async (endpoint, data, token) => {
        // Construct the request headers
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        // Construct the request body
        const body = JSON.stringify(data);

        // Construct the complete URL
        const url = `https://vision-be.kcp.com.in/${endpoint}`;
        // const url = `https://vision-connect.azurewebsites.net/${endpoint}`;

        try {
            const response = await fetch(url, {
                method: "PATCH", // or "GET", "PUT", "DELETE", etc.
                headers,
                body,
            });

            // Check if the response is successful
            if (!response.ok) {
                // Handle the error response
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const responseData = await response.json();

            return responseData;
        } catch (error) {
            // Handle any errors that occurred during the fetch request
            console.error("Error:", error.message);
            throw error;
        }
    };
    


    const handleSubmit = async () => {
        // Perform API request to submit old and new password
        console.log("Submitting old and new password...");
        console.log("confirmButtonDisabled" + confirmButtonDisabled);

        // Reset form data and validation after submission
        if (!confirmButtonDisabled) {
            // Perform API request to submit old and new password

            try {
                console.log("SubmitFormdata");

                const data = {
                    
                    newPassword: formData.newPassword,
                };

                const response = await makePatchRequest(
                    "user/reset-password",
                    data,
                    authToken
                );

                // const response = {
                //     message: "Success",
                // };

     

                if (response?.message == "Success") {
                    setIsSubmitted(true);
                    setShowModal(true);
                    // Reset form data and validation after submission

                    setFormData({
                        newPassword: "",
                        confirmPassword: "",
                        token: "",
                    });
                    setValidation({
                        length: false,
                        upperCase: false,
                        number: false,
                        specialChar: false,
                    });
                }
            } catch (error) {}
        } else {
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSignIn = () => {
        window.location.reload();
    };

    

    const renderValidationCircle = (isValid) => {
        return isValid ? (
            <View
                style={[
                    styles.validationCircle,
                    { backgroundColor: "#2ECC71" },
                ]}
            />
        ) : (
            <View style={styles.validationCircle} />
        );
    };

    return (
        <>
            <View>
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
               
                    className="md:p-10"
                >
                    <Modal.Content className="bg-white md:p-8">
                        <Modal.Body>
                            {isSubmitted == false ? (
                                <View>
                                    <View className="flex flex-row w-11/12">
                                        <View className="w-full">
                                            <Text className="text-lg text-bold">
                                                Reset password
                                            </Text>
                                            <Text className="text-sm text-semibold text-[#898989]">
                                                In order to keep your account
                                                safe you need to create a strong
                                                password.
                                            </Text>
                                        </View>
                                    </View>
                                    <FormControl
                                        isRequired
                                        w="100%"
                                        maxW="300px"
                                        style={{ marginTop: 10 }}
                                    >
                                        <FormControl.Label>
                                            New Password
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="New Password"
                                            value={formData.newPassword}
                                            onChangeText={(value) =>
                                                handleChange(
                                                    "newPassword",
                                                    value
                                                )
                                            }
                                            secureTextEntry={
                                                !passwordVisible.newPassword
                                            }
                                            InputRightElement={
                                                <Pressable
                                                    onPress={() =>
                                                        togglePasswordVisibility(
                                                            "newPassword"
                                                        )
                                                    }
                                                    style={{ paddingRight: 4 }}
                                                >
                                                    <Icon
                                                        name={
                                                            passwordVisible.newPassword
                                                                ? "eye"
                                                                : "eye-slash"
                                                        }
                                                        size={20}
                                                        color="#484848"
                                                    />
                                                </Pressable>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={
                                            errors.confirmPassword !== null
                                        }
                                        w="100%"
                                        maxW="300px"
                                        style={{ marginTop: 10 }}
                                    >
                                        <FormControl.Label>
                                            Confirm Password
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChangeText={(value) =>
                                                handleChange(
                                                    "confirmPassword",
                                                    value
                                                )
                                            }
                                            secureTextEntry={
                                                !passwordVisible.confirmPassword
                                            }
                                            InputRightElement={
                                                <Pressable
                                                    onPress={() =>
                                                        togglePasswordVisibility(
                                                            "confirmPassword"
                                                        )
                                                    }
                                                    style={{ paddingRight: 4 }}
                                                >
                                                    <Icon
                                                        name={
                                                            passwordVisible.confirmPassword
                                                                ? "eye"
                                                                : "eye-slash"
                                                        }
                                                        size={20}
                                                        color="#484848"
                                                    />
                                                </Pressable>
                                            }
                                        />
                                        {"confirmPassword" in errors && (
                                            <FormControl.ErrorMessage>
                                                {errors.confirmPassword}
                                            </FormControl.ErrorMessage>
                                        )}
                                    </FormControl>
                                    <View className="flex flex-col justify-start items-start pt-8">
                                        <Text className="text-xs text-bold text-gray-500">
                                            YOUR PASSWORD MUST CONTAIN
                                        </Text>
                                        <View
                                            style={styles.validationContainer}
                                        >
                                            {renderValidationCircle(
                                                validation.length
                                            )}
                                            <Text className="text-sm text-gray-500 pl-2">
                                                Between 8 and 20 characters
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.validationContainer}
                                        >
                                            {renderValidationCircle(
                                                validation.upperCase
                                            )}
                                            <Text className="text-sm text-gray-500 pl-2">
                                                1 upper case letter
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.validationContainer}
                                        >
                                            {renderValidationCircle(
                                                validation.number
                                            )}
                                            <Text className="text-sm text-gray-500 pl-2">
                                                1 or more numbers
                                            </Text>
                                        </View>
                                        <View
                                            style={styles.validationContainer}
                                        >
                                            {renderValidationCircle(
                                                validation.specialChar
                                            )}
                                            <Text className="text-sm text-gray-500 pl-2">
                                                1 or more special characters
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex flex-row justify-center pt-4">
                                        <Pressable
                                            disabled={confirmButtonDisabled}
                                            className={`bg-[#114EA8] rounded w-full p-1.5 ${
                                                confirmButtonDisabled
                                                    ? "bg-gray-300"
                                                    : ""
                                            }`}
                                            onPress={() => handleSubmit()}
                                            style={{ paddingRight: 4 }}
                                        >
                                            <Text className="text-white text-center">
                                                {" "}
                                                Confirm
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View className="flex flex-col justify-center items-center pt-8 gap-4">
                                    <Text className="text-center text-bold">
                                        Password Changed Successfully
                                    </Text>
                                    <Pressable
                                        onPress={handleSignIn}
                                        className=""
                                        aria-describedby="forgotPassword"
                                    >
                                        <Text className="underline decoration-solid pl-2 text-blue-400">
                                            Click to Sign-in
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    validationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center",
    },
    validationCircle: {
        width: 14,
        height: 14,
        borderRadius: 10,
        backgroundColor: "#EEEEEE",
    },
});

export default ResetPassword;
