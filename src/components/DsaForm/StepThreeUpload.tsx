import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Button, View, FormControl, useToast } from "native-base";
import { useState, useCallback, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
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
                formData.append(key, pickedDocuments[key]);
            }
        });

        try {
            const response: any = await RemoteApi.postWithFormData(
                "/file/upload-transaction",
                formData
            );

            if (response?.message == "Success") {
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
        onSuccess();
        setIsLoading(false);
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
                <View className="w-full flex items-center">
                    <View className="mt-[20px] w-[40%] justify-center items-center">
                        <View className="flex flex-row justify-start items-start w-full">
                            <View>
                                <Text className="font-bold color-[#404249]">
                                    Upload Document
                                </Text>
                            </View>
                        </View>

                        <View className="flex flex-row justify-center items-center w-full">
                            <View className="flex flex-col justify-center items-start w-full">
                                <FormControl.Label>Pan Card*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                                    onPress={() => pickDocument("panCard")}
                                >
                                    <View className="flex flex-row justify-start items-center">
                                        <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                            <Icon
                                                name="file-o"
                                                style={{}}
                                                size={14}
                                                color="#396CB7"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocuments.panCard
                                                    ? pickedDocuments.panCard
                                                          .name
                                                    : "Upload PAN Card"}
                                            </Text>
                                        </View>
                                    </View>
                                    {pickedDocuments.panCard && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center w-full">
                            <View className="flex flex-col justify-center w-full">
                                <FormControl.Label>
                                    Aadhar Card front*
                                </FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                                    onPress={() => pickDocument("aadharFront")}
                                >
                                    <View className="flex flex-row justify-start items-center">
                                        <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                            <Icon
                                                name="file-o"
                                                style={{}}
                                                size={14}
                                                color="#396CB7"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocuments.aadharFront
                                                    ? pickedDocuments
                                                          .aadharFront.name
                                                    : "Upload Aadhar Card front"}
                                            </Text>
                                        </View>
                                    </View>
                                    {pickedDocuments.aadharFront && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center w-full">
                            <View className="flex flex-col w-full">
                                <FormControl.Label>
                                    Aadhar Card back*
                                </FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                                    onPress={() => pickDocument("aadharBack")}
                                >
                                    <View className="flex flex-row justify-start items-center">
                                        <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                            <Icon
                                                name="file-o"
                                                style={{}}
                                                size={14}
                                                color="#396CB7"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocuments.aadharBack
                                                    ? pickedDocuments.aadharBack
                                                          .name
                                                    : "Upload Aadhar Card back"}
                                            </Text>
                                        </View>
                                    </View>

                                    {pickedDocuments.aadharBack && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center w-full">
                            <View className="flex flex-col justify-center w-full">
                                <FormControl.Label>
                                    Bank Account Check*
                                </FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                                    onPress={() => pickDocument("bankCheck")}
                                >
                                    <View className="flex flex-row justify-start items-center">
                                        <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                            <Icon
                                                name="file-o"
                                                style={{}}
                                                size={14}
                                                color="#396CB7"
                                            />
                                        </View>

                                        <View>
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocuments.bankCheck
                                                    ? pickedDocuments.bankCheck
                                                          .name
                                                    : "Upload Bank Account Check"}
                                            </Text>
                                        </View>
                                    </View>

                                    {pickedDocuments.bankCheck && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center w-full">
                            <View className="flex flex-col justify-center w-full">
                                <FormControl.Label>
                                    E-signed Agreement*
                                </FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center justify-between w-full"
                                    onPress={() =>
                                        pickDocument("esignedAgreement")
                                    }
                                >
                                    <View className="flex flex-row justify-start items-center">
                                        <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                            <Icon
                                                name="file-o"
                                                style={{}}
                                                size={14}
                                                color="#396CB7"
                                            />
                                        </View>
                                        <View>
                                            <Text className="text-[#ada9a9]">
                                                {" "}
                                                {pickedDocuments.esignedAgreement
                                                    ? pickedDocuments
                                                          .esignedAgreement.name
                                                    : "Upload E-signed Agreement"}
                                            </Text>
                                        </View>
                                    </View>

                                    {pickedDocuments.esignedAgreement && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
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
