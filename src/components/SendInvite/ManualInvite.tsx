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
import Icon from "react-native-vector-icons/FontAwesome";
import { Dialog, Portal } from "react-native-paper";

export default function ManualInvite() {
    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = () => setModalVisible(true);
    const hideDialog = () => setModalVisible(false);


    const handleSubmit = () => {

        formData;
        console.log(formData);
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
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
                    {/* <Icon name="plus" size={14} color="#484848" /> */}

                    {<Text className="mx-2">Send invite manually</Text>}
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
                                    Add Details
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
                                            placeholder="Name"
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
                                    <Button
                                        width="100%"
                                        bgColor={"#013974"}
                                        onPress={handleSubmit}
                                    >
                                        Send Invite
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
