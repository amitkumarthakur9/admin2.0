import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
    Platform,
    View,
    StyleSheet,
    Text,
    Alert,
    Modal,
    ActivityIndicator,
    Pressable,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getResponse } from "src/helper/helper";
import RemoteApi from "src/services/RemoteApi";

const DigioComponent = ({ onNext }) => {
    const webViewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [digioData, setDigioData] = useState({
        identifier: "",
        gwtToken: "",
        documentId: "DID240704155505835UPNNZ72RDXN2OQ",
        status: "",
    });

    const downloadReport = async () => {
        setModalMessage("Downloading report...");
        try {
            const response = await RemoteApi.get(
                "file/download-dsa-documents?documentName=esigneddocument"
            );
            console.log("digiresponse:", JSON.stringify(response));

            if (response.code === 200) {
                const dataArray = Object.values(response.data.data);
                const uint8Array = new Uint8Array(dataArray);
                const blob = new Blob([uint8Array], {
                    type: "application/pdf",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "e-esigned-document.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setModalMessage("Report downloaded successfully.");
            } else {
                console.error("Error in API response:", response.data.message);
                setModalMessage("Request failed, please try again.");
            }
        } catch (error) {
            console.error(error);
            setModalMessage("Request failed, please try again.");
        } finally {
            // setIsVerifying(false);
        }
    };

    const DownloadDigioPDF = async (statusId) => {
        setModalMessage("Downloading Digio PDF...");
        const data = { statusId: statusId, documentId: digioData.documentId };

        try {
            const response = await RemoteApi.post(
                "digio/download-esigned-document",
                data
            );
            console.log("responseData", response);

            if (
                response.code === 200 &&
                response.data !== "Unable to download document."
            ) {
                await downloadReport();
            } else {
                setModalMessage("Request failed, please try again.");
            }
        } catch (error) {
            console.error("Error downloading the PDF:", error);
            setModalMessage("Request failed, please try again.");
        }
    };

    const updateStatus = async () => {
        setModalMessage("Updating status...");
        try {
            const response = await RemoteApi.post("digio/create-sign-request");
            console.log("digiresponse:", JSON.stringify(response));
            // const response: any = await getResponse(200);

            if (response.code === 200) {
                setDigioData((prevState) => ({
                    ...prevState,
                    identifier: response.data.identifier,
                    gwtToken: response.data.gwtToken,
                    documentId: response.data.documentId,
                    status: "notset",
                }));

                setModalMessage("Status updated successfully.");
                return true;
            } else {
                setModalMessage("Request failed, please try again.");
                return false;
            }
        } catch (error) {
            console.error(error);
            setModalMessage("Request failed, please try again.");
            return false;
        }
    };

    const handlePress = () => {
        setModalMessage("Processing Digio...");
        if (Platform.OS === "web") {
            const iframe = webViewRef.current;
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Digio SDK</title>
                  <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    #digio-container { width: 100%; height: 100%; }
                  </style>
                </head>
                <body>
                  <div id="digio-container"></div>
                  <script src="https://ext.digio.in/sdk/v11/digio.js"></script>
                  <script>
                    document.addEventListener("DOMContentLoaded", function() {
                      var options = {
                        environment: 'sandbox',
                        callback: function(response) {
                          let status = "";
                          if (response.hasOwnProperty('error_code')) {
                            status = "rejected";
                          } else {
                            status = "signed";
                          }
                          window.parent.postMessage(JSON.stringify({status: status, documentId: response.digio_doc_id}), "*");
                        },
                        logo: 'https://www.mylogourl.com/image.jpeg',
                        is_iframe: true,
                        theme: {
                          primaryColor: '#AB3498',
                          secondaryColor: '#000000'
                        }
                      };
                      var digio = new Digio(options);
                      digio.init();
                      digio.submit("${digioData.documentId}", "${digioData.identifier}", "${digioData.gwtToken}");
                    });
                  </script>
                </body>
                </html>
            `);
            iframeDoc.close();

            return true;
        } else {
            Alert.alert("This functionality is only available on the web.");
            setModalMessage("Request failed, please try again.");
            return false;
        }
    };

    const handleESignAndDownload = async () => {
        setIsVerifying(true);
        const statusUpdated = await updateStatus();

        if (!statusUpdated) {
            setModalMessage("Request failed, please try again.");
            setIsVerifying(false);
            return;
        }

        try {
            const digioUpdated = await handlePress();

            if (digioUpdated) {
                // setDigioData((prevState) => ({
                //     ...prevState,
                //     status: "signed",
                // }));
                setIsVerifying(false);
                return;
            }

            if (!digioUpdated) {
                setModalMessage("Request failed, please try again.");
                setIsVerifying(false);
                return;
            }

            // setDigioData((prevState)=>({
            //     ...prevState,
            //     status: "signed",

            // }))
        } catch (error) {
            setModalMessage("Request failed, please try again.");
            setIsVerifying(false);
            // setDigioData((prevState)=>({
            //     ...prevState,
            //     status: "signed",

            // }))
            return;
        }
    };

    useEffect(() => {
        const handleMessage = (event) => {
            if (event && event.data) {
                try {
                    const message = JSON.parse(event.data);
                    if (message.status) {
                        setDigioData((prevState) => ({
                            ...prevState,
                            status: message.status,
                        }));
                    }
                } catch (e) {
                    console.error("Failed to parse message data:", e);
                }
            }
        };

        const iframe = webViewRef.current;
        const handleLoad = () => {
            window.addEventListener("message", handleMessage);
        };

        if (iframe) {
            iframe.addEventListener("load", handleLoad);
        }

        return () => {
            if (iframe) {
                iframe.removeEventListener("load", handleLoad);
            }
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    useEffect(() => {
        if (digioData.status === "signed") {
            DownloadDigioPDF(2);
            setIsVerifying(true);
        } else if (digioData.status === "rejected") {
            setModalMessage("Request failed, please try again.");
            setIsVerifying(true);
            DownloadDigioPDF(3);
        } else if (digioData.status === "notset") {
            handlePress();
        }

        console.log(digioData);
    }, [digioData.status]);

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "web" ? (
                <>
                    <>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={styles.proceed}
                                onPress={handleESignAndDownload}
                            >
                                <Text style={styles.buttonText}>
                                    E-sign document and download
                                </Text>
                            </Pressable>
                        </View>
                    </>

                    <iframe
                        ref={webViewRef}
                        style={styles.iframe}
                        title="Digio SDK"
                    />

                    <Modal
                        transparent={true}
                        visible={isVerifying}
                        onRequestClose={() => {
                            setIsVerifying(false);
                            setModalMessage(null);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                {modalMessage !==
                                    "Report downloaded successfully." && (
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setIsVerifying(false);
                                            setModalMessage(null);
                                        }}
                                    >
                                        <Icon
                                            name="close"
                                            size={20}
                                            color="#7C899C"
                                        />
                                    </TouchableOpacity>
                                )}

                                {modalMessage ? (
                                    modalMessage === "Downloading report..." ||
                                    modalMessage ===
                                        "Downloading Digio PDF..." ||
                                    modalMessage === "Updating status..." ||
                                    modalMessage === "Processing Digio..." ? (
                                        <>
                                            <ActivityIndicator />
                                            <Text style={styles.modalTitle}>
                                                {modalMessage}
                                            </Text>
                                        </>
                                    ) : modalMessage ===
                                      "Report downloaded successfully." ? (
                                        <>
                                            <Text style={styles.modalTitle}>
                                                {modalMessage}
                                            </Text>
                                            <Pressable
                                                style={styles.proceed}
                                                onPress={() => onNext()}
                                            >
                                                <Text style={styles.buttonText}>
                                                    Proceed to Upload Document
                                                </Text>
                                            </Pressable>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.modalText}>
                                                {modalMessage}
                                            </Text>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <ActivityIndicator />
                                        <Text style={styles.modalTitle}>
                                            E-Sign Request in Progress
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <Text>Not available on App</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    iframe: {
        width: "100%",
        height: 600,
        backgroundColor: "#FFFFFF",
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalText: {
        fontSize: 18,
        color: "red",
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
        color: "#ffffff",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 500,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: 20,
    },
});

export default DigioComponent;
