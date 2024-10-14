import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as DocumentPicker from "expo-document-picker";
import DropdownComponent from "../../components/Dropdowns/NewDropDown"; // Assuming you have DropdownComponent implemented
import RemoteApi from "src/services/RemoteApi";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import CustomButton from "../Buttons/CustomButton";

const UploadBankDocument = ({
    onPrevious,
    onNext,
    initialValues,
    closeModal,
}) => {
    const [pickedDocument, setPickedDocument] = useState(null);
    const [radioOption, setRadioOption] = useState("");
    // const [bankVerificationFailed, setBankVerificationFailed] = useState(false);
    const [documentTypeOptions, setDocumentTypeOptions] = React.useState([
        {
            value: "passbook",
            label: "Passbook",
        },
        {
            value: "chequebook",
            label: "Cancelled Cheque",
        },
    ]);
    const [isLoading, setIsLoading] = React.useState(false);
    const pickDocument = async (setFieldValue) => {
        if (pickedDocument == null) {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: [".jpg", ".png", ".pdf", ".jpeg"],
                copyToCacheDirectory: true,
            });
            if (result && result.assets && result.assets.length > 0) {
                let { name, size, uri } = result.assets[0];
                let newUri = "file:///" + uri.split("data:/").join("");
                let nameParts = name.split(".");
                let fileType = nameParts[nameParts.length - 1];
                let fileToUpload = {
                    name: name,
                    size: size,
                    uri: newUri,
                    type: "application/" + fileType,
                };
                setPickedDocument(result.assets[0].file);
                setFieldValue("pickedDocument", fileToUpload); // Set the picked document in Formik's state
            }
        } else {
            setPickedDocument(null);
            setFieldValue("pickedDocument", null);
        }
    };

    const uploadDocument = async (values, actions) => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("documentType", values.documentType);
        formData.append("file", pickedDocument);
        formData.append("token", initialValues.token);
        formData.append("bankBranchId", initialValues.branchId);
        formData.append("accountNumber", initialValues.accountNumber);
        formData.append("ifscCode", initialValues.ifsc);

        const data = {
            documentType: values.documentType,
            file: pickedDocument,
            token: initialValues.token,
            bankBranchId: initialValues.branchId,
            accountNumber: initialValues.accountNumber,
            ifscCode: initialValues.ifsc,
        };
        try {
            console.log("uploadsubmit");
            console.log(data);
            const response: any = await RemoteApi.postWithFormData(
                "/file/upload-bank-verification-document",
                formData
            );

            // console.log("uploadbankdoc");
            // // console.log(response)
            // const response = {
            //     code: 200,
            //     message: "Success",
            //     data: {
            //         token: "uploaddocTokenerererer",
            //     },
            // };

            if (response?.code == 200) {
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                    currentStep: 3,
                };
                onNext(valuesWithToken);
            } else if (response?.message == "Document already uploaded.") {
                const valuesWithToken = {
                    ...values,
                    // token: response.data.token,
                    currentStep: 3,
                };
                onNext(valuesWithToken);
            } else {
                actions.setFieldError("pickedDocument", response.message);
            }
        } catch (error) {
            actions.setFieldError("pickedDocument", error.message);
        }

        setIsLoading(false);
    };

    const handleSubmit = async (values, actions) => {
        uploadDocument(values, actions);
    };

    const handleRadiooption = async (value) => {
        if (value == "1") {
            const valuesWithToken = {
                ...initialValues,
                isBankVerificationFailed: false,
            };
            onNext(valuesWithToken);
        } else {
            setRadioOption(value);
        }
    };

    return (
        <Formik
            initialValues={{
                documentType: "",
                pickedDocument: null,
            }}
            validationSchema={Yup.object().shape({
                documentType: Yup.string().required(
                    "Document Type is required"
                ),
                pickedDocument: Yup.mixed().required("Document is required"),
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
                        <View className="w-full gap-y-2">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-[18px] font-bold">
                                    Bank Details Verification
                                </Text>

                                <Pressable onPress={closeModal}>
                                    <Icon name="close" size={20} color="#000" />
                                </Pressable>
                            </View>

                            <Text className="text-[12px]">
                                Verify and correct the highlighted information
                            </Text>
                        </View>

                        <ScrollView className="pt-8 w-full">
                            <View className="flex flex-row justify-between items-center w-full  mb-4">
                                <View className="flex flex-col">
                                    <View className="w-full">
                                        <Text className="text-red-600 text-2xl">
                                            {
                                                initialValues.bankVerifyFailMessage
                                            }
                                        </Text>
                                    </View>
                                    <View className="w-full">
                                        <Text>
                                            Please verify the details enter by
                                            you or update the details.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between items-center w-full  mb-4">
                                <View style={styles.radiofieldContainer}>
                                    <CustomRadioButton
                                        options={[
                                            {
                                                label: "Change Bank Details",
                                                value: "1",
                                            },
                                            {
                                                label: "Upload Supporting Documents",
                                                value: "2",
                                            },
                                        ]}
                                        value={radioOption ? radioOption : "2"}
                                        setValue={(value) => {
                                            handleRadiooption(value);
                                        }}
                                    />
                                </View>
                            </View>

                            <View className="flex flex-row justify-between items-center w-full  mb-4">
                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        Document Type*
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
                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        Document upload*
                                    </Text>
                                    <TouchableOpacity
                                        className="flex flex-row border-gray-400 border rounded px-3 py-[11px] items-center justify-between"
                                        onPress={() =>
                                            pickDocument(setFieldValue)
                                        }
                                    >
                                        <View className=" flex flex-row">
                                            <Icon
                                                name="file-multiple-outline"
                                                size={16}
                                                color="#396CB7"
                                            />
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocument
                                                    ? pickedDocument.name
                                                    : "Upload Document"}
                                            </Text>
                                        </View>

                                        {pickedDocument && (
                                            <Icon
                                                name="delete-forever-outline"
                                                size={16}
                                                color="#FF551F"
                                            />
                                        )}
                                    </TouchableOpacity>
                                    {touched.pickedDocument &&
                                        errors.pickedDocument && (
                                            <Text style={styles.error}>
                                                {errors.pickedDocument}
                                            </Text>
                                        )}
                                </View>
                            </View>
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
                                    // disabled={isVerifing === true}
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
    // container: {
    //     flexGrow: 1,
    //     paddingTop: 20,
    //     backgroundColor: "#ffffff",

    // },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        paddingBottom: 10,
        // paddingLeft: 20,
        paddingRight: 20,
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
        color: "#97989B",
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
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
    error: {
        color: "red",
        marginTop: 5,
    },
    radiofieldContainer: {
        flex: 1,
        // marginRight: 10,
        paddingBottom: 10,
        // paddingLeft: 10,
        paddingRight: 20,
    },
});

export default UploadBankDocument;
