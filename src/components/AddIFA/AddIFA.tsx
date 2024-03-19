import React, { useEffect, useState } from "react";
import { Alert, TextInput, View } from "react-native";
import {
    Button,
    Center,
    CheckCircleIcon,
    FormControl,
    HStack,
    Heading,
    Image,
    Input,
    Menu,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    WarningIcon,
    WarningOutlineIcon,
} from "native-base";
import Modal from "../Modal/Modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";

export default function AddIFAUser() {
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        "Residential Individual"
    );
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState();
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        phone: null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const options = [
        {
            option: "Residential Individual",
            value: "4322",
        },
        {
            option: "Foreign",
            value: "4321",
        },
        {
            option: "NRA",
            value: "4320",
        },
    ];

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        pan: "",
    });

    const newErrors = {
        name: null,
        email: null,
        phone: null,
    }; // Initialize empty error object

    const validate = () => {
        // Name validation
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = !formData.name
                ? "Name is required"
                : "Name should contain at least 3 characters";
        } else {
            newErrors.name = null; // Clear error message if validation passes
        }

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = !formData.phone
                ? "Phone number is required"
                : "Please enter a valid 10-digit phone number";
        } else {
            newErrors.phone = null; // Clear error message if validation passes
        }

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

    const handleChange = (key, value) => {
        if (isSubmitted) {
            // If the form has been submitted, clear validation errors on change
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: null,
            }));
        }

        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleOptionSelect = (option, optionValue) => {
        setSelectedOption(option);
        setValue(optionValue);
        setIsOpen(false);
    };

    const handleSubmit = () => {
        // Set the form as submitted
        setIsSubmitted(true);

        // Perform validation
        const isValid = validate();

        if (isValid) {
            console.log("Submitted successfully");
            // Reset submitted state and clear form data
            setIsSubmitted(false);
            setFormData({
                name: "",
                password: "",
                confirmPassword: "",
                email: "",
                phone: "",
                pan: "",
            });
        } else {
            console.log("Validation failed");
        }
    };
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View className="flex flex-row lg:mt-0">
                <Pressable
                    onPress={showDialog}
                    className={
                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                    }
                    aria-require="addNewClient"
                >
                    <Icon name="plus" size={14} color="#484848" />

                    {<Text className="mx-2">Add IFA</Text>}
                </Pressable>
                <Portal>
                    <Dialog
                        visible={modalVisible}
                        onDismiss={hideDialog}
                        dismissable
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignSelf: "center",
                            width: 600,
                            height: "80%",
                            overflow: "scroll",
                            backgroundColor: "white",
                        }}
                    >
                        <View className="p-4">
                            <View className="flex flex-row justify-between">
                                <Text className="pl-4 text-lg font-bold">
                                    Add IFA
                                </Text>

                                <Pressable
                                    onPress={hideDialog}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
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
                            <View className="flex flex-col items-center">
                                <View className="gap-4">
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.name !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Name
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Name as on PAN"
                                            value={formData.name}
                                            onChangeText={(value) =>
                                                handleChange("name", value)
                                            }
                                        />
                                        {errors.name ? (
                                            <FormControl.ErrorMessage>
                                                {errors.name}
                                            </FormControl.ErrorMessage>
                                        ) : (
                                            <FormControl.HelperText>
                                                Name should contain at least 3
                                                characters.
                                            </FormControl.HelperText>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.email !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Email Address
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChangeText={(value) =>
                                                handleChange("email", value)
                                            }
                                        />
                                        {"email" in errors && (
                                            <FormControl.ErrorMessage>
                                                {errors.email}
                                            </FormControl.ErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.phone !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Mobile Number
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Mobile Number"
                                            value={formData.phone}
                                            onChangeText={(value) =>
                                                handleChange("phone", value)
                                            }
                                        />
                                        {errors.phone ? (
                                            <FormControl.ErrorMessage>
                                                {errors.phone}
                                            </FormControl.ErrorMessage>
                                        ) : (
                                            <FormControl.HelperText>
                                                Enter 10 digit phone
                                                Number.
                                            </FormControl.HelperText>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={errors.phone !== null}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            ARN Number
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Mobile Number"
                                            value={formData.phone}
                                            onChangeText={(value) =>
                                                handleChange("phone", value)
                                            }
                                        />
                                        {errors.phone ? (
                                            <FormControl.ErrorMessage>
                                                {errors.phone}
                                            </FormControl.ErrorMessage>
                                        ) : (
                                            <FormControl.HelperText>
                                                Enter 10 digit phone
                                                Number.
                                            </FormControl.HelperText>
                                        )}
                                    </FormControl>
                                    <Button
                                        width="100%"
                                        bgColor={"#013974"}
                                        onPress={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Dialog>
                </Portal>
            </View>
        </View>
    );
}
