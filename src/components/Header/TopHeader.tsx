import { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Avatar, TextInput, TouchableRipple } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSession } from "../../services/ctx";
import { Box, Menu, Pressable } from "native-base";

export default function TopHeader({ navigation }) {
    const [text, setText] = useState("");
    const { signOut } = useSession();

    return (
        <View className="bg-white h-14 flex flex-row justify-between items-center px-4">
            <View className="flex flex-row items-center">
                {
                    Dimensions.get("window").width < 786 && <TouchableOpacity className="mr-4">
                        <Icon size={18} name={"bars"} onPress={navigation.toggleDrawer} />
                    </TouchableOpacity>
                }
                {/* <Icon name="search" size={18} color="black" /> */}
                {/* <TextInput
                    className="bg-white"
                    label="Type"
                    value={text}
                    // keyboardType={KeyboardType}
                    onChangeText={text => setText(text)}
                /> */}
            </View>
            <View className="flex flex-row items-center">

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
                    className='flex flex-row justify-start ml-3'
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