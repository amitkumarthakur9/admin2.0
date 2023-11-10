import { Link, Redirect, Stack } from 'expo-router';
import { Dimensions, Text, View } from 'react-native';
import { useSession } from '../../src/services/ctx';
import { PaperProvider } from 'react-native-paper';
import { PaperTheme } from '../../src/theme/PaperTheme';
import { NativeWindStyleSheet } from 'nativewind';
// import { Drawer } from '../../src/routes/drawer';
import CustomSidebarMenu from '../../src/services/customSidebarMenu';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopHeader from '../../src/components/Header/TopHeader';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '.';
import OrdersScreen from './orders';
import OrderDetail from './orders/[id]';
import ClientsScreen from './clients';
import SIPReportsScreen from './sip-reports';
import AUMReportsScreen from './aum';


NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function AppLayout() {
    const { token, isLoading } = useSession();

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!token) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/sign-in" />;
    }

    const Drawer = createDrawerNavigator();

    // This layout can be deferred because it's not the root layout.
    // return <PaperProvider theme={PaperTheme}>
    return <SafeAreaProvider>
        <PaperProvider theme={PaperTheme}>
            <NativeBaseProvider>
                {/* <Drawer screenOptions={({ navigation }) => ({
                    drawerActiveTintColor: '#000000',
                    drawerType: Dimensions.get('window').width <= 768 ? "back" : "permanent",
                    // drawerStyle: { width: "15%", },

                    header: props => <TopHeader navigation={navigation} />,
                    headerLeft: props => <View className='ml-4'><Icon size={18} name={"bars"} onPress={navigation.toggleDrawer} /></View>,
                })} */}
                {/* drawerContent={(props) => <CustomSidebarMenu {...props} />
                    } */}
                {/* > */}
                {/* <NavigationContainer> */}
                <Drawer.Navigator
                    screenOptions={({ navigation }) => ({
                        drawerActiveTintColor: '#000000', drawerType: Dimensions.get('window').width <= 768 ? "back" : "permanent", header: props => <TopHeader navigation={navigation} />,
                        headerLeft: props => <View className='ml-4'><Icon size={18} name={"bars"} onPress={navigation.toggleDrawer} /></View>,
                    })}
                    initialRouteName="Home" drawerContent={(props) => <CustomSidebarMenu {...props} />} >
                    <Drawer.Screen
                        // name="index" // This is the name of the page and must match the url from root
                        // options={{
                        //     drawerLabel: "Dashboard",
                        //     title: "Dashboard",
                        // }}
                        name='Home'
                        component={Dashboard}
                    />


                    <Drawer.Screen
                        name="orders/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Orders",
                            title: "",
                        }}
                        // initialParams={{}}
                        component={OrdersScreen}
                    />

                    <Drawer.Screen
                        name="clients" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Clients",
                            title: "Clients",
                        }}
                        initialParams={{}}
                        component={ClientsScreen}
                    />

                    <Drawer.Screen
                        name="sip-reports" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "SIP Reports",
                            title: "SIP Reports",
                        }}
                        initialParams={{}}
                        component={SIPReportsScreen}
                    />

                    <Drawer.Screen
                        name="aum" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "AUM Reports",
                            title: "AUM Reports",
                        }}
                        initialParams={{}}
                        component={AUMReportsScreen}
                    />

                    <Drawer.Screen

                        name="orders/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "OrderDetail",
                            title: "OrderDetail",
                            drawerItemStyle: { display: 'none' }
                        }}
                        initialParams={{}}
                        component={OrderDetail}
                    />


                    {/* </Drawer> */}
                </Drawer.Navigator>
                {/* </NavigationContainer> */}
            </NativeBaseProvider>
        </PaperProvider>
    </SafeAreaProvider>;
}
