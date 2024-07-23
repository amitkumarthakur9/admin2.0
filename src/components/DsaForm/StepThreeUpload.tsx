import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Button, View, FormControl, useToast } from "native-base";
import { useState, useCallback, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "../../services/RemoteApi";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";
import CustomCheckbox from "../Checkbox/NativeCheckbox";

const StepThreeUpload = ({ onSuccess, initialValues }) => {
    const [pickedDocuments, setPickedDocuments] = useState({
        panCard: null,
        aadharFront: null,
        aadharBack: null,
        bankCheck: null,
        esignedAgreement: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const [toasts, setToasts] = useState([]);
    const [consentGiven, setConsentGiven] = useState(false);

    const documentErrors = {
        aadharFront: initialValues.aadharFrontDocumentError,
        aadharBack: initialValues.aadharBackDocumentError,
        panCard: initialValues.panCardDocumentError,
        bankCheck: initialValues.cancelledChequeError,
    };

    const anyDocumentError = Object.values(documentErrors).some(
        (error) => error
    );

    const isSubmitDisabled =
        !pickedDocuments.panCard ||
        !pickedDocuments.aadharFront ||
        !pickedDocuments.aadharBack ||
        !consentGiven ||
        anyDocumentError;

    useEffect(() => {
        toast.closeAll();

        if (toasts.length > 0) {
            const latestToast = toasts[toasts.length - 1];
            toast.show({
                render: () => (
                    <ToastAlert
                        id={latestToast.id}
                        variant={latestToast.variant}
                        title={latestToast.title}
                        description=""
                        isClosable={false}
                        toast={toast}
                        status={latestToast.status}
                        onClose={() => removeToast(latestToast.id)}
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const pickDocument = async (documentType) => {
        if (pickedDocuments[documentType] == null) {
            let result = await DocumentPicker.getDocumentAsync({
                type: [".png", ".pdf", ".jpg", ".jpeg"],
                copyToCacheDirectory: true,
            });

            if (result.assets.length > 0) {
                setPickedDocuments({
                    ...pickedDocuments,
                    [documentType]: result.assets[0].file,
                });
            }
        } else {
            setPickedDocuments({
                ...pickedDocuments,
                [documentType]: null,
            });
        }
    };

    const uploadDocument = async () => {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(pickedDocuments).forEach((key) => {
            if (pickedDocuments[key]) {
                let fileKey = key;

                if (key === "panCard") {
                    fileKey = "pan_card";
                } else if (key === "aadharFront") {
                    fileKey = "aadhaar_front";
                } else if (key === "aadharBack") {
                    fileKey = "aadhaar_back";
                } else if (key === "esignedAgreement") {
                    fileKey = "esigned_document";
                } else if (key === "bankCheck") {
                    fileKey = "cancelled_check";
                }
                formData.append(fileKey, pickedDocuments[key]);
            }
        });

        try {
            const response = await RemoteApi.postWithFormData(
                "file/upload-dsa-documents",
                formData
            );

            if (response.code === 200) {
                const uniqueId = uuidv4();
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: response?.data,
                        status: "success",
                    },
                ]);

                setPickedDocuments({
                    ...pickedDocuments,
                    panCard: null,
                    aadharFront: null,
                    aadharBack: null,
                });

                onSuccess();
            } else {
                const uniqueId = uuidv4();
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: "Upload Failed",
                        status: "error",
                    },
                ]);
            }
        } catch (error) {
            const uniqueId = uuidv4();
            setToasts([
                ...toasts,
                {
                    id: uniqueId,
                    variant: "solid",
                    title: "Upload Failed",
                    status: "error",
                },
            ]);
        }
        setIsLoading(false);
    };

    const renderDocumentUpload = (label, documentKey) => (
        <View
            className="flex flex-row justify-center items-center w-full mb-4"
            key={documentKey}
        >
            <View className="flex flex-col justify-center items-start w-full">
                <FormControl.Label>{label}*</FormControl.Label>
                <TouchableOpacity
                    className={`flex flex-row border-[#114EA8] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full ${
                        documentErrors[documentKey] ? "border-red-500" : ""
                    }`}
                    onPress={() => pickDocument(documentKey)}
                    disabled={anyDocumentError && !documentErrors[documentKey]}
                >
                    <View className="flex flex-row justify-start items-center w-full">
                        {pickedDocuments[documentKey] && (
                            <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                <Icon
                                    name="file-multiple-outline"
                                    size={16}
                                    color="#396CB7"
                                />
                            </View>
                        )}
                        <View
                            className={
                                pickedDocuments[documentKey]
                                    ? "flex flex-row justify-between w-11/12"
                                    : "flex flex-row w-full justify-center p-2"
                            }
                        >
                            <Text
                                className={
                                    pickedDocuments[documentKey]
                                        ? "text-[#ada9a9]"
                                        : "text-[#114EA8]"
                                }
                            >
                                {pickedDocuments[documentKey]
                                    ? pickedDocuments[documentKey].name
                                    : `Upload ${label}`}
                            </Text>
                            {pickedDocuments[documentKey] && (
                                <Icon
                                    name="delete-forever-outline"
                                    size={20}
                                    color="#FF551F"
                                />
                            )}
                        </View>
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

    return (
        <ScrollView
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <View className="bg-white">
                <View className="w-full flex items-center">
                    <View className="w-[90%] justify-center items-center gap-2">
                        <View className="flex flex-row justify-center w-[50%] gap-2">
                            <View className="flex flex-row justify-center items-start w-full mb-4">
                                <View className="flex flex-col justify-center items-start w-full">
                                    <FormControl.Label>
                                        E-signed Agreement*
                                    </FormControl.Label>
                                    <TouchableOpacity className="flex flex-row border-[#114EA8] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full">
                                        <View className="flex flex-row justify-start items-center w-full">
                                            <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                                <Icon
                                                    name="file-multiple-outline"
                                                    size={16}
                                                    color="#396CB7"
                                                />
                                            </View>

                                            <View
                                                className={
                                                    "flex flex-row justify-between w-11/12"
                                                }
                                            >
                                                <Text
                                                    className={"text-[#114EA8]"}
                                                >
                                                    E-signed Agreement.pdf
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderDocumentUpload("Pan Card", "panCard")}
                        </View>
                        <View className="flex flex-row justify-center items-start w-[50%] gap-2">
                            {renderDocumentUpload(
                                "Aadhar Card front",
                                "aadharFront"
                            )}
                            {renderDocumentUpload(
                                "Aadhar Card back",
                                "aadharBack"
                            )}
                        </View>
                        <View className="flex flex-row justify-center w-[50%] gap-2">
                            {initialValues.aadharFrontDocumentError ||
                            initialValues.aadharBackDocumentError ||
                            !initialValues.remark ? (
                                <View className="justify-center items-center w-full mb-4">
                                    <View className="p-4">
                                        <CustomCheckbox
                                            label="I provide my consent to use Aadhar document for address verification and I agree to have masked the first 8 numbers of Aadhar and I agree for the collection, storage, and use of my Aadhar number for the specified purposes."
                                            isChecked={consentGiven}
                                            onChange={() =>
                                                setConsentGiven(!consentGiven)
                                            }
                                        />
                                    </View>
                                </View>
                            ) : (
                                <></>
                            )}
                        </View>

                        <View className="flex items-center my-[20px] w-full">
                            <Button
                                w="100%"
                                isLoading={isLoading}
                                isLoadingText="Uploading..."
                                marginTop={6}
                                bgColor={"#013974"}
                                onPress={uploadDocument}
                                isDisabled={isSubmitDisabled}
                            >
                                Submit
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default StepThreeUpload;
