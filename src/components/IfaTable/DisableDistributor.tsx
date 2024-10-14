import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import RemoteApi from "src/services/RemoteApi";

const DisableDistributor = ({ distributorId }: { distributorId: number }) => {
    const [isDisabled, setIsDisabled] = useState(false); // Initial state for distributor status
    const [modalVisible, setModalVisible] = useState(false);

    // API call to disable or enable the distributor
    const toggleDistributorStatus = async () => {
        const data = {
            isActive: isDisabled,
        };

        console.log("disableDistibutor", data);
        try {
            const response = await RemoteApi.post(
                `distributor/${distributorId}/update-activity`,
                data
            );
            // const response = {
            //     code: 200,
            // };

            if (response) {
                setIsDisabled(!isDisabled); // Toggle the disabled status
            }
            setModalVisible(false); // Close the modal
        } catch (error) {
            console.error("Error disabling/enabling distributor", error);
        }
    };

    // Handlers for modal visibility
    const confirmAction = () => {
        toggleDistributorStatus();
    };

    const cancelAction = () => {
        setModalVisible(false); // Close the modal without any action
    };

    return (
        <View className="p-4 items-center">
            {/* Button to disable/enable distributor */}
            <Pressable
                className={`p-2 rounded w-full ${
                    isDisabled ? "bg-green-600" : "bg-red-600"
                }`}
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-white font-bold text-center">
                    {isDisabled ? "Enable Distributor" : "Disable Distributor"}
                </Text>
            </Pressable>

            {/* Modal for confirmation */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={cancelAction}
            >
                <View
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(128, 128, 128, 0.5)" }}
                >
                    <View className="w-72 p-5 bg-white rounded-lg items-center">
                        <Text className="text-lg font-bold mb-4">
                            Are you sure you want to{" "}
                            {isDisabled ? "enable" : "disable"} the distributor?
                        </Text>
                        <View className="flex-row justify-between w-full">
                            <Pressable
                                className="flex-1 bg-white border border-blue-600 py-2 rounded mr-2 items-center"
                                onPress={cancelAction}
                            >
                                <Text className="text-blue-600 font-bold">
                                    Cancel
                                </Text>
                            </Pressable>
                            <Pressable
                                className="flex-1 bg-blue-600 py-2 rounded items-center"
                                onPress={confirmAction}
                            >
                                <Text className="text-white font-bold">
                                    Yes
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DisableDistributor;
