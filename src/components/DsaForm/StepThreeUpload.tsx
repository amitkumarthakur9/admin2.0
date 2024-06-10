import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    ViewStyle,
    Text,
    TouchableOpacity,
} from "react-native";
import {

    Button,

    View,

    FormControl,
    useToast,
} from "native-base";
import { useState, useCallback, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import RemoteApi from "../../services/RemoteApi";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

export default function RTASync() {
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
                type: [".png", ".pdf", ".jpg", ".jpeg"],
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
                <View className="w-full flex items-center">
                    <View className="mt-[20px] w-[80%]">
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col justify-center">
                                <FormControl.Label>Pan Card*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                        <Icon
                                            name="file-o"
                                            style={{}}
                                            size={14}
                                            color="#396CB7"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "Upload PAN Card"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col justify-center">
                                <FormControl.Label>Aadhar Card front*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                        <Icon
                                            name="file-o"
                                            style={{}}
                                            size={14}
                                            color="#396CB7"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "Upload Aadhar Card front"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col justify-center">
                                <FormControl.Label>Aadhar Card back*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                        <Icon
                                            name="file-o"
                                            style={{}}
                                            size={14}
                                            color="#396CB7"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "Upload Aadhar Card back"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col justify-center">
                                <FormControl.Label>Bank Account Check*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                        <Icon
                                            name="file-o"
                                            style={{}}
                                            size={14}
                                            color="#396CB7"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "Upload Bank Account Check"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex flex-row justify-center">
                            <View className="flex flex-col justify-center">
                                <FormControl.Label>E-signed Agreement*</FormControl.Label>
                                <TouchableOpacity
                                    className="flex flex-row border-[#e2e1e1] border-[1px] rounded-[5px] px-3 py-2 items-center"
                                    onPress={pickDocument}
                                >
                                    <View className="mr-[10px] bg-[#E8F1FF] p-2 rounded-full">
                                        <Icon
                                            name="file-o"
                                            style={{}}
                                            size={14}
                                            color="#396CB7"
                                        />
                                    </View>
                                    <Text className="text-[#ada9a9]">
                                        {" "}
                                        {pickedDocument
                                            ? pickedDocument.name
                                            : "Upload E-signed Agreement"}
                                    </Text>
                                    {pickedDocument && (
                                        <View className="ml-[5px] rounded border-[#FF551F] border-[1px] bg-white">
                                            <Text className="m-2 text-[8px] color-[#FF551F]">
                                                remove
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex items-center my-[20px]">
                            <Button
                                w={40}
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
}
