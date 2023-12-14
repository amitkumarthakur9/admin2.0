import { memo, useState } from "react";
import { Dimensions, Image, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Avatar, TextInput, TouchableRipple } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSession } from "../../services/ctx";
import { Box, Menu, Pressable } from "native-base";

const TopHeader = ({ navigation }) => {
    const [text, setText] = useState("");
    const { signOut } = useSession();
    const { height, width } = useWindowDimensions();

    return (
        <View className="bg-white h-[60px] lg:h-14 flex flex-row justify-between items-center px-4" style={{ elevation: 1 }}>
            <View className="flex flex-row items-center w-4/12 justify-start ">
                {
                    width < 830 && <TouchableOpacity className="mr-4">
                        <Icon size={18} name={"bars"} onPress={navigation.toggleDrawer} />
                    </TouchableOpacity>
                }
            </View>
            {
                width < 830 && <View className="flex flex-row w-4/12 items-center justify-center ">
                    <TouchableOpacity className="">
                        <Image
                            source={require("../../../assets/images/kotak.png")}
                            style={{ width: 100, height: 40 }}
                        />
                    </TouchableOpacity>

                </View>
            }
            <View className="flex flex-row items-center w-4/12 justify-end ">

                {/* <Box w="90%" alignItems="center"> */}
                <Menu w="190" placement={"bottom left"} trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <Avatar.Image size={30} source={require('../../../assets/images/avatar.png')} />
                    </Pressable>;
                }}>
                    {/* <Menu.Item>Profile</Menu.Item> */}
                </Menu>
                {/* </Box> */}
                <TouchableRipple
                    rippleColor="rgba(0, 0, 0, .32)"
                    className='flex flex-row justify-start ml-2'
                    onPress={() => {
                        signOut();
                    }}
                >
                    {/* <View className='flex flex-row'> */}
                    <Icon name="sign-out" size={22} color="red" />
                    {/* <Text selectable className='text-sm font-bold text-rose-500'>Sign out</Text> */}
                    {/* </View> */}

                </TouchableRipple>
            </View>
        </View>
    )
}

export default memo(TopHeader)