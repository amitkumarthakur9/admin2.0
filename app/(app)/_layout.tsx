import { Link, Redirect, Stack } from "expo-router";
import {
    Dimensions,
    Platform,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";

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
import AumReconcile from "./aum-reconcile";
import SendInvite from "./invite-contact";
import AddIfaRm from "./add-ifa-rm";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import DistributorDashboardScreen from "./dashboard/[id]";
import IFAReportsScreen from "./ifa";
import { UserRoleProvider } from "../../src/context/useRoleContext";
import BrokerageScreen from "./brokerage";

NativeWindStyleSheet.setOutput({
    default: "native",
});

const queryClient = new QueryClient();

export default function AppLayout() {
    const [[isLoading, token], setToken] = useStorageState("token");
    const { height, width } = useWindowDimensions();
    const [roleId, setroleID] = useState(null);
    const [inviteDisplay, setinviteDisplay] = useState("");

    // console.log('token--------->', token);

    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);
            console.log(decoded);
            setroleID(decoded.roleId);
            console.log(decoded.roleId);
            if (decoded.roleId === 3 || decoded.roleId === 4) {
                setinviteDisplay("none");
            }
        }
    }, [token]);

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

    let screenForIFA = null;

    const drawerStructure = [
        {
            key: "Dashboard",
            content: (
                <Drawer.Screen
                    name="dashboard/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: "Dashboard",
                        title: "Dashboard",
                        unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={DashboardIFA}
                />
            ),
        },

        {
            key: "clientName",
            content: (
                <Drawer.Screen
                    name="clients/index"
                    options={{
                        drawerLabel: "Clients",
                        title: "Clients",
                        unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={ClientsScreen}
                />
            ),
        },
        {
            key: "AUM",
            content: (
                <Drawer.Screen
                    name="aum-reports/index"
                    options={{
                        drawerLabel: "AUM",
                        title: "AUM",
                        unmountOnBlur: true,
                    }}
                    initialParams={{ roleID: roleId }}
                    component={AUMTabScreen}
                />
            ),
        },
    ];

    // Conditionally add an additional object based on roleId to index 2
    if (roleId > 2) {
        drawerStructure.splice(1, 0, {
            key: "distributor",
            content: (
                <Drawer.Screen
                    name="ifa/index"
                    options={{
                        drawerLabel: "Distributor Report",
                        title: "Distributor Report",
                        unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={IFAReportsScreen}
                />
            ),
        });
    }

    // This layout can be deferred because it's not the root layout.
    // return <PaperProvider theme={PaperTheme}>
    return (
        <SafeAreaProvider style={{ backgroundColor: "white" }}>
            <QueryClientProvider client={queryClient}>
                <PaperProvider theme={PaperTheme}>
                    <UserRoleProvider>
                        <Drawer.Navigator
                            screenOptions={({ navigation }) => ({
                                drawerActiveTintColor: "#000000",
                                drawerStyle: {
                                    width: width < 830 ? "60%" : "15%",
                                },
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
                            drawerContent={(props) => (
                                <CustomSidebarMenu {...props} />
                            )}
                        >
                            {drawerStructure.map((item) => item.content)}
                            <Drawer.Screen
                                name="sip-reports/index"
                                options={{
                                    drawerLabel: "SIP Reports",
                                    title: "SIP Reports",
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={SIPReportsScreen}
                            />
                            <Drawer.Screen
                                name="rta-reconciliation/index"
                                options={{
                                    drawerLabel: "Transactions",
                                    title: "Transactions",
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={RTAReconciliationScreen}
                            />
                            <Drawer.Screen
                                name="mandates/index"
                                options={{
                                    drawerLabel: "Mandates",
                                    title: "Mandates",
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={MandatesScreen}
                            />
                            <Drawer.Screen
                                name="mandates/[id]"
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
                                name="orders/[id]"
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
                                name="clients/[id]/holdings/[holdingId]"
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
                                name="clients/[id]/index"
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
                                name="sip-reports/[id]"
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
                                name="folio/[id]"
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
                                name="rta-reconciliation/[id]"
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
                                name="mutual-fund/[id]"
                                options={{
                                    drawerLabel: "mutualfunddetail",
                                    title: "mutualfunddetail",
                                    drawerItemStyle: { display: "none" },
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={MutualFundDetail}
                            />
                            <Drawer.Screen
                                name="brokerage/index"
                                options={{
                                    drawerLabel: "Brokerage",
                                    title: "Brokerage",
                                    drawerItemStyle: { display: "none" },
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={BrokerageScreen}
                            />
                            {(roleId === 3 || roleId === 4) && (
                                <>
                                    <Drawer.Screen
                                        name="rta-sync"
                                        options={{
                                            drawerLabel: "RTA Sync",
                                            title: "RTA Sync",
                                            unmountOnBlur: true,
                                        }}
                                        initialParams={{}}
                                        component={RTASync}
                                    />
                                    <Drawer.Screen
                                        name="aum-reconcile"
                                        component={AumReconcile}
                                        options={{
                                            drawerLabel: "AUM Reconcile",
                                            title: "AUM Reconcile",
                                            unmountOnBlur: true,
                                        }}
                                        initialParams={{}}
                                    />
                                    <Drawer.Screen
                                        name="add-ifa"
                                        options={{
                                            drawerLabel: "Add Distributor",
                                            title: "Add Distributor",
                                            unmountOnBlur: true,
                                        }}
                                        initialParams={{}}
                                        component={AddIfaRm}
                                    />

                                    <Drawer.Screen
                                        name="ifa/[id]"
                                        options={{
                                            drawerLabel: "IFADetail",
                                            title: "IFADetail",
                                            drawerItemStyle: {
                                                display: "none",
                                            },
                                            unmountOnBlur: true,
                                        }}
                                        initialParams={{}}
                                        component={DistributorDashboardScreen}
                                    />
                                </>
                            )}
                            <Drawer.Screen
                                name="invite-contact"
                                options={{
                                    drawerLabel: "Invite Client",
                                    title: "Invite Client",
                                    drawerItemStyle: { display: inviteDisplay },
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={SendInvite}
                            />
                            <Drawer.Screen
                                name="dashboard/[id]"
                                options={{
                                    drawerLabel: "IFA Dashboard",
                                    title: "IFA Dashboard",
                                    drawerItemStyle: { display: "none" },
                                    unmountOnBlur: true,
                                }}
                                initialParams={{}}
                                component={DistributorDashboardScreen}
                            />
                        </Drawer.Navigator>
                    </UserRoleProvider>
                </PaperProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
