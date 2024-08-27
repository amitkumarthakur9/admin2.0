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
    const [documentTypeOptions, setDocumentTypeOptions] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [ifscCode, setifscCode] = React.useState("null");
    const [bankAddress, setBankAddress] = React.useState({
        bankName: "",
        address: "",
        pincode: "",
    });
    const [rta, setRta] = useState("");
    const [bankOptions, setBankOptions] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const handleSelect = (item) => {
        setSelectedBank(item);
        setModalFormData({
            ...modalFormData,
            bank: item.value,
        });
    };
    const [isLoading, setIsLoading] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);

    const [pickedDocument, setPickedDocument] = useState<any>(null);
    const pickDocument = async () => {
        if (pickedDocument == null) {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: [".jpg", ".png", ".pdf", ".jpeg"],
                copyToCacheDirectory: true,
            });
            // console.log('selected file', result);
            if (result.assets.length > 0) {
                let { name, size, uri } = result.assets[0];
                let newUri = "file:///" + uri.split("data:/").join("");
                let nameParts = name.split(".");
                let fileType = nameParts[nameParts.length - 1];
                var fileToUpload = {
                    name: name,
                    size: size,
                    uri: newUri,
                    type: "application/" + fileType,
                };
                // console.log(fileToUpload, '...............file')
                setPickedDocument(result.assets[0].file);
            }
        } else {
            setPickedDocument(null);
        }
    };

    const [pickedDocuments, setPickedDocuments] = useState({
        panCard: null,
        aadharFront: null,
        aadharBack: null,
        bankCheck: null,
        esignedAgreement: null,
    });

    const documentErrors = {
        aadharFront: initialValues.aadharFrontDocumentError,
        aadharBack: initialValues.aadharBackDocumentError,
        panCard: initialValues.panCardDocumentError,
        bankCheck: initialValues.cancelledChequeError,
    };
    const anyDocumentError = Object.values(documentErrors).some(
        (error) => error
    );

    const uploadDocument = async () => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("rta", rta);
        formData.append("file", pickedDocument);

        try {
            const response: any = await RemoteApi.postWithFormData(
                "/file/upload-transaction",
                formData
            );

            if (response?.message == "Success") {
                const uniqueId = uuidv4();
                // Add the success toast to the toasts array in the component's state
                // setToasts([
                //     ...toasts,
                //     {
                //         id: uniqueId,
                //         variant: "solid",
                //         title: response?.data,
                //         status: "success",
                //     },
                // ]);
            } else {
                // const uniqueId = uuidv4();
                // setToasts([...toasts, { id: uniqueId, variant: "solid", title: "Upload Failed", status: "error" }]);
            }
        } catch (error) {
            const uniqueId = uuidv4();
            // setToasts([
            //     ...toasts,
            //     {
            //         id: uniqueId,
            //         variant: "solid",
            //         title: "Upload Failed",
            //         status: "error",
            //     },
            // ]);
        }

        setIsLoading(false);
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
                alert("Failed to fetch bank options");
            }
        } catch (error) {
            alert("An error occurred while fetching the bank options");
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
                alert("Failed to fetch state list");
            }
        } catch (error) {
            alert("An error occurred while fetching the state list");
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
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
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
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
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
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    async function getdocumentType() {
        setIsLoadingDistrict(true);

        try {
            // const response: DropdownResponse = await RemoteApi.get(
            //     `bank-account-type`
            // );

            const response = {
                code: 200,
                data: [
                    {
                        id: 1,
                        name: "Passbook",
                    },
                    {
                        id: 1,
                        name: "Cancelled Cheque",
                    },
                ],
            };
            if (response.code === 200) {
                const mappedAccount = response.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }));

                setDocumentTypeOptions(mappedAccount);
            } else {
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
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
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
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
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
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
    };

    const handleDocumentSubmit = async (values) => {
        console.log("document handle");
        console.log(values);
        onNext()
        // uploadDocument();
    };

    const handleSubmit = async (values) => {
        console.log(values);
        console.log(JSON.stringify(values));
        setIsVerifing(true); // Start loading before the API call
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

        // onNext(values);

        setIsVerifing(true);
        // setIsModalVisible(true);

        try {
            // const response: DropdownResponse = await RemoteApi.post(
            //     "bank-account",
            //     data
            // );

            const response = {
                code: 500,
            };

            console.log("response");
            console.log(response);

            if (response.code === 200) {
                setIsVerifing(false); // Stop loading
                onNext(values);
            } else {
                setIsVerifing(false); // Stop loading
                console.log("ElseError");
                getdocumentType();
                setShowDocumentUpload(true);
                setMessage(
                    "Verification Failed. Please upload supporting document for the verification."
                );
            }
        } catch (error) {
            setIsVerifing(false); // Stop loading
            getdocumentType();
            setShowDocumentUpload(true);
            setMessage(
                "Verification Failed. Please upload supporting document for the verification."
            );
        }
    };

    const renderDocumentUpload = (label, documentKey) => (
        <View
            className="flex flex-row justify-center items-center w-full mb-4"
            key={documentKey}
        >
            <View className="flex flex-col justify-center items-start w-full">
                <FormControl.Label>{label}*</FormControl.Label>
                <TouchableOpacity
                    className={`flex flex-row border-[#114EA8] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full 
                        `}
                    onPress={() => pickDocument(documentKey)}
                    disabled={anyDocumentError && !documentErrors[documentKey]}
                >
                    <View className="flex flex-row justify-start items-center w-full space-x-2">
                        {pickedDocuments[documentKey] ? (
                            <>
                                <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                    <Icon
                                        name="file-multiple-outline"
                                        size={16}
                                        color="#396CB7"
                                    />
                                </View>
                                <View className="flex flex-row justify-between w-11/12">
                                    <Text className="text-[#ada9a9]">
                                        {pickedDocuments[documentKey].name}
                                    </Text>
                                    <Icon
                                        name="delete-forever-outline"
                                        size={20}
                                        color="#FF551F"
                                    />
                                </View>
                            </>
                        ) : !documentErrors[documentKey] ? (
                            <>
                                <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                    <Icon
                                        name="file-multiple-outline"
                                        size={16}
                                        color="#396CB7"
                                    />
                                </View>
                                <Text className="text-[#114EA8]">{`${label} Uploaded`}</Text>
                            </>
                        ) : (
                            <>
                                <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                    <Icon
                                        name="file-multiple-outline"
                                        size={16}
                                        color="#396CB7"
                                    />
                                </View>
                                <Text className="text-[#114EA8]">{`Upload ${label}`}</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
                {documentErrors[documentKey] && (
                    <Text className="text-red-500 mt-1">
                        Please re-upload the {label}.
                    </Text>
                )}
            </View>
        </View>
    );

    if (isVerifing) {
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Verifying Bank Account...</Text>
        </View>;
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                // accountNumber: Yup.number().required(
                //     "Account Number is required"
                // ),
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
                     {!showDocumentUpload ? (
                        <>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Account Number*</Text>
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
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Bank IFSC*</Text>
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
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Account Type*</Text>
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
                                    {"Save as Draft"}
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
                                    {"Save and Continue"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    </>
                     )
                   :
                        <>
                            <View style={styles.formRow}>
                                <Text className="text-red-600 text-lg">
                                    {message}
                                </Text>
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Account Type*
                                    </Text>
                                    <DropdownComponent
                                        label="Document Type"
                                        data={documentTypeOptions}
                                        value={values.documentType}
                                        setValue={(value) =>
                                            setFieldValue("documentType", value)
                                        }
                                        containerStyle={styles.dropdown}
                                        noIcon={true}
                                    />
                                    {touched.documentType &&
                                        errors.documentType && (
                                            <Text style={styles.error}>
                                                {errors.documentType}
                                            </Text>
                                        )}
                                </View>
                                <View style={styles.fieldContainer}>
                                    {renderDocumentUpload(
                                        "Pan Card",
                                        "panCard"
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
                                    {"Save as Draft"}
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
                                onPress={() => handleDocumentSubmit(values)}
                                disabled={isVerifing === true}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: "#ffffff" },
                                    ]}
                                >
                                    {"Save and Continue"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                        </>
                    }

                   
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
                                            Bank name*
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
                                        <Text style={styles.label}>State*</Text>
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
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            District*
                                        </Text>
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
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            Branch*
                                        </Text>
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
                                            ifscCode === "null" &&
                                                styles.confirmButtonDisabled,
                                        ]}
                                        onPress={() => {
                                            handleModalConfirm();
                                            setFieldValue("ifsc", ifscCode);
                                        }}
                                        disabled={ifscCode === "null"}
                                    >
                                        <Text
                                            style={[
                                                styles.confirmButtonText,
                                                ifscCode === "null" &&
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
