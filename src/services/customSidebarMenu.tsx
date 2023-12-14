// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image,
    Text,
    Linking,
} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableRipple } from 'react-native-paper';
import { useSession } from './ctx';


const CustomSidebarMenu = (props) => {
    return (
        <SafeAreaView style={{ flex: 1, }}>
            {/*Top Large Image */}
            <Image
                source={require("../../assets/images/kotak.png")}
                style={styles.sideMenuProfileIcon}
            />
            {/* <View className='flex flex-row justify-start pl-3'>
                <Text selectable className='text-xl font-bold text-slate-400'>Dashboard</Text>
            </View> */}
            <DrawerContentScrollView {...props}>

                <DrawerItemList {...props} />

            </DrawerContentScrollView>
            {/* <TouchableRipple
                rippleColor="rgba(0, 0, 0, .32)"
                className='flex flex-row justify-start pl-3 mb-3'
                onPress={() => {
                    signOut();
                }}
            >
                <View className='flex flex-row'>
                    <Icon name="sign-out" size={18} color="red" />
                    <Text selectable className='text-sm font-bold text-rose-500'>Sign out</Text>
                </View>

            </TouchableRipple> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        resizeMode: 'center',
        marginTop: 10,
        width: 120,
        height: 100,
        // borderRadius: 100 / 2,
        objectFit: "contain",
        alignSelf: 'center',
    },
    iconStyle: {
        width: 15,
        height: 15,
        marginHorizontal: 5,
    },
    customItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CustomSidebarMenu;
