import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    ViewStyle,
    Text,
    TouchableOpacity,
} from "react-native";
import { TableBreadCrumb } from "../../../../src/components/BreadCrumbs/TableBreadCrumb";
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
import RemoteApi from "../../../../src/services/RemoteApi";
import { ToastAlert } from "../../../../src/helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

export default function sipCancelUpload() {
    const [rta, setRta] = useState("");
    const [pickedDocument, setPickedDocument] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
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

    const pickDocument = async () => {
        if (pickedDocument == null) {
            let result: any = await DocumentPicker.getDocumentAsync({
                type: [".dbf", ".csv"],
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
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: response?.data,
                        status: "success",
                    },
                ]);
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

        setIsLoading(false);
    };

    const handleSync = async () => {
        setIsSyncing(true);
        const response: any = await RemoteApi.post("/file/sync");

        if (response?.message == "Success") {
            toast.show({
                render: ({ index }) => {
                    return (
                        <ToastAlert
                            id={index}
                            variant={"solid"}
                            title={response?.data}
                            description={""}
                            isClosable={true}
                            toast={toast}
                            status={"success"}
                        />
                    );
                },
                placement: "top",
            });
        }

        setIsSyncing(false);
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
                    <TableBreadCrumb name={"RTA Sync"} />
                </View>
                <View className="w-full flex items-center">
                    <View className="flex flex-row justify-end w-[90%]">
                        <Button
                            rightIcon={
                                <Icon
                                    name="rotate-right"
                                    style={{}}
                                    size={14}
                                    color="#ffffff"
                                />
                            }
                            w={40}
                            isLoading={isSyncing}
                            isLoadingText="Uploading..."
                            marginTop={6}
                            bgColor={"#013974"}
                            onPress={handleSync}
                        >
                            Sync
                        </Button>
                    </View>
                    <View
                        className={
                            "mt-4 z-[-1] w-[90%] flex items-center border-[#c8c8c8] border-[0.2px] rounded-[5px]"
                        }
                    >
                        <Text
                            selectable
                            className={"text-xl font-bold mt-[10px]"}
                        >
                            {"Upload RTA File"}
                        </Text>
                        <View className="mt-[20px] w-[80%]">
                            <Stack mx="4" w={"100%"}>
                                <FormControl.Label>
                                    Select RTA
                                </FormControl.Label>
                                <Select
                                    accessibilityLabel="Select"
                                    placeholder="Select"
                                    _selectedItem={{
                                        bg: "gray.50",
                                        endIcon: <CheckIcon size="2" />,
                                    }}
                                    mt={1}
                                    onValueChange={(itemValue) =>
                                        setRta(itemValue)
                                    }
                                >
                                    <Select.Item
                                        label={"CAMS"}
                                        value={"CAMS"}
                                    />
                                    <Select.Item
                                        label={"KARVY"}
                                        value={"KARVY"}
                                    />
                                </Select>
                            </Stack>

                            <Stack mx="4" w={"100%"} my={3}>
                                <FormControl.Label>
                                    Select File
                                </FormControl.Label>
                                {/* <Dropzone onDrop={onDrop}>
                                <Text>TEXT HERE</Text>
                            </Dropzone> */}
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
                            <View className="flex items-center my-[20px]">
                                <Button
                                    w={40}
                                    isLoading={isLoading}
                                    isLoadingText="Uploading..."
                                    marginTop={6}
                                    bgColor={"#013974"}
                                    onPress={uploadDocument}
                                >
                                    Upload
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
