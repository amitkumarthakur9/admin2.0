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
} from "native-base";
import Modal from "../Modal/Modal";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";

export default function AddNewClient() {
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        "Residential Individual"
    );
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState();

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

    const handleSubmit = () => {
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Proceed with form submission

        formData;
        console.log(formData);
    };

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        pan: "",
    });

    const handleChange = (key, value) => {
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

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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

                    {<Text className="mx-2">Add New Client</Text>}
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
                                    Add Client
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
                                        isInvalid={false}
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
                                        <FormControl.ErrorMessage
                                            leftIcon={
                                                <WarningOutlineIcon size="xs" />
                                            }
                                        >
                                            Try different from previous
                                            passwords.
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={false}
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
                                        <FormControl.ErrorMessage
                                            leftIcon={
                                                <WarningOutlineIcon size="xs" />
                                            }
                                        >
                                            Try different from previous
                                            passwords.
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={false}
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
                                        <FormControl.ErrorMessage
                                            leftIcon={
                                                <WarningOutlineIcon size="xs" />
                                            }
                                        >
                                            Try different from previous
                                            passwords.
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={false}
                                        w="100%"
                                        maxW="300px"
                                        style={{ marginTop: 10 }}
                                    >
                                        <FormControl.Label>
                                            Password
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChangeText={(value) =>
                                                handleChange("password", value)
                                            }
                                            secureTextEntry={!passwordVisible}
                                            InputRightElement={
                                                <Pressable
                                                    onPress={
                                                        togglePasswordVisibility
                                                    }
                                                    style={{ paddingRight: 4 }}
                                                >
                                                    <Icon
                                                        name={
                                                            passwordVisible
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
                                                handleChange(
                                                    "confirmPassword",
                                                    value
                                                )
                                            }
                                            secureTextEntry={!passwordVisible}
                                        />
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={false}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            Account is being opened for
                                        </FormControl.Label>
                                        {/* <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="Residental Individual"
                                            value={formData.name}
                                            onChangeText={(value) =>
                                                handleChange("name", value)
                                            }
                                        /> */}
                                        <Menu
                                            isOpen={isOpen}
                                            onClose={() => setIsOpen(false)}
                                            trigger={(triggerProps) => {
                                                return (
                                                    <Pressable
                                                        accessibilityLabel="More options menu"
                                                        {...triggerProps}
                                                        onPress={() =>
                                                            setIsOpen(!isOpen)
                                                        }
                                                    >
                                                        <View className="flex flex-row items-center border-2 border-slate-400 justify justify-between h-auto pr-4 rounded">
                                                            <Text
                                                                selectable
                                                                style={{
                                                                    fontSize: 16,
                                                                    color: "#a3a3a3",
                                                                    // fontWeight:
                                                                    //     "semi-bold",
                                                                    paddingLeft: 12,
                                                                    paddingTop: 4,
                                                                    paddingBottom: 4,
                                                                }}
                                                            >
                                                                {selectedOption ||
                                                                    "Select Option"}
                                                            </Text>

                                                            <Icon
                                                                name={
                                                                    isOpen
                                                                        ? "angle-up"
                                                                        : "angle-down"
                                                                }
                                                                style={{
                                                                    color: "#888",
                                                                    fontSize: 24,
                                                                }}
                                                            />
                                                        </View>
                                                    </Pressable>
                                                );
                                            }}
                                        >
                                            {options.map((item, index) => (
                                                <Menu.Item
                                                    key={index}
                                                    onPress={() =>
                                                        handleOptionSelect(
                                                            item.option,
                                                            item.value
                                                        )
                                                    }
                                                >
                                                    {item.option}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                        <FormControl.ErrorMessage
                                            leftIcon={
                                                <WarningOutlineIcon size="xs" />
                                            }
                                        >
                                            Try different from previous
                                            passwords.
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <FormControl
                                        isRequired
                                        isInvalid={false}
                                        w="100%"
                                        maxW="300px"
                                    >
                                        <FormControl.Label>
                                            PAN Number
                                        </FormControl.Label>
                                        <Input
                                            size="lg"
                                            variant="outline"
                                            placeholder="PAN Number"
                                            value={formData.pan}
                                            onChangeText={(value) =>
                                                handleChange("pan", value)
                                            }
                                        />
                                        <FormControl.ErrorMessage
                                            leftIcon={
                                                <WarningOutlineIcon size="xs" />
                                            }
                                        >
                                            Try different from previous
                                            passwords.
                                        </FormControl.ErrorMessage>
                                    </FormControl>
                                    <Button
                                        width="100%"
                                        bgColor={"#013974"}
                                        onPress={handleSubmit}
                                    >
                                        Invest
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
