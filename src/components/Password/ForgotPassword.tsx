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
import RemoteApi from "../../../src/services/RemoteApi";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        email: null,
    });
    const newErrors = {
        email: null,
    }; // Initialize empty error object
    const [validation, setValidation] = useState({
        typing: false,
    });

    const handleChange = (key, value) => {
        setValidation({
            typing: true,
        });
    
        if (isSubmitted) {
            // If the form has been submitted, clear validation errors on change
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: null,
            }));
        }
    
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [key]: value,
            };
    
            console.log(value); // This will log the current value
            console.log(updatedData.email); // This will also log the current value
    
            return updatedData;
        });
    
        setIsSubmitted(false);
    };
    
    

    const validate = () => {
        console.log("validateemail");
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = !formData.email
                ? "Email is required"
                : "Please enter a valid email address";
        } else {
            newErrors.email = null; // Clear error message if validation passes
        }

        // Update the error state
        setErrors(newErrors);

        // Return validation result
        return Object.values(newErrors).every((error) => error === null); // Return true if there are no errors
    };

    const handleSubmit = async () => {
        console.log("submitting");
        console.log(formData.email);
        const isValid = validate();
        if (isValid) {
            // Perform API request to submit old and new password
            console.log(formData.email);
            try {
                console.log("SubmitFormdata");

                // const response: any = await RemoteApi.post(
                //     "/onboard/distributor",
                //     formData.email
                // );

                // if (response?.message == "Success") {
                setIsSubmitted(true);
                setShowModal(true);
                // Reset form data and validation after submission

                setValidation({ typing: false });
                // }
            } catch (error) {}
        } else {
            setErrors({
                ...errors,
                email: "Please enter a valid email address",
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setValidation({
            typing: false,
        });
    };

    return (
        <>
            <Pressable onPress={() => setShowModal(true)}>
                <Text className="text-[#170F49] text-base font-bold p-4 ">
                    Forgot Password?
                </Text>
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
                            {isSubmitted == false ? (
                                <View>
                                    <View className="flex flex-row w-11/12">
                                        <View className="w-full">
                                            <Text className="text-lg text-bold">
                                                Forgot password
                                            </Text>
                                            <Text className="text-sm text-semibold text-[#898989]">
                                                Please enter your email to reset
                                                the password
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={handleCloseModal}
                                            className={
                                                "flex flex-row justify-center items-center border-[1px] rounded px-2 h-[20px] border-slate-200"
                                            }
                                            aria-describedby="forgotPassword"
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
                                        isInvalid={errors.email !== null}
                                        w="100%"
                                        maxW="300px"
                                        style={{ marginTop: 10 }}
                                    >
                                        <FormControl.Label>
                                            Your Email
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChangeText={(value) =>
                                                handleChange("email", value)
                                            }
                                        />
                                        {errors.email && (
                                            <FormControl.ErrorMessage>
                                                {errors.email}
                                            </FormControl.ErrorMessage>
                                        )}
                                    </FormControl>
                                    <View className="flex flex-row justify-center pt-4">
                                        <Pressable
                                            disabled={!validation.typing}
                                            className={
                                                (validation.typing
                                                    ? "bg-[#114EA8]  "
                                                    : "bg-gray-400  ") +
                                                "rounded w-full p-1.5"
                                            }
                                            onPress={() => handleSubmit()}
                                            style={{ paddingRight: 4 }}
                                        >
                                            <Text
                                                className={
                                                    validation.typing
                                                        ? "text-white text-center"
                                                        : "text-white text-center"
                                                }
                                            >
                                                {" "}
                                                Reset Password
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View className="flex flex-row w-full">
                                        <View className="w-full">
                                            <Text className="text-lg text-bold">
                                                Forgot password
                                            </Text>
                                            <Text className="text-sm text-semibold text-[#898989] span">
                                                We sent a reset link to{" "}
                                                <Text className="font-bold ">{formData.email} </Text>
                                                click on the link to reset your
                                                password
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={handleCloseModal}
                                            className={
                                                "flex flex-row justify-center items-center border-[1px] rounded px-1 h-[20px] border-slate-200"
                                            }
                                            aria-describedby="forgotPassword"
                                        >
                                            <Icon
                                                name="close"
                                                size={14}
                                                color="#484848"
                                            />
                                        </Pressable>
                                    </View>
                                    <View className="flex flex-row pt-8">
                                        <Text className="text-sm text-semibold text-[#898989]">
                                            Haven’t got the email yet?
                                        </Text>
                                        <Pressable
                                            onPress={handleCloseModal}
                                            className=""
                                            aria-describedby="forgotPassword"
                                        >
                                            <Text className="underline decoration-solid pl-2 text-blue-400">
                                                Resend email
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
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

export default ForgotPassword;
