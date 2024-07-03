import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
    Platform,
    View,
    Button,
    StyleSheet,
    Text,
    Alert,
    Linking,
    Modal,
    ActivityIndicator,
    Pressable,
} from "react-native";
import RemoteApi from "src/services/RemoteApi";

// import RNFS from "react-native-fs";

const DigioComponent = (onNext) => {
    const webViewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [digioData, setDigioData] = useState({
        identifier: "",
        gwtToken: "",
        documentId: "",
        status: "",
    });

    const downloadReport = async () => {
        try {
            const response: any = await RemoteApi.get(
                "file/download-dsa-documents?documentName=esigneddocument"
            );
            console.log("digiresponse:", JSON.stringify(response));

            if (response.code === 200) {
                // Convert the data object to a Uint8Array
                const dataArray: any = Object.values(response.data.data);
                const uint8Array = new Uint8Array(dataArray);

                // Create a Blob from the Uint8Array
                const blob = new Blob([uint8Array], {
                    type: "application/pdf",
                });

                // Create a URL for the Blob
                const url = URL.createObjectURL(blob);

                // Create an anchor element and trigger a download
                const a = document.createElement("a");
                a.href = url;
                a.download = "e-esigned-document.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Clean up the URL object
                URL.revokeObjectURL(url);
                onNext();
            } else {
                console.error("Error in API response:", response.data.message);
                Alert.alert("Error", response.data.message);
            }
        } catch (error) {
            console.error(error);

            // Handle error
        } finally {
            setModalVisible(false); // Hide modal after operation completion
        }
    };

    const DownloadDigioPDF = async ({ statusId }) => {
        setModalVisible(true); // Show modal
        const data = {
            statusId: statusId,
            documentId: digioData.documentId,
        };

        try {
            const response: any = await RemoteApi.post(
                "digio/download-esigned-document",
                data
            );

            console.log("responseData");
            console.log(response);
            console.log(response.code);

            if (response) {
                await downloadReport();
            }
        } catch (error) {
            console.error("Error downloading the PDF:", error);
            setModalVisible(false); // Hide modal
        }
    };

    // useEffect(() => {
    //     updateStatus();
    // }, []);

    // useEffect(() => {
    //     if (digioData.documentId.length > 0) {
    //         handlePress();
    //     }
    // }, [digioData.documentId]);

    // useEffect(() => {
    //     if (digioData.documentId) {
    //         console.log("Updated digioData:", JSON.stringify(digioData));
    //     }
    //     if (digioData.status === "signed") {
    //         console.log("Updated digioData:", JSON.stringify(digioData));
    //         DownloadDigioPDF({ statusId: 2 });
    //     }

    //     if (digioData.status === "rejected") {
    //         console.log("Updated digioData:", JSON.stringify(digioData));
    //         DownloadDigioPDF({ statusId: 3 });
    //     }
    // }, [digioData.status]);

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

    const updateStatus = async () => {
        try {
            const response: any = await RemoteApi.post(
                "digio/create-sign-request"
            );
            console.log("digiresponse:", JSON.stringify(response));
            if (response.code === 200) {
                setDigioData((prevState) => ({
                    ...prevState,
                    identifier: response.data.identifier,
                    gwtToken: response.data.gwtToken,
                    documentId: response.data.documentId,
                    status: "",
                }));

                // handlePress();
                Alert.alert(
                    "Success",
                    response.message || "Successfully submitted the address"
                );
            } else {
                console.log("Error");
                Alert.alert(
                    "Error",
                    response.errors.message || "Failed to submit the address"
                );
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handlePress = () => {
        if (Platform.OS === "web") {
            const iframe = webViewRef.current;
            const iframeDoc =
                iframe.contentDocument || iframe.contentWindow.document;
            // Clear previous content
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
                //   <script src="https://app.digio.in/sdk/v11/digio.js"></script>
                  <script>
                    document.addEventListener("DOMContentLoaded", function() {
                      var options = {
                        environment: 'sandbox',
                        // environment: 'production',
                        callback: function(response) {
                            console.log("CallBack Diogio response:", JSON.stringify(response));
                          let status = "";
                          if (response.hasOwnProperty('error_code')) {
                            console.error('Error occurred in process:', response);
                            status = "rejected";
                            console.error(status);
                          } else {
                            console.log('Signing completed successfully:', response);
                            status = "signed";
                            console.log("Posting message to parent:", {status: status, documentId: response.digio_doc_id});
                            window.parent.postMessage(JSON.stringify({status: status, documentId: response.digio_doc_id}), "*");
                            console.error(status);
                          }
                          console.log("Posting message to parent:", {status: status, documentId: response.digio_doc_id});
          window.parent.postMessage(JSON.stringify({status: status, documentId: response.digio_doc_id}), "*");
                        },
                        logo: 'https://www.mylogourl.com/image.jpeg',
                        is_iframe: true,
                        theme: {
                          primaryColor: '#AB3498',
                          secondaryColor: '#000000'
                        }
                      };
                      console.log("digiohtml");
                      var digio = new Digio(options);
                      digio.init();
                      digio.submit("${digioData.documentId}", "${digioData.identifier}", "${digioData.gwtToken}");
                      console.log("digihtmldata","${digioData.documentId}", "${digioData.identifier}", "${digioData.gwtToken}");
                      window.addEventListener("message", (event) => {
                        if (event && event.data) {
                            const message = JSON.parse(event.data);
                            if (message.status) {
                                parent.postMessage(JSON.stringify({ status: message.status }), "*");
                            }
                        }
                      });
                    });
                  </script>
                </body>
                </html>
            `);
            iframeDoc.close();
            console.log("Message event listener attached");
        } else {
            Alert.alert("This functionality is only available on the web.");
        }
    };
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "web" ? (
                <>
                    <iframe
                        ref={webViewRef}
                        style={styles.iframe}
                        title="Digio SDK"
                    />
                    <Button title="Submit to Digio" onPress={handlePress} />
                    <Button title="Update status" onPress={updateStatus} />
                    <Button
                        title="Download Digio PDF"
                        onPress={() => DownloadDigioPDF({ statusId: 2 })}
                    />
                    <View className="flex flex-row justify-center">
                        <View className="w-3/12">
                            <Pressable
                                style={({ pressed }) => [
                                    styles.proceed,
                                    {
                                        borderColor: "#0066cc",
                                        opacity: pressed ? 0.6 : 1,
                                    },
                                ]}
                                onPress={() => updateStatus()}
                                // disabled={isVerifing === true}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: "#ffffff" },
                                    ]}
                                >
                                    {"E-sign document and download"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <Modal
                        transparent={true}
                        // animationType="slide"
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                Downloading PDF...
                            </Text>
                            <ActivityIndicator size="large" color="#0000ff" />
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
        color: "white",
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
});
export default DigioComponent;
