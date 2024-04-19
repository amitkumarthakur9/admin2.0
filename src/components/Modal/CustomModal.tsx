import React, { useState } from "react";
import {
    Modal,
    Pressable,
    FormControl,
    Button,
    Text,
    Input,
    View,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";


const CustomModal = ({children, show}) => {
    const [showModal, setShowModal] = useState(show);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
         <View>
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    p="10"
                    className=""
                >
                    <Modal.Content className="bg-white p-8">
                        <Modal.Body>
                            <View className="flex flex-row w-11/12">
                                <View className="w-full">
                                    <Text className="text-lg text-bold">
                                        Change password
                                    </Text>
                                    <Text className="text-sm text-semibold text-[#898989]">
                                        In order to keep your account safe you
                                        need to create a strong password.
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={handleCloseModal}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-2 h-[20px] border-slate-200"
                                    }
                                    aria-describedby="addNewClient"
                                >
                                    <Icon
                                        name="close"
                                        size={14}
                                        color="#484848"
                                    />
                                </Pressable>
                            </View>
                            {children}
                            </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>


</>
    );
};

export default CustomModal;