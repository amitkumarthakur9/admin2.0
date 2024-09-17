import React from "react";
import { View, Modal, Pressable } from "react-native";
import {
    Button,
    FormControl,
    Input,
    Text,
    useToast,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastAlert } from "../../../src/helper/CustomToaster";
import RemoteApi from "../../../src/services/RemoteApi";

const emailRegexRFC5322 =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/;

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Full Name should contain only alphabets")
    .min(3, "Full Name should contain at least 3 alphabets")
    .required("Full Name is required"),
    email: Yup.string()
        .matches(emailRegexRFC5322, "Invalid email address")
        .required("Email is required"),
    mobileNumber: Yup.string()
    .matches(/^(?!00)(?!.*(\d)\1{9}$)\d{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
});

export default function ManualInvite({ getlist = () => {}, children }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const toast = useToast();

    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);

    const handleSubmit = async (values, { resetForm }) => {
        const data = {
            contacts: [
                {
                    name: values.fullName,
                    email: values.email,
                    mobileNumber: values.mobileNumber,
                    sourceId: 1,
                },
            ],
        };

        try {
            const response = await RemoteApi.post("invite/client/save", data);

            if (response?.message == "Success") {
                hideDialog();

                toast.show({
                    render: () => (
                        <ToastAlert
                            id={123}
                            status="success"
                            variant="solid"
                            title="Success"
                            description="Contact added successfully"
                            isClosable={false}
                            toast={toast}
                        />
                    ),
                    duration: 1000,
                });

                resetForm();
                getlist();
            }
        } catch (error) {
            hideDialog();
            toast.show({
                render: () => (
                    <ToastAlert
                        id={123}
                        status="error"
                        variant="solid"
                        title="Error"
                        description={error.message || "An error occurred"}
                        isClosable={false}
                        toast={toast}
                    />
                ),
                duration: 1500,
            });
        }
    };

    return (
        <View>
            <View className="flex flex-row lg:mt-0">
                <Pressable
                    onPress={showDialog}
                    className={
                        "flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"
                    }
                    aria-require="addNewClient"
                >
                    <Text className="mx-2">Add Contact</Text>
                </Pressable>
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={hideDialog}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, minWidth: 400, maxWidth: 600 }}>
                            <Formik
                                initialValues={{
                                    fullName: "",
                                    email: "",
                                    mobileNumber: "",
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                    isValid,
                                }) => (
                                    <View>
                                        <View className="flex flex-row justify-between">
                                            <Text className="text-lg font-bold">
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
                                        {children}
                                        <View className="bg-white mt-4">
                                            <View className="w-full flex items-center">
                                                <View
                                                    className={
                                                        "mt-4 w-full flex items-center"
                                                    }
                                                >
                                                    <Text
                                                        selectable
                                                        className={
                                                            "text-base md:text-lg font-bold"
                                                        }
                                                    >
                                                        {"Add contact manually"}
                                                    </Text>
                                                    <View className="flex flex-col items-center gap-4 mt-4 w-11/12">
                                                        <FormControl
                                                            isRequired
                                                            isInvalid={
                                                                touched.fullName &&
                                                                errors.fullName
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
                                                                onChangeText={handleChange(
                                                                    "fullName"
                                                                )}
                                                                onBlur={handleBlur(
                                                                    "fullName"
                                                                )}
                                                                value={
                                                                    values.fullName
                                                                }
                                                            />
                                                            {touched.fullName &&
                                                            errors.fullName ? (
                                                                <FormControl.ErrorMessage>
                                                                    {
                                                                        errors.fullName
                                                                    }
                                                                </FormControl.ErrorMessage>
                                                            ) : null}
                                                        </FormControl>

                                                        <FormControl
                                                            isRequired
                                                            isInvalid={
                                                                touched.email &&
                                                                errors.email
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
                                                                onChangeText={handleChange(
                                                                    "email"
                                                                )}
                                                                onBlur={handleBlur(
                                                                    "email"
                                                                )}
                                                                value={
                                                                    values.email
                                                                }
                                                            />
                                                            {touched.email &&
                                                            errors.email ? (
                                                                <FormControl.ErrorMessage>
                                                                    {errors.email}
                                                                </FormControl.ErrorMessage>
                                                            ) : null}
                                                        </FormControl>

                                                        <FormControl
                                                            isRequired
                                                            isInvalid={
                                                                touched.mobileNumber &&
                                                                errors.mobileNumber
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
                                                                keyboardType="numeric"
                                                                maxLength={10}
                                                                onChangeText={handleChange(
                                                                    "mobileNumber"
                                                                )}
                                                                onBlur={handleBlur(
                                                                    "mobileNumber"
                                                                )}
                                                                value={
                                                                    values.mobileNumber
                                                                }
                                                            />
                                                            {touched.mobileNumber &&
                                                            errors.mobileNumber ? (
                                                                <FormControl.ErrorMessage>
                                                                    {
                                                                        errors.mobileNumber
                                                                    }
                                                                </FormControl.ErrorMessage>
                                                            ) : (
                                                                <FormControl.HelperText>
                                                                    Enter 10 digit
                                                                    mobile number.
                                                                </FormControl.HelperText>
                                                            )}
                                                        </FormControl>
                                                        <Button
                                                            width="100%"
                                                            bgColor={"#013974"}
                                                            marginBottom={2}
                                                            onPress={handleSubmit}
                                                            isDisabled={!isValid}
                                                        >
                                                            Add Contact
                                                        </Button>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}
