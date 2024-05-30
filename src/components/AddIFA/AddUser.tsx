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
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import AddIFAUser from "./AddIFA";
import AddRMUser from "./AddRM";

export default function AddIFA() {
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
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <View className="bg-white">
                <View className="">
                    <TableBreadCrumb name={"Add Distributor"} />
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View className="w-full flex items-center">
                        <View className="flex flex-row justify-center items-center w-[50%]">
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <AddIFAUser />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
