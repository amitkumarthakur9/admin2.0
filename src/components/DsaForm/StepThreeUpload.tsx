import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Button, View, FormControl, useToast } from "native-base";
import { useState, useCallback, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RemoteApi from "../../services/RemoteApi";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

const StepThreeUpload = ({ onSuccess }) => {
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
    const isSubmitDisabled = !pickedDocuments.panCard || !pickedDocuments.aadharFront || !pickedDocuments.aadharBack;

    useEffect(() => {
        // Clear existing toasts
        toast.closeAll();

        // Show the latest toast
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
                        onClose={() => removeToast(latestToast.id)} // Remove the toast from the 'toasts' array when closed
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    // Function to remove a toast from the toasts array
    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const pickDocument = async (documentType) => {
        if (pickedDocuments[documentType] == null) {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: [".png", ".pdf", ".jpg", ".jpeg"],
                // type: [".pdf"],
                copyToCacheDirectory: true,
            });
            // console.log('selected file', result);
            if (result.assets.length > 0) {
                // let { name, size, uri } = result.assets[0];
                // let newUri = "file:///" + uri.split("data:/").join("");
                // let nameParts = name.split(".");
                // let fileType = nameParts[nameParts.length - 1];
                // var fileToUpload = {
                //     name: name,
                //     size: size,
                //     uri: newUri,
                //     type: "application/" + fileType,
                // };

                if (documentType == "panCard") {
                    setPickedDocuments(result.assets[0].file);
                }
                // console.log(fileToUpload, '...............file')

                setPickedDocuments({
                    ...pickedDocuments,
                    [documentType]: result.assets[0].file,
                });
            }
        } else {
            // setPickedDocuments(null);
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
                    fileKey = "bank_check";
                }

                formData.append(fileKey, pickedDocuments[key]);
            }
        });

        try {
            const response: any = await RemoteApi.postWithFormData(
                "file/upload-dsa-documents",
                formData
            );

            if (response.code === 200) {
                const uniqueId = uuidv4();
                // Add the success toast to the toasts array in the component's state
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
                // const uniqueId = uuidv4();
                // setToasts([...toasts, { id: uniqueId, variant: "solid", title: "Upload Failed", status: "error" }]);
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
        // onSuccess();
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
                    className="flex flex-row border-[#114EA8] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                    onPress={() => pickDocument(documentKey)}
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
                            {renderDocumentUpload("Pan Card", "panCard")}
                            {renderDocumentUpload(
                                "Aadhar Card front",
                                "aadharFront"
                            )}
                        </View>
                        <View className="flex flex-row justify-center w-[50%] gap-2">
                            {renderDocumentUpload(
                                "Aadhar Card back",
                                "aadharBack"
                            )}
                            {/* {renderDocumentUpload(
                                "esignedAgreement",
                                "esignedAgreement"
                            )} */}
                            <View className="flex flex-row justify-center items-center w-full mb-4">
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
