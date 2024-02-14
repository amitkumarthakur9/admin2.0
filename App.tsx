// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import "react-native-gesture-handler";

import * as React from "react";
import { View, TouchableOpacity, Image, Platform, LogBox } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./src/screens/Home";
import Detalhes from "./src/screens/Detalhes";
import CustomSidebarMenu from "./src/services/customSidebarMenu";
import { NativeWindStyleSheet } from "nativewind";
import {
    DefaultTheme,
    MD2Theme,
    MD3Theme,
    PaperProvider,
    useTheme,
} from "react-native-paper";
import { HomeScreen, SecondScreen } from "./src/routes/navigator";

NativeWindStyleSheet.setOutput({
    default: "native",
});
LogBox.ignoreAllLogs();
export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
    },
};

const Drawer = createDrawerNavigator();

function App() {
    return (
        <NavigationContainer>
            <PaperProvider theme={theme}>
                <Drawer.Navigator
                    screenOptions={{
                        drawerActiveTintColor: "#e91e63",
                        drawerType:
                            Platform.OS == "web" ? "permanent" : "slide",
                    }}
                    drawerContent={(props) => <CustomSidebarMenu {...props} />}
                >
                    <Drawer.Screen
                        name="FirstPage"
                        options={{ drawerLabel: "First page Option" }}
                        component={HomeScreen}
                    />
                    <Drawer.Screen
                        name="SecondPage"
                        options={{ drawerLabel: "Second page Option" }}
                        component={SecondScreen}
                    />
                </Drawer.Navigator>
            </PaperProvider>
        </NavigationContainer>
    );
}

export default App;
