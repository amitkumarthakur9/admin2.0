import React, { useState, useEffect } from "react";
import {
    View,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import DropdownComponent from "../../components/Dropdowns/NewDropDown"; // Assuming you have DropdownComponent implemented
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "src/services/RemoteApi";
import SearchableDropdown from "../Dropdowns/SearchableDropdown";
import { getResponse } from "src/helper/helper";

const BankDetailForm = ({ onNext, onPrevious, initialValues }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalFormData, setModalFormData] = useState({
        bank: "",
        state: "",
        district: "",
        branch: "",
    });
    const [ifscFromModal, setIfscFromModal] = useState("");
    const [isVerifing, setIsVerifing] = useState(false);
    const [isLoadingState, setIsLoadingState] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoadingDistrict, setIsLoadingDistrict] = React.useState(false);
    const [stateOptions, setStateOptions] = React.useState([]);
    const [districtOptions, setDistrictOptions] = React.useState([]);
    const [branchOptions, setBranchOptions] = React.useState([]);
    const [accountTypeOptions, setAccountTypeOptions] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [ifscCode, setifscCode] = React.useState("null");
    const [bankAddress, setBankAddress] = React.useState({
        bankName: "",
        address: "",
        pincode: "",
    });
    const [bankOptions, setBankOptions] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const handleSelect = (item) => {
        setSelectedBank(item);
        setModalFormData({
            ...modalFormData,
            bank: item.value,
            state: "",
            district: "",
            branch: "",
        });
        setifscCode(null);
    };

    async function fetchBankOptions(query) {
        try {
            const response: any = await RemoteApi.get(`bank/?query=${query}`);
            if (response.code === 200) {
                setBankOptions(
                    response.data.map((bank) => ({
                        label: bank.name,
                        value: bank.id,
                    }))
                );
            } else {
                // alert("Failed to fetch bank options");
            }
        } catch (error) {
            // alert("An error occurred while fetching the bank options");
        }
    }

    useEffect(() => {
        if (searchQuery.length >= 3) {
            fetchBankOptions(searchQuery);
        }
    }, [searchQuery]);

    async function getStateList() {
        setIsLoadingState(true);
        try {
            const response: DropdownResponse = await RemoteApi.get("state/");
            if (response.code === 200) {
                setStateOptions(
                    response.data.map((state) => ({
                        label: state.name,
                        value: state.id,
                    }))
                );
            } else {
                // alert("Failed to fetch state list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the state list");
        } finally {
            setIsLoadingState(false);
        }
    }

    async function getDistrictList(stateId) {
        setIsLoadingDistrict(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `district/${stateId}`
            );

            if (response.code === 200) {
                const mappedDistricts = response.data.map((district) => ({
                    label: district.name,
                    value: district.id,
                }));

                setDistrictOptions(mappedDistricts);
            } else {
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    async function getBranchList(districtId) {
        setIsLoadingDistrict(true);

        try {
            const response: DropdownResponse = await RemoteApi.get(
                `bank/branch/${modalFormData.bank}/${districtId}`
            );

            if (response.code === 200) {
                const mappedBranch = response.data.map((branch) => ({
                    label: branch.name,
                    value: branch.id,
                }));

                setBranchOptions(mappedBranch);
            } else {
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    async function getAccountType() {
        setIsLoadingDistrict(true);

        try {
            const response: DropdownResponse = await RemoteApi.get(
                `bank-account-type`
            );

            if (response.code === 200) {
                const mappedAccount = response.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));

                setAccountTypeOptions(mappedAccount);
            } else {
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    async function getIfseCode(branchId) {
        setIsLoadingDistrict(true);

        try {
            const response: any = await RemoteApi.get(
                `bank/branch/${branchId}`
            );

            if (response.code === 200) {
                function IfseCodeSet() {
                    setifscCode(response.data.ifscCode);
                }

                IfseCodeSet();

                const bankName = getLabelByValue("168", bankOptions);
                const BranchName = getLabelByValue(
                    modalFormData.branch,
                    branchOptions
                );
                console.log("label" + bankName); // Output: "HDFC Bank"
                console.log("label" + BranchName); // Output: "HDFC Bank"
            } else {
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    useEffect(() => {
        console.log("State updated:", JSON.stringify(bankAddress));
        if (bankAddress.bankName && bankAddress.address) {
            // Further logic here
            console.log("State updated:", bankAddress);
            // or any other operations you need to perform after state update
        }
    }, [bankAddress]);

    const fetchBankDetails = async (ifsc) => {
        setIsLoadingDistrict(true);

        const data = {
            ifscCode: ifsc,
        };

        try {
            const response: any = await RemoteApi.post("bank/address", data);

            if (response.code === 200) {
                const { bankBranch, pincode, district, state } = response.data;
                const address = `${bankBranch}, ${district}, ${state}, ${pincode}`;

                setBankAddress({
                    bankName: response.data.bankName,
                    address: address,
                    pincode: response.data.pincode,
                });

                console.log(JSON.stringify(address));
                console.log(JSON.stringify(response));
            } else {
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            // alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    };

    React.useEffect(() => {
        getStateList();
        getAccountType();
    }, []);

    const getLabelByValue = (value, Options) => {
        const bank = Options.find((option) => option.value === value);
        return bank ? bank.label : null;
    };

    const handleModalConfirm = async () => {
        fetchBankDetails(ifscCode);
        setIsModalVisible(false);
        setModalFormData({
            bank: "",
            state: "",
            district: "",
            branch: "",
        });
        setSelectedBank(null);
        setifscCode(null);
    };

    const handleSubmit = async (values) => {
        console.log(values);
        console.log(JSON.stringify(values));

        const data = {
            pincode: bankAddress.pincode,
            accountNumber: values.accountNumber,
            ifscCode: values.ifsc,
            bankAccountType: values.accountType,
        };

        const bankData = {
            accountNumber: values.accountNumber,
            accountType: values.accountType,
            ifscCode: values.ifsc,
            bankName: bankAddress.bankName,
            bankAddress: bankAddress.address,
            pincode: bankAddress.pincode,
        };

        // Modify the values to set isBankVerified to true before proceeding

        // onNext(values);

        setIsVerifing(true);
        // setIsModalVisible(true);

        try {
            const response: DropdownResponse = await RemoteApi.post(
                "bank-account",
                data
            );

            // const response: any = await getResponse(200);

            console.log("response");
            console.log(response);

            if (response.code === 200) {
                // Modify the values to set isBankVerified to true before proceeding
                const updatedValues = {
                    ...values,
                    isBankVerified: true, // Set isBankVerified to true
                };
                onNext(updatedValues);
            } else {
                // Modify the values to set isBankVerified to true before proceeding
                const updatedValues = {
                    ...values,
                    isBankVerified: false, // Set isBankVerified to true
                };
                onNext(updatedValues);
                console.log("ElseError");
                setMessage(
                    "Verification Failed. Check your account Number and Try again"
                );
            }
        } catch (error) {
            setMessage(
                "Verification Failed. Check your account Number and Try again"
            );
        }
    };

    return (
        <Formik
            initialValues={{
                accountNumber: "",
                ifsc: "",
                accountType: "",
                bankName: "",
                address: "",
            }}
            validationSchema={Yup.object().shape({
                accountNumber: Yup.string()
                    .required("Account number is required")
                    .matches(/^\d+$/, "Account number must be Numeric"),
                ifsc: Yup.string()
                    .required("IFSC is required")
                    .length(11, "IFSC must be 11 characters"),
                accountType: Yup.string().required("Account Type is required"),
            })}
            // onSubmit={(values) => {
            //     onNext(values);
            // }}
            onSubmit={handleSubmit}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.bankfieldContainer}>
                            <Text style={styles.label}>
                                Account Number{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("accountNumber")}
                                onBlur={handleBlur("accountNumber")}
                                value={values.accountNumber}
                                keyboardType="numeric"
                            />
                            {touched.accountNumber && errors.accountNumber && (
                                <Text style={styles.error}>
                                    {errors.accountNumber}
                                </Text>
                                // setFieldValue(va)
                            )}
                        </View>
                        <View style={styles.bankfieldContainer}>
                            <Text style={styles.label}>
                                Bank IFSC{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => {
                                    const uppercasedValue = value.toUpperCase();
                                    handleChange("ifsc")(uppercasedValue);
                                    if (uppercasedValue.length === 11) {
                                        fetchBankDetails(uppercasedValue);
                                    } else {
                                        setBankAddress({
                                            bankName: "",
                                            address: "",
                                            pincode: "",
                                        });
                                    }
                                }}
                                onBlur={handleBlur("ifsc")}
                                // value={
                                //     ifscCode !== "null" ? ifscCode : values.ifsc
                                // }
                                value={values.ifsc}
                            />
                            {touched.ifsc && errors.ifsc && (
                                <Text style={styles.error}>{errors.ifsc}</Text>
                            )}
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(true)}
                            >
                                <Text style={styles.link}>
                                    Don't know IFSC?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.dropdownfieldContainer}>
                            <Text style={styles.label}>
                                Account Type{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <DropdownComponent
                                label="Account Type"
                                data={accountTypeOptions}
                                value={values.accountType}
                                setValue={(value) =>
                                    setFieldValue("accountType", value)
                                }
                                containerStyle={styles.dropdown}
                                noIcon={true}
                            />
                            {touched.accountType && errors.accountType && (
                                <Text style={styles.error}>
                                    {errors.accountType}
                                </Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}>
                            {values.bankName && values.address && (
                                <View style={styles.bankDetails}>
                                    <Text>Bank name: {values.bankName}</Text>
                                    <Text>Address: {values.address}</Text>
                                </View>
                            )}
                            {bankAddress.bankName !== "" && (
                                <>
                                    <View className="flex flex-row py-1">
                                        <Text className="pr-2 color-gray-600">
                                            Bank Name:
                                        </Text>
                                        <Text className="">
                                            {bankAddress.bankName}
                                        </Text>
                                    </View>
                                    <View className="flex flex-row py-4">
                                        <Text className="pr-2 color-gray-600">
                                            Address:
                                        </Text>
                                        <Text className="">
                                            {bankAddress.address}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                    <View className="flex flex-row justify-center gap-2">
                        <View className="w-3/12">
                            <Pressable
                                style={({ pressed }) => [
                                    styles.back,
                                    {
                                        borderColor: "#0066cc",
                                        opacity: pressed ? 0.6 : 1,
                                    },
                                ]}
                                onPress={onPrevious}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: "#0066cc" },
                                    ]}
                                >
                                    {"Back"}
                                </Text>
                            </Pressable>
                        </View>
                        <View className="w-3/12">
                            <Pressable
                                style={({ pressed }) => [
                                    styles.proceed,
                                    {
                                        borderColor: "#0066cc",
                                        opacity: pressed ? 0.6 : 1,
                                    },
                                ]}
                                onPress={() => handleSubmit()}
                                disabled={isVerifing === true}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: "#ffffff" },
                                    ]}
                                >
                                    {"Verify"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <Modal
                        visible={isModalVisible}
                        transparent
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="#7C899C"
                                    />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>
                                    Find your IFSC
                                </Text>

                                <ScrollView className="w-full p-16">
                                    <View className="px-5">
                                        <Text style={styles.label}>
                                            Bank name{" "}
                                            <Text className="text-red-500">
                                                *
                                            </Text>
                                        </Text>
                                    </View>
                                    <SearchableDropdown
                                        endpoint="bank"
                                        onSelect={handleSelect}
                                    />

                                    {/* {selectedBank && (
                                            <Text>
                                                Selected Bank:{" "}
                                                {selectedBank.label}
                                            </Text>
                                        )} */}

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            State{" "}
                                            <Text className="text-red-500">
                                                *
                                            </Text>
                                        </Text>
                                        {modalFormData.bank ? (
                                            <DropdownComponent
                                                label="State"
                                                data={stateOptions}
                                                value={modalFormData.state}
                                                setValue={(value) => {
                                                    setModalFormData({
                                                        ...modalFormData,
                                                        state: value,
                                                    });
                                                    getDistrictList(value);
                                                }}
                                                searchOn={true}
                                                containerStyle={styles.dropdown}
                                                noIcon={true}
                                            />
                                        ) : (
                                            <View className="border border-gray-500 p-[10px] rounded mr-2">
                                                <Text>Select bank first</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            District{" "}
                                            <Text className="text-red-500">
                                                *
                                            </Text>
                                        </Text>
                                        {modalFormData.state ? (
                                            <DropdownComponent
                                                label="District"
                                                data={districtOptions}
                                                value={modalFormData.district}
                                                setValue={(value) => {
                                                    setModalFormData({
                                                        ...modalFormData,
                                                        district: value,
                                                    });
                                                    getBranchList(value);
                                                }}
                                                searchOn={true}
                                                containerStyle={styles.dropdown}
                                                noIcon={true}
                                            />
                                        ) : (
                                            <View className="border border-gray-500 p-[10px] rounded mr-2">
                                                <Text>Select state first</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            Branch{" "}
                                            <Text className="text-red-500">
                                                *
                                            </Text>
                                        </Text>
                                        {modalFormData.district ? (
                                            <DropdownComponent
                                                label="Branch"
                                                data={branchOptions}
                                                value={modalFormData.branch}
                                                setValue={(value) => {
                                                    setModalFormData({
                                                        ...modalFormData,
                                                        branch: value,
                                                    });
                                                    getIfseCode(value);
                                                }}
                                                searchOn={true}
                                                containerStyle={styles.dropdown}
                                                noIcon={true}
                                            />
                                        ) : (
                                            <View className="border border-gray-500 p-[10px] rounded mr-2">
                                                <Text>
                                                    Select district first
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    {ifscCode !== "null" && (
                                        <View className="flex flex-row py-4">
                                            <Text className="pr-2 color-gray-600">
                                                IFSC Code:
                                            </Text>
                                            <Text className="">{ifscCode}</Text>
                                        </View>
                                    )}

                                    <Pressable
                                        style={[
                                            styles.confirmButton,
                                            ifscCode === null &&
                                                styles.confirmButtonDisabled,
                                        ]}
                                        onPress={() => {
                                            handleModalConfirm();
                                            setFieldValue("ifsc", ifscCode);
                                        }}
                                        disabled={ifscCode === null}
                                    >
                                        <Text
                                            style={[
                                                styles.confirmButtonText,
                                                ifscCode === null &&
                                                    styles.confirmButtonTextDisabled,
                                            ]}
                                        >
                                            Confirm
                                        </Text>
                                    </Pressable>

                                    {/* {selectedBank && (
                                        <Text>
                                            Selected Bank: {selectedBank.label}
                                            Selected Bank: {selectedBank.value}
                                        </Text>
                                    )} */}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        visible={isVerifing}
                        transparent
                        onRequestClose={() => {
                            setIsVerifing(false);
                            setMessage(null);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        setIsVerifing(false);
                                        setMessage(null);
                                    }}
                                >
                                    <Icon
                                        name="close"
                                        size={20}
                                        color="#7C899C"
                                    />
                                </TouchableOpacity>
                                {message ? (
                                    <>
                                        <View>
                                            <Text className="text-red-600 text-lg">
                                                {message}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <ActivityIndicator />
                                        <Text style={styles.modalTitle}>
                                            Verifying Bank Account
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        // paddingLeft: 20,
        // paddingRight: 10,
    },
    dropdownfieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 60,
    },

    bankfieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    link: {
        color: "#0066cc",
        textDecorationLine: "underline",
        marginTop: 5,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    bankDetails: {
        marginVertical: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 500,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        width: "100%",
    },
    confirmButton: {
        width: "100%",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#114EA8",
    },
    confirmButtonDisabled: {
        backgroundColor: "gray",
    },
    confirmButtonText: {
        color: "#ffffff",
    },
    confirmButtonTextDisabled: {
        color: "lightgray",
    },
    error: {
        color: "red",
        marginTop: 5,
    },
    back: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
    buttonText: {
        fontSize: 16,
    },
});

export default BankDetailForm;
