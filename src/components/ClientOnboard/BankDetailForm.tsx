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
import { v4 as uuidv4 } from "uuid";
import * as DocumentPicker from "expo-document-picker";
import { CheckIcon, FormControl, Select, Stack } from "native-base";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import UploadBankDocument from "./UploadBankDocument";
import CustomButton from "../Buttons/CustomButton";
const BankDetailForm = ({ onNext, onPrevious, initialValues, closeModal }) => {
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
    const [documentTypeOptions, setDocumentTypeOptions] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [ifscCode, setifscCode] = React.useState("null");
    const [bankAddress, setBankAddress] = React.useState({
        bankName: "",
        address: "",
        pincode: "",
        branchId: 0,
        uploadToken: "",
        UploadAccountNumber: "",
        UploadIfsc: "",
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
    };
    const [isLoading, setIsLoading] = useState(false);

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

    async function getIfseCode(branchId, setFieldError) {
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
                setFieldError("ifsc", response.message);
                // alert("Failed to fetch district list");
            }
        } catch (error) {
            setFieldError("ifsc", error.message);
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

    const fetchBankDetails = async (ifsc, setFieldError) => {
        setIsLoadingDistrict(true);

        const data = {
            ifscCode: ifsc,
        };

        try {
            const response: any = await RemoteApi.post("bank/address", data);

            if (response.code === 200) {
                const {
                    bankBranch = "",
                    pincode = "",
                    district = "",
                    state = "",
                    id = null,
                    bankName = "",
                } = response.data;

                const address = `${bankBranch}, ${district}, ${state}, ${pincode}`;

                setBankAddress({
                    ...bankAddress,
                    bankName: response.data.bankName,
                    address: address,
                    pincode: response.data.pincode,
                    branchId: response.data.id,
                });

                console.log(JSON.stringify(address));
                console.log(JSON.stringify(response));
            } else {
                setFieldError(
                    "ifsc",
                    response.message ? response.message : "IFSC not found"
                );
            }
        } catch (error) {
            setFieldError(
                "ifsc",
                error.message ? error.message : "IFSC not found"
            );
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

    const handleModalConfirm = async (setFieldError) => {
        fetchBankDetails(ifscCode, setFieldError);
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

    const handleSubmit = async (values, actions) => {
        console.log(values);
        console.log(JSON.stringify(values));
        setIsVerifing(true); // Start loading before the API call
        const data = {
            bankBranchId: Number(bankAddress.branchId),
            accountNumber: values.accountNumber,
            ifscCode: values.ifsc,
            token: values.token,
            // bankAccountType: values.accountType,
        };
        console.log("banksubmit");

        console.log(data);

        try {
            const response: any = await RemoteApi.post(
                "onboard/client/bank-details",
                data
            );

            // const response = {
            //     code: 400,
            //     message: "success",
            //     data: {
            //         isNameMissMatch: true,
            //         token: "BankDetailseyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxMCwiY3JlZGVudGlhbHNJZCI6MjAwLCJhY2NvdW50SWQiOjI3NywiYWRkcmVzc0lkIjo3MywiYmFua0FjY291bnRJZCI6MTM3LCJpYXQiOjE3MjU2MDcwNzcsImV4cCI6MTcyNTY5MzQ3N30.IOOF6DHp1CWXdE0ynDoxi6GY8cUil52GpGWWB8pFLSA",
            //     },
            //     errors: [],
            // };

            console.log("response");
            console.log(response);

            setBankAddress({
                ...bankAddress,
                UploadAccountNumber: values.accountNumber,
                UploadIfsc: values.ifsc,
                branchId: Number(bankAddress.branchId),
                uploadToken: initialValues.token,
            });

            if (response.code === 200 && !response?.data?.isNameMissMatch) {
                setIsVerifing(false);
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                    branchId: Number(bankAddress.branchId),
                };
                onNext(valuesWithToken); // Stop loading
                // onNext(values);
            } else {
                setIsVerifing(false);

                if (response.code == 425) {
                    actions.setFieldError("accountNumber", response.message);
                } else if (
                    response.code == 200 &&
                    response.data.isNameMissMatch
                ) {
                    setMessage("Name mismatch in Bank and PAN");
                    const valuesWithToken = {
                        ...values,
                        // token: response.data.token,
                        branchId: Number(bankAddress.branchId),
                        isBankVerificationFailed: true,
                        bankVerifyFailMessage: "Name mismatch in Bank and PAN",
                    };
                    onNext(valuesWithToken); // Stop loading
                    // setBankVerificationFailed(true); // Set failure state
                } else {
                    console.log("ElseError");
                    const valuesWithToken = {
                        ...values,
                        // token: response.data.token,
                        branchId: Number(bankAddress.branchId),
                        isBankVerificationFailed: true,
                        bankVerifyFailMessage: "Bank Verification Failed!",
                    };
                    onNext(valuesWithToken); // Stop loading
                }
            }
        } catch (error) {
            setIsVerifing(false); // Stop loading
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                accountNumber: Yup.string()
                    .required("Account number is required")
                    .matches(/^\d+$/, "Account number must be numeric")
                    .min(9, "Account number must be at least 9 digits"),
                ifsc: Yup.string()
                    .required("IFSC is required")
                    .length(11, "IFSC must be 11 characters"),
                accountType: Yup.string().required("Account Type is required"),
            })}
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
                setFieldError,
            }) =>
                isLoading ? (
                    <View className="h-[400px]  w-full flex flex-col justify-center items-center">
                        <ActivityIndicator size={100} color="#0000ff" />
                        <Text className="text-bold text-lg pt-8">
                            Verifying Details
                        </Text>
                    </View>
                ) : (
                    <>
                        <ScrollView contentContainerStyle={styles.container}>
                            {/* {!bankVerificationFailed ? ( */}
                            <>
                                <View className="flex flex-row justify-between items-start w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Account Number*
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange(
                                                "accountNumber"
                                            )}
                                            onBlur={handleBlur("accountNumber")}
                                            value={values.accountNumber}
                                            keyboardType="numeric"
                                        />
                                        {touched.accountNumber &&
                                            errors.accountNumber && (
                                                <Text style={styles.error}>
                                                    {errors.accountNumber}
                                                </Text>
                                                // setFieldValue(va)
                                            )}
                                    </View>

                                    <View className="w-[48%]">
                                        <View>
                                            <Text style={styles.label}>
                                                Bank IFSC*
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={(value) => {
                                                    const uppercasedValue =
                                                        value.toUpperCase();
                                                    handleChange("ifsc")(
                                                        uppercasedValue
                                                    );
                                                    if (
                                                        uppercasedValue.length ===
                                                        11
                                                    ) {
                                                        fetchBankDetails(
                                                            uppercasedValue,
                                                            setFieldError
                                                        );
                                                    } else {
                                                        setBankAddress({
                                                            ...bankAddress,
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
                                                <Text style={styles.error}>
                                                    {errors.ifsc}
                                                </Text>
                                            )}
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setIsModalVisible(true)
                                                }
                                            >
                                                <Text className="text-[#114EA8] text-xs">
                                                    Don't know IFSC?
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Account Type*
                                        </Text>
                                        <DropdownComponent
                                            label="Account Type"
                                            data={accountTypeOptions}
                                            value={values.accountType}
                                            setValue={(value) =>
                                                setFieldValue(
                                                    "accountType",
                                                    value
                                                )
                                            }
                                            containerStyle={styles.dropdown}
                                            noIcon={true}
                                        />
                                        {touched.accountType &&
                                            errors.accountType && (
                                                <Text style={styles.error}>
                                                    {errors.accountType}
                                                </Text>
                                            )}
                                    </View>
                                    <View className="w-[48%]">
                                        {values.bankName && values.address && (
                                            <View style={styles.bankDetails}>
                                                <Text>
                                                    Bank name: {values.bankName}
                                                </Text>
                                                <Text>
                                                    Address: {values.address}
                                                </Text>
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
                            </>

                            <Modal
                                visible={isModalVisible}
                                transparent
                                onRequestClose={() => {
                                    setIsModalVisible(false);
                                    setModalFormData({
                                        ...modalFormData,
                                        bank: "",
                                        state: "",
                                        district: "",
                                        branch: "",
                                    });
                                }}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                setIsModalVisible(false);
                                                setModalFormData({
                                                    bank: "",
                                                    state: "",
                                                    district: "",
                                                    branch: "",
                                                });
                                                setSelectedBank(null);
                                                setifscCode(null);
                                            }}
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
                                            <View className="">
                                                <Text style={styles.label}>
                                                    Bank name*
                                                </Text>
                                            </View>

                                            <SearchableDropdown
                                                endpoint="bank"
                                                onSelect={handleSelect}
                                            />

                                            {selectedBank && (
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        State*
                                                    </Text>
                                                    <DropdownComponent
                                                        label="State"
                                                        data={stateOptions}
                                                        value={
                                                            modalFormData.state
                                                        }
                                                        setValue={(value) => {
                                                            setModalFormData({
                                                                ...modalFormData,
                                                                state: value,
                                                            });
                                                            getDistrictList(
                                                                value
                                                            );
                                                        }}
                                                        searchOn={true}
                                                        containerStyle={
                                                            styles.dropdown
                                                        }
                                                        noIcon={true}
                                                    />
                                                </View>
                                            )}
                                            {modalFormData.state && (
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        District*
                                                    </Text>
                                                    <DropdownComponent
                                                        label="District"
                                                        data={districtOptions}
                                                        value={
                                                            modalFormData.district
                                                        }
                                                        setValue={(value) => {
                                                            setModalFormData({
                                                                ...modalFormData,
                                                                district: value,
                                                            });
                                                            getBranchList(
                                                                value
                                                            );
                                                        }}
                                                        searchOn={true}
                                                        containerStyle={
                                                            styles.dropdown
                                                        }
                                                        noIcon={true}
                                                    />
                                                </View>
                                            )}
                                            {modalFormData.district && (
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Branch*
                                                    </Text>
                                                    <DropdownComponent
                                                        label="Branch"
                                                        data={branchOptions}
                                                        value={
                                                            modalFormData.branch
                                                        }
                                                        setValue={(value) => {
                                                            setModalFormData({
                                                                ...modalFormData,
                                                                branch: value,
                                                            });
                                                            setBankAddress({
                                                                ...bankAddress,
                                                                branchId: value,
                                                            });
                                                            getIfseCode(
                                                                value,
                                                                setFieldError
                                                            );
                                                        }}
                                                        searchOn={true}
                                                        containerStyle={
                                                            styles.dropdown
                                                        }
                                                        noIcon={true}
                                                    />
                                                </View>
                                            )}
                                            {ifscCode !== "null" && (
                                                <View className="flex flex-row py-4">
                                                    <Text className="pr-2 color-gray-600">
                                                        IFSC Code:
                                                    </Text>
                                                    <Text className="">
                                                        {ifscCode}
                                                    </Text>
                                                </View>
                                            )}

                                            <Pressable
                                                style={[
                                                    styles.confirmButton,
                                                    ifscCode === null &&
                                                        styles.confirmButtonDisabled,
                                                ]}
                                                onPress={() => {
                                                    handleModalConfirm(
                                                        setFieldError
                                                    );
                                                    setFieldValue(
                                                        "ifsc",
                                                        ifscCode
                                                    );
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
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>

                        <View className="flex flex-row justify-between w-full ">
                            <View className="w-[48%]">
                                <CustomButton
                                    onPress={closeModal}
                                    title="Close"
                                    disabled={false}
                                    buttonStyle={"outline"}
                                />
                            </View>
                            <View className="w-[48%]">
                                <CustomButton
                                    onPress={handleSubmit}
                                    title="Save and Continue"
                                    disabled={isVerifing === true}
                                    buttonStyle={"full"}
                                />
                            </View>
                        </View>
                    </>
                )
            }
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 20,
        backgroundColor: "#ffffff",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        marginRight: 10,
        paddingBottom: 10,
        // paddingLeft: 20,
        // paddingRight: 20,
    },
    radiofieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 20,
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
        color: "#97989B",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        fontSize: 12,
        color: "#404249",
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",
    },
});

export default BankDetailForm;
