import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
    Modal,
    Pressable,
    FormControl,
    Button,
    Text,
    Input,
    useToast,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import RemoteApi from "../../../src/services/RemoteApi";
import { router } from "expo-router";
import { useStorageState } from "../../../src/services/useStorageState";
import EnterOtp from "./EnterOtp";
import axios, { AxiosRequestConfig } from "axios";
import { ToastAlert } from "../../../src/helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

const ForgotPassword = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        token: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFailed, setShowFailed] = useState(false);
    const [isfailed, setIsfailed] = useState(false);
    const [apiError, setApiError] = useState({
        valid: false,
        message: "",
    });
    const [errors, setErrors] = useState({
        email: null,
    });
    const newErrors = {
        email: null,
    }; // Initialize empty error object
    const [validation, setValidation] = useState({
        typing: false,
    });
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Clear existing toasts
        toast.closeAll();

        // Show the latest toast
        if (toasts.length > 0) {
            const latestToast = toasts[toasts.length - 1];
            toast.show({
                render: () => (
                    <ToastAlert
                        id={latestToast.id}
                        variant={latestToast.variant}
                        title={latestToast.title}
                        description=""
                        isClosable={false}
                        toast={toast}
                        status={latestToast.status}
                        onClose={() => removeToast(latestToast.id)} // Remove the toast from the 'toasts' array when closed
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const setToken = async (newToken) => {
        await setFormData((prevFormData) => ({
            ...prevFormData,
            token: newToken,
        }));
    };

    const ApiError = async (valid, message) => {
        console.log(valid, message);
        await setApiError((prevFormData) => ({
            ...prevFormData,
            valid: valid,
            message: message,
        }));
    };

    const handleChange = (key, value) => {
        setValidation({
            typing: true,
        });

        setErrors({
            ...errors,
            email: null,
        });

        new Error(null);

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

    const makeFetchRequest = async (endpoint, data, token) => {
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
            const response: any = await fetch(url, {
                method: "POST", // or "GET", "PUT", "DELETE", etc.
                headers,
                body,
            });

            // console.log("main api response" + response.json())

        
            // Check if the response is successful
            if (!response.ok) {
                // Handle the error response
                // await ApiError(true,response.status)
                const uniqueId = uuidv4();
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: `Internal server Error! Status: ${response.status}`,
                        status: "error",
                    },
                ]);

                console.log(response);
                throw new Error(
                    `Internal server Error! Status: ${response.message}`
                );
            }

            // Parse the JSON response
            const responseData = await response.json();

            // const responseData = {
            //     message:"Success",
            // }

            return responseData;
        } catch (error) {
            // Handle any errors that occurred during the fetch request
            console.error("Error:", error.message);
            throw error;
        }
    };

    const handleSubmit = async () => {
        // setValidation({
        //     typing: false,
        // });
        console.log(formData.email);
        const isValid = validate();
        if (isValid) {
            // Perform API request to submit old and new password
            console.log(formData.email);
            try {
                console.log("SubmitFormdata");
                const response = await makeFetchRequest(
                    "user/generate-otp",
                    { email: formData.email },
                    null
                );

                console.log(response);

                if (response?.message == "Success") {
                    await setToken(response?.token);
                    await setIsSubmitted(true);
                    await setShowModal(true);
                    // Reset form data and validation after submission

                    // router.push(`otp-reset-password/${formData.email}`);

                    setValidation({ typing: false });
                } else {
                    // Update the error state
                    const uniqueId = uuidv4();
                    setToasts([
                        ...toasts,
                        {
                            id: uniqueId,
                            variant: "solid",
                            title: `Email doesn't exist. ${response.message}`,
                            status: "error",
                        },
                    ]);

                    if (response.code === 251) {
                        newErrors.email = "Email doesn't exist.";
                        setErrors(newErrors);
                    }

                    // await ApiError(true,response.error.message)
                    // await setIsSubmitted(true);
                    await setIsfailed(true);

                    console.log(isfailed);
                }
            } catch (error) {
                await ApiError(true, error.message);
            }
        } else {
            setErrors({
                ...errors,
                email: "Please enter a valid email address",
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsSubmitted(false);
        setIsfailed(false);
        setValidation({
            typing: false,
        });
        setFormData({
            email: "",
            otp: "",
            token: "",
        });
    };

    if (isfailed) {
    }

    const RequestFailed = () => {
        return (
            <View>
                <View className="flex flex-row w-11/12">
                    <View className="w-full">
                        <Text className="text-lg text-bold">
                            Forgot password
                        </Text>
                        <Text className="text-sm text-semibold text-[#898989]">
                            Server error Request failed
                        </Text>
                    </View>
                </View>
            </View>
        );
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
                    className="md:p-10"
                >
                    <Modal.Content className="bg-white md:p-8">
                        <Modal.Body>
                            {
                                isSubmitted == false ? (
                                    <View>
                                        <View className="flex flex-row w-11/12">
                                            <View className="w-full">
                                                <Text className="text-lg text-bold">
                                                    Forgot password
                                                </Text>
                                                <Text className="text-sm text-semibold text-[#898989]">
                                                    Please enter your email to
                                                    reset the password
                                                </Text>
                                            </View>

                                            <Pressable
                                                onPress={handleCloseModal}
                                                className={
                                                    "flex flex-row justify-center items-center  rounded px-2 h-[20px] border-slate-200"
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
                                    // : (isfailed ? (
                                    //     <>
                                    //         <View>
                                    //             <View className="flex flex-row w-11/12">
                                    //                 <View className="w-full">
                                    //                     <Text className="text-base text-bold text-center text-red-500 pb-4">
                                    //                     Wrong
                                    //                     </Text>

                                    //                     <Pressable
                                    //                  onPress={handleCloseModal}
                                    //                 className=""
                                    //                 aria-describedby="forgotPassword"
                                    //             >
                                    //                 <Text className="underline decoration-solid pl-2 text-blue-400 text-center">
                                    //                 Try Again
                                    //                 </Text>
                                    //             </Pressable>
                                    //                 </View>
                                    //             </View>
                                    //         </View>
                                    //     </>
                                    // )

                                    <EnterOtp
                                        emailId={formData.email}
                                        token={formData.token}
                                    />
                                )
                                // )
                            }

                            {/* {
                                apiError.valid && <Text className="text-red-400">{apiError.message}</Text>
                            } */}
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
