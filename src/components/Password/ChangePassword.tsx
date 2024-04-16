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

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordVisible, setPasswordVisible] = useState({
        oldPassword: false,
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

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        validatePassword(value);
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validatePassword = (password) => {
        const lengthRegex = /.{8,20}/;
        const upperCaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[^A-Za-z0-9]/;

        setValidation({
            length: lengthRegex.test(password),
            upperCase: upperCaseRegex.test(password),
            number: numberRegex.test(password),
            specialChar: specialCharRegex.test(password),
        });
    };

    const handleSubmit = () => {
        // Perform API request to submit old and new password
        console.log("Submitting old and new password...");
        setShowModal(true);
        // Reset form data and validation after submission
        setFormData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setValidation({
            length: false,
            upperCase: false,
            number: false,
            specialChar: false,
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const renderValidationCircle = (isValid) => {
        return isValid ? (
            <View
                style={[styles.validationCircle, { backgroundColor: "#2ECC71" }]}
            />
        ) : (
            <View style={styles.validationCircle} />
        );
    };

    return (
        <>
            <Pressable onPress={() => setShowModal(true)}>
                {<Text>Change Password</Text>}
            </Pressable>
            <View>
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    p="10"
                    className=""
                >
                    <Modal.Content className="bg-white p-8">
                        <Modal.Body>
                            <View className="flex flex-row w-11/12">
                                <View className="w-full">
                                    <Text className="text-lg text-bold">
                                        Change password
                                    </Text>
                                    <Text className="text-sm text-semibold text-[#898989]">
                                        In order to keep your account safe you
                                        need to create a strong password.
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={handleCloseModal}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-2 h-[20px] border-slate-200"
                                    }
                                    aria-describedby="addNewClient"
                                >
                                    <Icon
                                        name="close"
                                        size={14}
                                        color="#484848"
                                    />
                                </Pressable>
                            </View>
                            <FormControl
                                isRequired
                                isInvalid={false}
                                w="100%"
                                maxW="300px"
                                style={{ marginTop: 10 }}
                            >
                                <FormControl.Label>
                                    Old Password
                                </FormControl.Label>
                                <Input
                                    size="lg"
                                    variant="outline"
                                    placeholder="Password"
                                    value={formData.oldPassword}
                                    onChangeText={(value) =>
                                        handleChange("oldPassword", value)
                                    }
                                    secureTextEntry={
                                        !passwordVisible.oldPassword
                                    }
                                    InputRightElement={
                                        <Pressable
                                            onPress={() =>
                                                togglePasswordVisibility(
                                                    "oldPassword"
                                                )
                                            }
                                            style={{ paddingRight: 4 }}
                                        >
                                            <Icon
                                                name={
                                                    passwordVisible.oldPassword
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
                                isInvalid={false}
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
                                        handleChange("newPassword", value)
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
                                isInvalid={false}
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
                                        handleChange("confirmPassword", value)
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
                            </FormControl>
                            <View className="flex flex-col justify-start items-start pt-8">
                                <Text
                                    className="text-xs text-bold text-gray-500"
                                >
                                    YOUR PASSWORD MUST CONTAIN
                                </Text>
                                <View style={styles.validationContainer}>
                                    {renderValidationCircle(validation.length)}
                                    <Text className="text-sm text-gray-500 pl-2">Between 8 and 20 characters</Text>
                                </View>
                                <View style={styles.validationContainer}>
                                    {renderValidationCircle(
                                        validation.upperCase
                                    )}
                                    <Text className="text-sm text-gray-500 pl-2">1 upper case letter</Text>
                                </View>
                                <View style={styles.validationContainer}>
                                    {renderValidationCircle(validation.number)}
                                    <Text className="text-sm text-gray-500 pl-2">1 or more numbers</Text>
                                </View>
                                <View style={styles.validationContainer}>
                                    {renderValidationCircle(
                                        validation.specialChar
                                    )}
                                    <Text className="text-sm text-gray-500 pl-2">1 or more special characters</Text>
                                </View>
                            </View>
                            <View className="flex flex-row justify-center pt-4">
                                <Pressable
                                    className="bg-[#114EA8] rounded w-6/12 "
                                    onPress={() => handleSubmit()}
                                    style={{ paddingRight: 4 }}
                                >
                                    <Text className="text-white text-center">
                                        {" "}
                                        Confirm
                                    </Text>
                                </Pressable>
                            </View>
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

export default ChangePassword;
