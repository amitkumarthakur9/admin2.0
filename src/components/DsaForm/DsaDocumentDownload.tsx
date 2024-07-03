import React, { useState } from "react";
import { Modal, View, Text, Pressable, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import RemoteApi from "../../services/RemoteApi"; // Adjust the path as per your project structure
import Success from "./Success";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DsaDocumentDownload = ({ clientId, downloadApi, fileName }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState({
        pancard: false,
        aadhaarfront: false,
        aadhaarback: false,
        esigneddocument: false,
    });
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const [message, setMessage] = useState(null);

    const handleModalClose = () => {
        setMessage(null);
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
        setMessage(null);

        const selectedKeys = Object.keys(selectedDocuments).filter(
            (key) => selectedDocuments[key]
        );

        try {
            const downloadPromises = selectedKeys.map((key) =>
                RemoteApi.getDownloadFile({
                    endpoint: `file/download-dsa-documents?documentName=${key}&requestId=${clientId}`,
                    fileName: `${fileName}_${key}`,
                })
            );

            const responses:any = await Promise.all(downloadPromises);

            const failedResponses = responses.filter(response => response.code !== 200);

            if (failedResponses.length > 0) {
                alert(failedResponses[0].message);
                setIsDownloadProcessing(false);
                setMessage("Download Failed: Failed to download some documents.");
                return;
            }

            setIsDownloadProcessing(false);
            setMessage("Download Success: Documents downloaded successfully.");
        } catch (error) {
            setIsDownloadProcessing(false);
            setMessage("Download Failed: Failed to download documents.");
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

                        {!message && (
                            <View className="p-4">
                                <Text
                                    style={{ fontSize: 18, marginBottom: 20, color: "#AAAAAA" }}
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

                        {message && (
                            <View className="p-4">
                                <Success message={message} code={code} />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DsaDocumentDownload;
