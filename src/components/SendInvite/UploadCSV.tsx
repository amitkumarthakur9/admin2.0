import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    ViewStyle,
    Text,
    TouchableOpacity,
} from "react-native";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import {
    Box,
    Popover,
    Button,
    ChevronLeftIcon,
    ChevronRightIcon,
    Pressable,
    View,
    Select,
    CheckIcon,
    Stack,
    Input,
    FormControl,
    useToast,
} from "native-base";
import { useState, useCallback, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import RemoteApi from "../../services/RemoteApi";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

export default function UploadCsv() {
    const [pickedDocument, setPickedDocument] = useState<any>(null);
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
    const pickDocument = async () => {
        if (pickedDocument == null) {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: [".csv"],
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

    //     setIsLoading(true)
    //     let formData = new FormData();
    //     formData.append('rta', rta)
    //     formData.append('file', pickedDocument);
    //     const response: any = await RemoteApi.postWithFormData("/file/upload-aum", formData);

    //     if (response?.message == "Success") {
    //         toast.show({
    //             render: ({
    //                 index
    //             }) => {
    //                 return <ToastAlert
    //                     id={index}
    //                     variant={"solid"}
    //                     title={response?.data}
    //                     description={""}
    //                     isClosable={true}
    //                     toast={toast}
    //                     status={"success"}
    //                 />;
    //             },
    //             placement: "top"
    //         })
    //     }
    //     setIsLoading(false)
    //     // console.log(response);
    // };

    // Function to remove a toast from the toasts array
    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const uploadDocument = async () => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("file", pickedDocument);

        try {
            // const response: any = await RemoteApi.postWithFormData(
            //     "/file/upload-aum",
            //     formData
            // );

            const response = {
                // message: "Success",
                message: "Not Success",
                data: "Contact uploaded Succesfully",
            };

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
                setPickedDocument(null);
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
                setPickedDocument(null);
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
                    <View
                        className={
                            "mt-4 z-[-1] w-[99%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px] shadow-lg"
                        }
                    >
                        <Text
                            selectable
                            className={"text-base md:text-lg font-bold mt-[10px] text-center"}
                        >
                            {"Upload Contacts from a CSV File"}
                        </Text>
                        <View className="mt-[20px] w-[80%]">
                            <Stack mx="4" w={"100%"} my={3}>
                                <FormControl.Label>
                                    Select File
                                </FormControl.Label>

                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px]">
                                        <Icon
                                            name="file"
                                            style={{}}
                                            size={14}
                                            color="#484848"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "choose file"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded-full border-[#e2e1e1] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {/* <FormControl.HelperText>
                            Must be atleast 6 characters.
                            </FormControl.HelperText>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Atleast 6 characters are required.
                            </FormControl.ErrorMessage> */}
                            </Stack>
                            <View className="flex items-center my-[10px]">
                                <Button
                                    isDisabled={pickedDocument == null}
                                    w={40}
                                    isLoading={isLoading}
                                    isLoadingText="Uploading..."
                                    // marginTop={1}
                                    bgColor={"#013974"}
                                    onPress={uploadDocument}
                                >
                                    Upload Contacts
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
