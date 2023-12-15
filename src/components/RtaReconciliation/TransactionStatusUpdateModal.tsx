import { useState } from "react";
import RemoteApi from "../../services/RemoteApi";
import { Box, Button, Center, CheckIcon, Modal, Select, useToast } from "native-base";
import { Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAlert } from "../../helper/CustomToaster";

type DataItem = {
    count: number;
};

type ApiResponse = {
    message: "Success" | "Failed" | "Failure";
    data?: DataItem;
};


export const TransactionStatusModal = ({ transactionStatus, id, modalVisible, setModalVisible, setId, getDataList }) => {
    const [selectedStatus, setSelectedStatus] = useState(transactionStatus);
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast();

    console.log("transactionStatus", transactionStatus);


    const statuses = [
        {
            "displayString": "Registered",
            "value": "Registered"
        },
        {
            "displayString": "Alloted",
            "value": "3"
        },
        {
            "displayString": "Failed",
            "value": "5"
        },
    ];

    const handleChangeStatus = async (e) => {
        setSelectedStatus(e)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const statusValue = statuses.find((status, index) => status.displayString == selectedStatus)?.value

        if (statusValue && id) {
            const response: ApiResponse = await RemoteApi.patch(`transaction/reconcile/${id}`, {
                transactionStatusId: Number(statusValue)
            });

            if (response.message == "Success") {
                toast.show({
                    render: ({
                        index
                    }) => {
                        return <ToastAlert
                            id={index}
                            variant={"solid"}
                            title={"Status changed successfully."}
                            description={""}
                            isClosable={true}
                            toast={toast}
                            status={"success"}
                        />;
                    },
                    placement: "top"
                })

                getDataList();
            }
        }
        setIsLoading(false)
    }

    return <Modal isOpen={modalVisible} onClose={() => { setModalVisible(false), setId(""), setSelectedStatus(""), setSelectedStatus("") }} avoidKeyboard safeAreaTop={true} size="lg">
        <Modal.Content>
            <Modal.CloseButton />
            <Modal.Body>
                <Text className="mb-12 text-md font-medium">Transaction Status Update</Text>
                <Box>
                    <Select
                        dropdownIcon={<Icon name="chevron-down" style={{ fontWeight: "100", marginRight: 4 }} color="#9c9c9c" />}
                        selectedValue={selectedStatus} accessibilityLabel="Choose Status" placeholder="Choose Status" _selectedItem={{
                            bg: "gray.50",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => handleChangeStatus(itemValue)}>
                        {
                            statuses?.map((filter, index) => {
                                return <Select.Item key={index} label={filter.displayString} value={filter.displayString} isDisabled={filter.displayString == "Registered"} />

                            })
                        }
                    </Select>
                    <Center>
                        <Button isLoading={isLoading} isLoadingText="Submitting..." mt={5} bgColor={"#013974"} size={"md"} onPress={handleSubmit}>Sumbit</Button>
                    </Center>
                </Box>
            </Modal.Body>
        </Modal.Content>
    </Modal>
}
