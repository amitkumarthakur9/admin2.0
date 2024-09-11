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

const UploadBankDocument = ({ onPrevious, onNext, bankAddress }) => {
    const [pickedDocument, setPickedDocument] = useState(null);
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

    const uploadDocument = async (values) => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("documentType", values.documentType);
        formData.append("file", pickedDocument);
        formData.append("token", bankAddress.uploadToken);
        formData.append("bankBranchId", bankAddress.branchId);
        formData.append("accountNumber", bankAddress.UploadAccountNumber);
        formData.append("ifscCode", bankAddress.UploadIfsc);

        const data = {
            documentType: values.documentType,
            file: pickedDocument,
            token: bankAddress.uploadToken,
            bankBranchId: bankAddress.branchId,
            accountNumber: bankAddress.UploadAccountNumber,
            ifscCode: bankAddress.UploadIfsc,
        };
        try {
            console.log("uploadsubmit");
            console.log(data);
            const response: any = await RemoteApi.postWithFormData(
                "/file/upload-bank-verification-document",
                formData
            );
            

            console.log("uploadbankdoc")
            console.log(response)
            // const response = {
            //     code: 200,
            //     message: "Success",
            // };

            if (response?.message == "Success") {
               
               
               
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                };
                onNext(valuesWithToken); 
                // const uniqueId = uuidv4();
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
            // const uniqueId = uuidv4();
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

    const handleSubmit = async (values) => {
        uploadDocument(values);
    };

    // async function getdocumentType() {
    //     setIsLoading(true);

    //     try {
    //         // const response: DropdownResponse = await RemoteApi.get(
    //         //     `bank-account-type`
    //         // );

    //         const response = {
    //             code: 200,
    //             data: [
    //                 {
    //                     id: 1,
    //                     name: "Passbook",
    //                 },
    //                 {
    //                     id: 1,
    //                     name: "Check",
    //                 },
    //             ],
    //         };
    //         if (response.code === 200) {
    //             const mappedAccount = response.data.map((item) => ({
    //                 label: item.name,
    //                 value: item.id,
    //             }));

    //             setDocumentTypeOptions(mappedAccount);
    //         } else {
    //             alert("Failed to fetch district list");
    //         }
    //     } catch (error) {
    //         alert("An error occurred while fetching the district list");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // React.useEffect(() => {
    //     getdocumentType();
    // }, []);

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
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Document Type*</Text>
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
                            {touched.documentType && errors.documentType && (
                                <Text style={styles.error}>
                                    {errors.documentType}
                                </Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Document upload*</Text>
                            <TouchableOpacity
                                className="flex flex-row border-gray-400 border rounded px-3 py-[11px] items-center justify-between"
                                onPress={() => pickDocument(setFieldValue)}
                            >
                                <View className="mr-[10px] flex flex-row">
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
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
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
});

export default UploadBankDocument;
