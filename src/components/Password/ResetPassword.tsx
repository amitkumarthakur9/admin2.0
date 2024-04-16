import React, { useState } from "react";
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

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
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
    const [showModal, setShowModal] = useState(false);
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
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: value,
            };
    
            return updatedData;
        });
        validatePassword(field === "confirmPassword" ? formData.newPassword : value);
        console.log(formData.confirmPassword)
        console.log(formData.newPassword)
        if (field === "confirmPassword") {
            console.log(value)
            validate();
        }
    };
    
    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validate = () => {
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
    };

    const validatePassword = (password) => {
        const lengthRegex = /.{8,20}/;
        const upperCaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[^A-Za-z0-9]/;
        console.log(formData.confirmPassword)
        console.log(formData.newPassword)

        setValidation({
            length: lengthRegex.test(password),
            upperCase: upperCaseRegex.test(password),
            number: numberRegex.test(password),
            specialChar: specialCharRegex.test(password),
        });

        if (
            lengthRegex.test(password) &&
            upperCaseRegex.test(password) &&
            numberRegex.test(password) &&
            specialCharRegex.test(password) &&
            (formData.newPassword === formData.confirmPassword) // Check if passwords match
        ) {
            setConfirmButtonDisabled(false);
        } else {
            setConfirmButtonDisabled(true);
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

                // const response: any = await RemoteApi.post(
                //     "/onboard/distributor",
                //     formData.email
                // );

                const response = {
                    message: "Success",
                };

                if (response?.message == "Success") {
                    setIsSubmitted(true);
                    setShowModal(true);
                    // Reset form data and validation after submission

                    setFormData({
                        newPassword: "",
                        confirmPassword: "",
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
            <Pressable onPress={() => setShowModal(true)}>
                {<Text>Reset Password</Text>}
            </Pressable>
            <View>
                <Modal
                    isOpen={true}
                    onClose={handleCloseModal}
                    p="10"
                    className=""
                >
                    <Modal.Content className="bg-white p-8">
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
                                                    ? "opacity-50"
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
                                <View className="flex flex-col justify-center items-center pt-8">
                                    <Text className="text-sm text-semibold text-[#898989]">
                                        Password Changed Successfully
                                    </Text>
                                    <Pressable
                                        onPress={() => router.push(`sign-in`)}
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
