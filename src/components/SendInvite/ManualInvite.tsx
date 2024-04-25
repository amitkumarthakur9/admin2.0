import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
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
    useToast,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";
import RemoteApi from "../../../src/services/RemoteApi";
import { ToastAlert } from "../../../src/helper/CustomToaster";
import UploadCsv from "./UploadCSV";

export default function ManualInvite({ getlist = () => {} }) {
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const toast = useToast();
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        phone: null,
    });
    const newErrors = {
        name: null,
        email: null,
        phone: null,
    }; // Initialize empty error object
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required";
        } else {
            newErrors.name = null; // Clear error message if validation passes
        }

        // phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = !formData.phone
                ? "phone number is required"
                : "Please enter a valid 10-digit phone number";
        } else {
            newErrors.phone = null; // Clear error message if validation passes
        }

        // Email validation
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(formData.email)) {
        //     newErrors.email =  "Please enter a valid email address";
        // } else {
        //     newErrors.email = null; // Clear error message if validation passes
        // }

        // Update the error state
        setErrors(newErrors);

        // Return validation result
        return Object.values(newErrors).every((error) => error === null); // Return true if there are no errors
    };

    const handleSubmit = async () => {
        console.log("manualcontactformData");

        console.log(formData);

        setIsSubmitted(true);

        const isValid = validate();

        if (isValid) {
            const data = {
                contacts: [
                    {
                        name: formData.name,
                        email: formData.email,
                        mobileNumber: formData.phone,
                        sourceId: 1,
                    },
                ],
            };

            try {
                console.log("ManualContact");
                console.log(data);
                // throw new Error('This is an explicitly thrown error');
                const response: any = await RemoteApi.post(
                    "onboard/client/save",
                    data
                );

                // const response = {
                //     message: "success",
                //     error: "blunder"
                // }

                if (response?.message == "Success") {
                    hideDialog();

                    toast.show({
                        render: () => (
                            <ToastAlert
                                id={123} // Unique identifier for the toast
                                status="success" // Toast status (success, error, warning, info)
                                variant="solid" // Toast variant (solid, subtle, left-accent, top-accent)
                                title="Success" // Toast title
                                description="Contact added succesfully" // Toast description
                                isClosable={false} // Whether the toast is closable
                                toast={toast} // Pass the toast function to close the toast
                            />
                        ),
                        duration: 1000,
                    });

                    setFormData({
                        name: "",
                        email: "",
                        phone: "",
                    });

                    getlist();
                } else {
                }
            } catch (error) {
                hideDialog();
                console.log(error);
                toast.show({
                    render: () => (
                        <ToastAlert
                            id={123} // Unique identifier for the toast
                            status="error" // Toast status (success, error, warning, info)
                            variant="solid" // Toast variant (solid, subtle, left-accent, top-accent)
                            title={error} // Toast title
                            description={error} // Toast description
                            isClosable={false} // Whether the toast is closable
                            toast={toast} // Pass the toast function to close the toast
                        />
                    ),
                    duration: 1500,
                });
            }
        } else {
            // toast.show({
            //     render: () => (
            //       <ToastAlert
            //         id={123} // Unique identifier for the toast
            //         status="Warning" // Toast status (success, error, warning, info)
            //         variant="solid" // Toast variant (solid, subtle, left-accent, top-accent)
            //         title="Validation error" // Toast title
            //         description="Validation error" // Toast description
            //         isClosable = {false} // Whether the toast is closable
            //         toast={toast} // Pass the toast function to close the toast
            //       />
            //     ),
            //     duration: 1500
            //   });
        }
    };

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    return (
        <View
        // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View className="flex flex-row lg:mt-0">
                <Pressable
                    onPress={showDialog}
                    className={
                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                    }
                    aria-require="addNewClient"
                >
                    {/* <Icon name="plus" size={14} color="#484848" /> */}

                    {<Text className="mx-2">Add Contact</Text>}
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
                            height: "80%",
                            overflow: "scroll",
                            backgroundColor: "white",
                            minWidth: 320,
                            maxWidth: 600,
                        }}
                    >
                        <View className="p-4">
                            <View className="flex flex-row justify-between md:w-[500px]">
                                <Text className="text-lg pl-4 font-bold">
                                    Add Contacts
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
                            <UploadCsv />

                            <View className="bg-white">
                                <View className="w-full flex items-center">
                                    <View
                                        className={
                                            "mt-4 z-[-1] w-[99%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px] shadow"
                                        }
                                    >
                                        <Text
                                            selectable
                                            className={
                                                "text-base md:text-lg font-bold mt-[10px]"
                                            }
                                        >
                                            {"Add contact manually"}
                                        </Text>
                                        <View className="flex flex-col items-center">
                                            <View className="gap-4">
                                                <FormControl
                                                    isRequired
                                                    isInvalid={
                                                        errors.name !== null
                                                    }
                                                    w="100%"
                                                    maxW="300px"
                                                >
                                                    <FormControl.Label>
                                                        Name
                                                    </FormControl.Label>
                                                    <Input
                                                        size="lg"
                                                        variant="outline"
                                                        placeholder="Name"
                                                        value={formData.name}
                                                        onChangeText={(value) =>
                                                            handleChange(
                                                                "name",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    {"name" in errors && (
                                                        <FormControl.ErrorMessage>
                                                            {errors.name}
                                                        </FormControl.ErrorMessage>
                                                    )}
                                                </FormControl>
                                                <FormControl
                                                    isInvalid={
                                                        errors.email !== null
                                                    }
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
                                                            handleChange(
                                                                "email",
                                                                value
                                                            )
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
                                                    isInvalid={
                                                        errors.phone !== null
                                                    }
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
                                                            handleChange(
                                                                "phone",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    {errors.phone ? (
                                                        <FormControl.ErrorMessage>
                                                            {errors.phone}
                                                        </FormControl.ErrorMessage>
                                                    ) : (
                                                        <FormControl.HelperText>
                                                            Enter 10 digit
                                                            mobile Number.
                                                        </FormControl.HelperText>
                                                    )}
                                                </FormControl>
                                                <Button
                                                    width="100%"
                                                    bgColor={"#013974"}
                                                    marginBottom={2}
                                                    onPress={handleSubmit}
                                                >
                                                    Add Contact
                                                </Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Dialog>
                </Portal>
            </View>
        </View>
    );
}
