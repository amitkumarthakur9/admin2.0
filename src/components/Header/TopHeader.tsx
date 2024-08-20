import { memo, useState } from "react";
import {
    Dimensions,
    Image,
    TouchableOpacity,
    View,
    useWindowDimensions,
    Modal,
} from "react-native";
import { Avatar, TextInput, TouchableRipple } from "react-native-paper";
import { useSession } from "../../services/ctx";
import {
    Box,
    HamburgerIcon,
    Menu,
    Pressable,
    Text,
    ArrowForwardIcon,
} from "native-base";
import ChangePassword from "../Password/ChangePassword";

interface TopHeaderProps {
    navigation: any;
    logo?: boolean; // logo is an optional boolean prop, defaulting to false
}

const TopHeader = ({ navigation, logo = false }) => {
    const [text, setText] = useState("");
    const { signOut, userData } = useSession();
    const { height, width } = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = () => {
        setModalVisible(true);
    };

    const confirmSignOut = () => {
        setModalVisible(false);
        signOut(); // Trigger the sign-out function
    };

    const cancelSignOut = () => {
        setModalVisible(false); // Close the modal
    };

    return (
        <View
            className="bg-white h-[60px] lg:h-14 flex flex-row justify-between items-center px-4"
            style={{ elevation: 1 }}
        >
            <View className="flex flex-row items-center w-4/12 justify-start ">
                {width < 830 ? (
                    <TouchableOpacity
                        className="mr-4"
                        onPress={navigation.toggleDrawer}
                    >
                        <HamburgerIcon />
                    </TouchableOpacity>
                ) : (
                    <View className="flex flex-row w-4/12 items-center justify-start ">
                        {logo && (
                            <TouchableOpacity>
                                <Image
                                    source={require("../../../assets/images/kotak.png")} // Ensure this path is correct
                                    style={{
                                        width: 100,
                                        height: 40,
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
            {width < 830 && (
                <View className="flex flex-row w-4/12 items-center justify-center ">
                    <TouchableOpacity className="">
                        <Image
                            source={require("../../../assets/images/kotak.png")}
                            style={{ width: 100, height: 40 }}
                        />
                    </TouchableOpacity>
                </View>
            )}
            <View className="flex flex-row items-center w-4/12 justify-end ">
                {/* <Box w="90%" alignItems="center"> */}

                <Menu
                    w="190"
                    placement={"bottom left"}
                    trigger={(triggerProps) => {
                        return (
                            <Pressable
                                accessibilityLabel="More options menu"
                                {...triggerProps}
                            >
                                <Avatar.Image
                                    size={30}
                                    source={require("../../../assets/images/avatar.png")}
                                />
                            </Pressable>
                        );
                    }}
                >
                    {/* <Menu.Item>Profile</Menu.Item> */}
                    <Box p={4} width="100%" height="100%">
                        {/* <Text>Name</Text> */}
                        <Text className="text-base">{userData?.name}</Text>
                        {/* <Text>Role</Text> */}

                        <Text>{"Designation: " + userData?.role?.name}</Text>

                        {/* <Text>{userData?.role?.roleType?.name}</Text> */}
                        <View className="mt-2 pt-1 border-t border-gray-300">
                            <ChangePassword />
                        </View>
                    </Box>
                </Menu>

                {/* </Box> */}

                <TouchableOpacity
                    // rippleColor="rgba(0, 0, 0, .32)"
                    className="flex flex-row justify-start ml-2"
                    onPress={() => {
                        signOut(); // Call the sign-out function when pressed
                    }}
                >
                    {/* <View className="border-y border-l rounded p-1 border-gray-500">
                        <View className="mr-[-6] pl-1">
                            <ArrowForwardIcon size={3} />
                        </View>
                    </View> */}
                    <View>
                        <TouchableOpacity
                            className="ml-2"
                            onPress={handleSignOut}
                        >
                            <Image
                                source={require("../../../assets/images/logout.svg")}
                            />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                // animationType="slide"
                onRequestClose={cancelSignOut}
            >
                <View
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(128, 128, 128, 0.5)" }}
                >
                    <View className="w-72 p-5 bg-white rounded-lg items-center ">
                        <Text className="text-lg font-bold mb-4">
                            Are you sure to log out?
                        </Text>
                        <View className="flex-row justify-between w-full">
                            <Pressable
                                className="flex-1 bg-white border border-blue-600 py-2 rounded mr-2 items-center"
                                onPress={cancelSignOut}
                            >
                                <Text className="text-blue-600 font-bold">
                                    Cancel
                                </Text>
                            </Pressable>
                            <Pressable
                                className="flex-1 bg-blue-600 py-2 rounded items-center"
                                onPress={confirmSignOut}
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

export default memo(TopHeader);
