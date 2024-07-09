import React, { useState } from "react";
import { Modal, View, Text, Pressable, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import RemoteApi from "../../services/RemoteApi"; // Adjust the path as per your project structure
import Success from "./Success";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DsaDocumentDownload = ({ requestId }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState({
        pancard: false,
        aadhaarfront: false,
        aadhaarback: false,
        esigneddocument: false,
    });
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const [successMessages, setSuccessMessages] = useState([]);
    const [failedMessages, setFailedMessages] = useState([]);

    const handleModalClose = () => {
        setSuccessMessages([]);
        setFailedMessages([]);
        setSelectedDocuments({
            pancard: false,
            aadhaarfront: false,
            aadhaarback: false,
            esigneddocument: false,
        });
        setModalVisible(false);
    };

    const toggleDocumentSelection = (doc) => {
        setSelectedDocuments((prev) => ({ ...prev, [doc]: !prev[doc] }));
    };

    const downloadReport = async () => {
        setIsDownloadProcessing(true);
        setSuccessMessages([]);
        setFailedMessages([]);

        const selectedKeys = Object.keys(selectedDocuments).filter(
            (key) => selectedDocuments[key]
        );

        try {
            const downloadPromises = selectedKeys.map((key) =>
                RemoteApi.get(
                    `file/download-dsa-documents?documentName=${key}&requestId=${requestId}`
                )
            );

            const responses = await Promise.all(downloadPromises);

            responses.forEach((response, index) => {
                if (response.code === 200) {
                    const dataArray = Object.values(response.data.data);
                    const uint8Array = new Uint8Array(dataArray);

                    const blob = new Blob([uint8Array], {
                        type: "application/pdf",
                    });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${selectedKeys[index]}-document.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    setSuccessMessages((prev) => [
                        ...prev,
                        `${selectedKeys[index]} document downloaded successfully.`,
                    ]);
                } else {
                    setFailedMessages((prev) => [
                        ...prev,
                        `${selectedKeys[index]} document download failed.`,
                    ]);
                }
            });

            setIsDownloadProcessing(false);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred while downloading documents.");
            setIsDownloadProcessing(false);
        }
    };

    return (
        <View>
            <Pressable onPress={() => setModalVisible(true)}>
                <View
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 25,
                        padding: 10,
                        borderColor: "#3A70FF",
                        borderWidth: 1,
                    }}
                >
                    <Text style={{ color: "#3A70FF", textAlign: "center" }}>
                        Download Documents
                    </Text>
                </View>
            </Pressable>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#FFF",
                            borderRadius: 10,
                            padding: 20,
                        }}
                    >
                        <Pressable
                            onPress={() => handleModalClose()}
                            style={{ alignSelf: "flex-end" }}
                        >
                            <Icon name="close" size={20} color="#7C899C" />
                        </Pressable>

                        {successMessages.length === 0 && failedMessages.length === 0 && (
                            <View className="p-4">
                                <Text
                                    style={{
                                        fontSize: 18,
                                        marginBottom: 20,
                                        color: "#AAAAAA",
                                    }}
                                >
                                    Select Documents to Download
                                </Text>
                                {Object.keys(selectedDocuments).map((key) => (
                                    <View
                                        key={key}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Text className="mr-8 font-semibold color-gray-600">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </Text>
                                        <Checkbox
                                            status={
                                                selectedDocuments[key]
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            onPress={() =>
                                                toggleDocumentSelection(key)
                                            }
                                            color="#114EA8"
                                        />
                                    </View>
                                ))}
                                <Pressable
                                    onPress={downloadReport}
                                    disabled={isDownloadProcessing}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "#114EA8",
                                            borderRadius: 8,
                                            padding: 10,
                                            marginTop: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#FFF",
                                                textAlign: "center",
                                            }}
                                        >
                                            Download Documents
                                        </Text>
                                    </View>
                                </Pressable>
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text
                                        style={{
                                            color: "#1D4ED8",
                                            textAlign: "center",
                                            marginTop: 10,
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </Pressable>
                            </View>
                        )}

                        {(successMessages.length > 0 || failedMessages.length > 0) && (
                            <View className="p-4">
                                <Success
                                    successMessages={successMessages}
                                    failedMessages={failedMessages}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DsaDocumentDownload;
