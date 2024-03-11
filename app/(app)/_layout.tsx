import { Link, Redirect, Stack } from "expo-router";
import {
    Dimensions,
    Platform,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { useSession } from "../../src/services/ctx";
import { PaperProvider } from "react-native-paper";
import { PaperTheme } from "../../src/theme/PaperTheme";
import { NativeWindStyleSheet } from "nativewind";
// import { Drawer } from '../../src/routes/drawer';
import CustomSidebarMenu from "../../src/services/customSidebarMenu";
import Icon from "react-native-vector-icons/FontAwesome";
import TopHeader from "../../src/components/Header/TopHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from ".";
import OrdersScreen from "./orders";
import OrderDetail from "./orders/[id]";
import ClientsScreen from "./clients";
import SIPReportsScreen from "./sip-reports";
import AUMReportsScreen from "./folio";
import RTAReconciliationScreen from "./rta-reconciliation";
import RTAReconciliationDetail from "./rta-reconciliation/[id]";
// import ClientDetail from './clients/[id]';
import SIPReportsDetail from "./sip-reports/[id]";
import AUMDetail from "./folio/[id]";
import { Center, HStack, Heading, Spinner } from "native-base";
import { useStorageState } from "../../src/services/useStorageState";
import ClientDetail from "./clients/[id]/index";
import HoldingDetail from "./clients/[id]/holdings/[holdingId]";
import MandatesScreen from "./mandates";
import MandateDetail from "./mandates/[id]";
import RTASync from "./rta-sync";
import AUMTabScreen from "./aum-reports";
import MutualFundDetail from "./mutual-fund/[id]";
import DashboardIFA from "./dashboard";

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function AppLayout() {
    const [[isLoading, token], setToken] = useStorageState("token");
    const { height, width } = useWindowDimensions();

    // console.log('token--------->', token);

    if (isLoading) {
        return (
            <Center>
                <HStack space={2} justifyContent="center">
                    <Spinner color={"black"} accessibilityLabel="Loading" />
                    <Heading color="black" fontSize="md">
                        Loading
                    </Heading>
                </HStack>
            </Center>
        );
    }

    if (!token) {
        return <Redirect href="/sign-in" />;
    }

    const Drawer = createDrawerNavigator();

    // This layout can be deferred because it's not the root layout.
    // return <PaperProvider theme={PaperTheme}>
    return (
        <SafeAreaProvider style={{ backgroundColor: "white" }}>
            <PaperProvider theme={PaperTheme}>
                <Drawer.Navigator
                    screenOptions={({ navigation }) => ({
                        drawerActiveTintColor: "#000000",
                        drawerStyle: { width: width < 830 ? "60%" : "15%" },
                        drawerType: width <= 768 ? "back" : "permanent",
                        header: (props) => (
                            <TopHeader navigation={navigation} />
                        ),
                        headerLeft: (props) => (
                            <View className="ml-4">
                                <Icon
                                    size={18}
                                    name={"bars"}
                                    onPress={navigation.toggleDrawer}
                                />
                            </View>
                        ),
                    })}
                    backBehavior="history"
                    detachInactiveScreens={true}
                    initialRouteName="clients/index"
                    drawerContent={(props) => <CustomSidebarMenu {...props} />}
                >
                    {/* <Drawer.Screen
                        // name="index" // This is the name of the page and must match the url from root
                        // options={{
                        //     drawerLabel: "Dashboard",
                        //     title: "Dashboard",
                        // }}

                        name='Home'
                        component={Dashboard}
                    /> */}

                    {/* <Drawer.Screen
                    name="orders/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: "Orders",
                        title: "",
                        drawerContentContainerStyle: {
                            backgroundColor: "white"
                        },
                        unmountOnBlur: true
                    }}

                    // initialParams={{}}
                    component={OrdersScreen}
                /> */}

                    <Drawer.Screen
                        name="dashboard" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Dashboard",
                            title: "Dashboard",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={DashboardIFA}
                    />

                    <Drawer.Screen
                        name="clients/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Clients",
                            title: "Clients",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={ClientsScreen}
                    />

                    <Drawer.Screen
                        name="aum-reports/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "AUM",
                            title: "AUM",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={AUMTabScreen}
                    />

                    <Drawer.Screen
                        name="sip-reports/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "SIP Reports",
                            title: "SIP Reports",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={SIPReportsScreen}
                    />

                    <Drawer.Screen
                        name="folio/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Folio",
                            title: "Folio",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={AUMReportsScreen}
                    />

                    <Drawer.Screen
                        name="rta-reconciliation/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Transactions",
                            title: "Transactions",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={RTAReconciliationScreen}
                    />

                    <Drawer.Screen
                        name="mandates/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "Mandates",
                            title: "Mandates",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={MandatesScreen}
                    />

                    <Drawer.Screen
                        name="rta-sync" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "RTA Sync",
                            title: "RTA Sync",
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={RTASync}
                    />

                    <Drawer.Screen
                        name="mandates/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "MandateDetail",
                            title: "MandateDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={MandateDetail}
                    />

                    <Drawer.Screen
                        name="orders/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "OrderDetail",
                            title: "OrderDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={OrderDetail}
                    />

                    <Drawer.Screen
                        name="clients/[id]/holdings/[holdingId]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "HoldingDetail",
                            title: "HoldingDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={HoldingDetail}
                    />

                    <Drawer.Screen
                        name="clients/[id]/index" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "ClientDetail",
                            title: "ClientDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={ClientDetail}
                    />

                    <Drawer.Screen
                        name="sip-reports/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "SipReportsDetail",
                            title: "SipReportsDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={SIPReportsDetail}
                    />

                    <Drawer.Screen
                        name="folio/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "FolioDetail",
                            title: "FolioDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={AUMDetail}
                    />

                    <Drawer.Screen
                        name="rta-reconciliation/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "RTAReconciliationDetail",
                            title: "RTAReconciliationDetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={RTAReconciliationDetail}
                    />
                    <Drawer.Screen
                        name="mutual-fund/[id]" // This is the name of the page and must match the url from root
                        options={{
                            drawerLabel: "mutualfunddetail",
                            title: "mutualfunddetail",
                            drawerItemStyle: { display: "none" },
                            unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={MutualFundDetail}
                    />

                    {/* </Drawer> */}
                </Drawer.Navigator>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
