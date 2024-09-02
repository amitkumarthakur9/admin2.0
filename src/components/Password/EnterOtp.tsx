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
import ResetPassword from "./ResetPassword";
import { ToastAlert } from "../../../src/helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

const EnterOtp = ({ emailId, token }) => {
    const [countdown, setCountdown] = useState(120);
    const [formData, setFormData] = useState({
        otp: "",
        email: emailId,
        token: token,
    });
    const [newToken, setnewToken] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        otp: null,
    });
    const newErrors = {
        otp: null,
    }; // Initialize empty error object
    const [validation, setValidation] = useState({
        typing: false,
    });
    const toast = useToast();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            // Start countdown timer if countdown is greater than 0
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        // Clear the timer when countdown reaches 0
        if (countdown === 0) {
            clearInterval(timer);
        }

        // Clean up the interval on component unmount
        return () => clearInterval(timer);
    }, [countdown]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };


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

    // Format the remaining time as minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleChange = (key, value) => {
        setValidation({
            typing: true,
        });

        newErrors.otp = null;
        setErrors(newErrors);

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
            console.log(updatedData.otp); // This will also log the current value

            return updatedData;
        });

        setIsSubmitted(false);
    };

    const validate = () => {
        // OTP validation
        const otpRegex = /^\d{6}$/;

        if (!otpRegex.test(formData.otp)) {
            newErrors.otp = !formData.otp
                ? "OTP is required"
                : "Please enter a 6 digit OTP";
        } else {
            newErrors.otp = null; // Clear error message if validation passes
        }

        // Update the error state
        setErrors(newErrors);

        // Return validation result
        return Object.values(newErrors).every((error) => error === null); // Return true if there are no errors
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
        // const url = `https://vision-be.kcp.com.in/${endpoint}`;
        // const url = process.env.API_ENDPOINT$/endpoint;
        // const url = `https://vision-connect.azurewebsites.net/${endpoint}`;

        // console.log(url)
        try {
            const response = await fetch(`${process.env.API_ENDPOINT}/${endpoint}`, {
                method: "PATCH", // or "GET", "PUT", "DELETE", etc.
                headers,
                body,
            });

            // const response: any = await RemoteApi.patch(
            //     endpoint,
            //     body
            // );

            // Check if the response is successful
            if (!response) {
                // Handle the error response
                throw new Error(`HTTP error!`);
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

    const makePostRequest = async (endpoint, data, token) => {
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
            // const response = await fetch(url, {
            //     method: "POST", // or "GET", "PUT", "DELETE", etc.
            //     // headers,
            //     body,
            // });

            const response: any = await RemoteApi.post(
                endpoint,
                body
            );

            // Check if the response is successful
            if (!response) {
                // Handle the error response
                throw new Error(`HTTP error!`);
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


    const makeGetRequest = async (endpoint, data, token) => {
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
            const response = await fetch(`${process.env.API_ENDPOINT}/${endpoint}`, {
                method: "GET", // or "GET", "PUT", "DELETE", etc.
                headers,
                // body,
            });

            // const response: any = await RemoteApi.get(
            //     endpoint
            // );

            // Check if the response is successful
            if (!response) {
                // Handle the error response
                throw new Error(`HTTP error!`);
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
        console.log(formData.otp);
        const isValid = validate();
        if (isValid) {
            // Perform API request to submit old and new password
            console.log(formData.otp);
            try {
                console.log("SubmitFormdata");

                // const response: any = await RemoteApi.patch(
                //     "user/verify-otp",
                //     formData
                // );

                const response = await makePatchRequest(
                    "user/verify-otp",
                    { otp: formData.otp },
                    token
                );



                // const response = {
                //     message: "Success",
                // }

                if (response?.message == "Success") {
                    await setnewToken(response.token);
                    await setIsSubmitted(true);
                    setShowModal(true);
                    // Reset form data and validation after submission

                    setValidation({ typing: false });
                } else {


                   
                    const uniqueId = uuidv4();
                    setToasts([
                        ...toasts,
                        {
                            id: uniqueId,
                            variant: "solid",
                            title: `Wrong OTP`,
                            status: "error",
                        },
                    ]);

                    newErrors.otp = "Wrong OTP";

                    setErrors(newErrors);

                    // Return validation result
                    return Object.values(newErrors).every(
                        (error) => error === null
                    ); // Return true if there are no errors
                }
            } catch (error) {}
        } else {
            setErrors({
                ...errors,
                otp: "Please enter a valid OTP",
            });
        }
    };

    const handleResendEmail = async () => {
        // console.log(formData.email);

        // Perform API request to submit old and new password
        const email = emailId;
        try {
            console.log("SubmitFormdata");

            // const response: any = await RemoteApi.post(
            //     "/user/generate-opt",
            //     formData.email
            // );

            const response = await makeGetRequest(
                "user/resend-otp",
                { email: email },
                token
            );

            setnewToken(response.token);

            if (response?.message == "Success") {
                // Reset form data and validation after submission
                setCountdown(120);
                const uniqueId = uuidv4();
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: `OTP sent succesfully`,
                        status: "success",
                    },
                ]);

                setValidation({ typing: false });
            } else {

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


            }
        } catch (error) {}
    };

    return (
        <>
            {isSubmitted == false ? (
                <View>
                    <Modal isOpen={true} className="md:p-10">
                        <Modal.Content className="bg-white md:p-8">
                            <Modal.Body>
                                <>
                                    <View className="flex flex-row w-full">
                                        <View className="w-full">
                                            <Text className="text-center text-lg text-bold">
                                                Enter OTP
                                            </Text>
                                            <Text className="text-center text-sm text-semibold text-[#898989] span">
                                                We sent a OTP to{" "}
                                                <Text className="font-bold ">
                                                    {formData.email}{" "}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex flex-row w-full">
                                        <View className="w-full">
                                            <FormControl
                                                isRequired
                                                isInvalid={errors.otp !== null}
                                                w="100%"
                                                maxW="300px"
                                                style={{ marginTop: 10 }}
                                            >
                                                <FormControl.Label>
                                                    Enter 6 digit OTP
                                                </FormControl.Label>
                                                <Input
                                                    size="lg"
                                                    variant="outline"
                                                    placeholder="OTP"
                                                    value={formData.otp}
                                                    onChangeText={(value) => {
                                                        if (
                                                            /^\d{0,6}$/.test(
                                                                value
                                                            )
                                                        ) {
                                                            handleChange(
                                                                "otp",
                                                                value
                                                            );
                                                        }
                                                    }}
                                                />
                                                {errors.otp && (
                                                    <FormControl.ErrorMessage>
                                                        {errors.otp}
                                                    </FormControl.ErrorMessage>
                                                )}
                                            </FormControl>

                                            <View className="flex flex-row justify-center pt-4">
                                                <Pressable
                                                    disabled={
                                                        !validation.typing
                                                    }
                                                    className={
                                                        (validation.typing
                                                            ? "bg-[#114EA8]  "
                                                            : "bg-gray-400  ") +
                                                        "rounded w-full p-1.5"
                                                    }
                                                    onPress={() =>
                                                        handleSubmit()
                                                    }
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
                                                        Submit OTP
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="flex flex-row pt-8">
                                        <Text className="text-sm text-semibold text-[#898989]">
                                            Haven’t got the email yet?
                                        </Text>
                                        <Pressable
                                            onPress={handleResendEmail}
                                            className=""
                                            aria-describedby="forgotPassword"
                                            disabled={countdown > 0} // Disable resend button during countdown
                                        >
                                            <Text
                                                className={`underline decoration-solid pl-2 ${
                                                    countdown > 0
                                                        ? "text-gray-400"
                                                        : "text-blue-400"
                                                }`}
                                            >
                                                {countdown > 0
                                                    ? `Resend in ${formatTime(
                                                          countdown
                                                      )}`
                                                    : "Resend email"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </View>
            ) : (
                <ResetPassword authToken={newToken} />
            )}
            ;
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

export default EnterOtp;
