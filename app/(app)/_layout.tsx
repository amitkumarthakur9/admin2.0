import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, Redirect, Stack } from "expo-router";
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { useSession } from "../../src/services/ctx";
import { PaperProvider } from "react-native-paper";
import { PaperTheme } from "../../src/theme/PaperTheme";
import { NativeWindStyleSheet } from "nativewind";
import CustomSidebarMenu from "../../src/services/customSidebarMenu";
import Icon from "react-native-vector-icons/FontAwesome";
import TopHeader from "../../src/components/Header/TopHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
    Button,
    Center,
    Fab,
    HStack,
    HamburgerIcon,
    Heading,
    Image,
    PresenceTransition,
    Spinner,
} from "native-base";
import { useStorageState } from "../../src/services/useStorageState";
import { jwtDecode } from "jwt-decode";
import { UserRoleProvider } from "../../src/context/useRoleContext";
import MarketingScreen from "./marketing";
import AntDesign from "react-native-vector-icons/AntDesign";
import ClientARNDetail from "./arn-transfer/[id]";
import ClientDetail from "./clients/[id]/index";

NativeWindStyleSheet.setOutput({
    default: "native",
});

const DashboardIFA = lazy(() => import("./dashboard"));
const ClientsScreen = lazy(() => import("./clients"));
const OrdersScreen = lazy(() => import("./orders"));
const OrderDetail = lazy(() => import("./orders/[id]"));
const SIPReportsScreen = lazy(() => import("./sip-reports"));
const AUMReportsScreen = lazy(() => import("./folio"));
const RTAReconciliationScreen = lazy(() => import("./rta-reconciliation"));
const RTAReconciliationDetail = lazy(() => import("./rta-reconciliation/[id]"));
const SIPReportsDetail = lazy(() => import("./sip-reports/[id]"));
const AUMDetail = lazy(() => import("./folio/[id]"));
// const ClientDetail = lazy(() => import("./clients/[id]/index"));
const HoldingDetail = lazy(() => import("./clients/[id]/holdings/[holdingId]"));
const MandatesScreen = lazy(() => import("./mandates"));
const MandateDetail = lazy(() => import("./mandates/[id]"));
const RTASync = lazy(() => import("./rta-sync"));
const AUMTabScreen = lazy(() => import("./aum-reports"));
const MutualFundDetail = lazy(() => import("./mutual-fund/[id]"));
const AumReconcile = lazy(() => import("./aum-reconcile"));
const SendInvite = lazy(() => import("./invite-contact"));
const AddIfaRm = lazy(() => import("./add-ifa-rm"));
const DistributorDashboardScreen = lazy(() => import("./dashboard/[id]"));
const IFAReportsScreen = lazy(() => import("./ifa"));
const ARNTabScreen = lazy(() => import("./arn-transfer"));
// const ClientARNDetail = lazy(() => import("./arn-transfer/[id]"));
const BrokerageScreen = lazy(() => import("./brokerage"));
const Calculators = lazy(() => import("./calculators"));
const Sip = lazy(() => import("./calculators/sip"));
const SIPDelay = lazy(() => import("./calculators/sip-delay"));
const RiskProfile = lazy(() => import("./calculators/risk-profile"));
const AssitantScreen = lazy(() => import("./ai-assitant"));
const MutualSipAnalyticsScreen = lazy(() => import("./analytics/mutual-sip"));
const AnalyticsScreen = lazy(() => import("./analytics"));
const LearningManagement = lazy(() => import("./learning-center"));
const ModuleLearningManagement = lazy(
    () => import("./learning-center/[id]/index")
);
const ChapterLearningCenter = lazy(
    () => import("./learning-center/[id]/[chapterId]/index")
);
import IonIcon from "react-native-vector-icons/Ionicons";
import DsaFormScreen from "./dsa-form";
import DsaRequestScreen from "./dsa-form/request";


const queryClient = new QueryClient();

export default function AppLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [[isLoading, token], setToken] = useStorageState("token");
    const { height, width } = useWindowDimensions();
    const [roleId, setroleID] = useState(null);
    const [inviteDisplay, setinviteDisplay] = useState("");
    const CoRoverURL =
        "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/";
    const ViewHeight = height * 0.6;
    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);
            setroleID(decoded.roleId);
            if (decoded.roleId === 3 || decoded.roleId === 4) {
                setinviteDisplay("none");
            }
        }
    }, [token]);

    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animatedStyle = {
        transform: [{ translateX: shakeAnimation }],
    };

    const handleClick = () => {
        if (!isOpen) {
            startShake();
            setShowLoader(true);
            setIsOpen(false);

            setTimeout(() => {
                setShowLoader(false);
                setIsOpen(true);
            }, 2000);
        } else {
            setIsOpen(false);
            setShowLoader(false);
        }
    };

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
                    initialParams={{}}
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
                        drawerLabel: "Distributor",
                        title: "Distributor",
                        unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={IFAReportsScreen}
                />
            ),
        });
    }

    return (
        <SafeAreaProvider style={{ backgroundColor: "white" }}>
            <QueryClientProvider client={queryClient}>
                <PaperProvider theme={PaperTheme}>
                    <UserRoleProvider>
                        <Suspense
                            fallback={
                                <Center>
                                    <Spinner
                                        color="black"
                                        accessibilityLabel="Loading"
                                    />
                                </Center>
                            }
                        >
                            <Drawer.Navigator
                                screenOptions={({ navigation }) => ({
                                    drawerActiveTintColor: "#000000",
                                    drawerStyle: {
                                        width: width < 830 ? "60%" : "15%",
                                    },
                                    drawerType:
                                        width <= 768 ? "back" : "permanent",
                                    header: (props) => (
                                        <TopHeader navigation={navigation} />
                                    ),
                                    headerLeft: (props) => (
                                        <View className="ml-4">
                                            <Icon
                                                size={18}
                                                name={"bars"}
                                                onPress={
                                                    navigation.toggleDrawer
                                                }
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
                                        {/* <Drawer.Screen
                                            name="rta-sync"
                                            options={{
                                                drawerLabel: "RTA Sync",
                                                title: "RTA Sync",
                                                unmountOnBlur: true,
                                            }}
                                            initialParams={{}}
                                            component={RTASync}
                                        /> */}
                                        {/* <Drawer.Screen
                                            name="aum-reconcile"
                                            component={AumReconcile}
                                            options={{
                                                drawerLabel: "AUM Reconcile",
                                                title: "AUM Reconcile",
                                                unmountOnBlur: true,
                                            }}
                                            initialParams={{}}
                                        /> */}
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
                                            component={
                                                DistributorDashboardScreen
                                            }
                                        />
                                    </>
                                )}
                                <Drawer.Screen
                                    name="invite-contact"
                                    options={{
                                        drawerLabel: "Invite Client",
                                        title: "Invite Client",
                                        drawerItemStyle: {
                                            display: inviteDisplay,
                                        },
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
                                {/* <Drawer.Screen
                                    name="arn-transfer/index"
                                    options={{
                                        drawerLabel: "Requests",
                                        title: "Requests",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={ARNTabScreen}
                                /> */}
                                <Drawer.Screen
                                    name="arn-transfer/[id]/index"
                                    options={{
                                        drawerLabel: "ClientArnDetail",
                                        title: "ClientArnDetail",
                                        drawerItemStyle: { display: "none" },
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={ClientARNDetail}
                                />
                                <Drawer.Screen
                                    name="calculators/index"
                                    options={{
                                        drawerLabel: "Calculators",
                                        title: "Calculators",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={Calculators}
                                />

                                <Drawer.Screen
                                    name="calculators/sip/index"
                                    options={{
                                        drawerLabel: "Calculators",
                                        title: "Calculators",
                                        unmountOnBlur: true,
                                        drawerItemStyle: { display: "none" },
                                    }}
                                    initialParams={{}}
                                    component={Sip}
                                />
                                <Drawer.Screen
                                    name="calculators/sip-delay/index"
                                    options={{
                                        drawerLabel: "Calculators",
                                        title: "Calculators",
                                        unmountOnBlur: true,
                                        drawerItemStyle: { display: "none" },
                                    }}
                                    initialParams={{}}
                                    component={SIPDelay}
                                />
                                <Drawer.Screen
                                    name="calculators/risk-profile/index"
                                    options={{
                                        drawerLabel: "Calculators",
                                        title: "Calculators",
                                        unmountOnBlur: true,
                                        drawerItemStyle: { display: "none" },
                                    }}
                                    initialParams={{}}
                                    component={RiskProfile}
                                />

                                <Drawer.Screen
                                    name="ai-assitant/index"
                                    options={{
                                        drawerLabel: "AI Assitant",
                                        title: "AI Assitant",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={AssitantScreen}
                                />
                                {/* <Drawer.Screen
                                    name="analytics/mutual-sip/index"
                                    options={{
                                        drawerLabel: "Analytics",
                                        title: "Analytics",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={MutualSipAnalyticsScreen}
                                /> */}
                                {/* <Drawer.Screen
                                    name="analytics/index"
                                    options={{
                                        drawerLabel: "Analytics",
                                        title: "Analytics",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={AnalyticsScreen}
                                /> */}
                                {/* <Drawer.Screen
                                    name="marketing/index"
                                    options={{
                                        drawerLabel: "Marketing",
                                        title: "Marketing",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={MarketingScreen}
                                /> */}

                                {/* <Drawer.Screen
                                    name="learning-center/index"
                                    options={{
                                        drawerLabel: "Learning Center",
                                        title: "Learning Center",
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={LearningManagement}
                                /> */}

                                <Drawer.Screen
                                    name="learning-center/[id]/index"
                                    options={{
                                        drawerLabel: "Module Learning Center",
                                        title: "Module Learning Center",
                                        drawerItemStyle: { display: "none" },
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={ModuleLearningManagement}
                                />

                                <Drawer.Screen
                                    name="learning-center/[id]/[chapterId]/index"
                                    options={{
                                        drawerLabel: "Chapter Learning Center",
                                        title: "Module Learning Center",
                                        drawerItemStyle: { display: "none" },
                                        unmountOnBlur: true,
                                    }}
                                    initialParams={{}}
                                    component={ChapterLearningCenter}
                                />
                                <Drawer.Screen
                                            name="dsa-form/index"
                                            options={{
                                                drawerLabel: "DSA form",
                                                title: "DSA form",
                                                drawerItemStyle: {
                                                    display: "none",
                                                },
                                                unmountOnBlur: true,
                                            }}
                                            initialParams={{}}
                                            component={
                                                DsaFormScreen
                                            }
                                        />

                                        <Drawer.Screen
                                            name="dsa-form/request/index"
                                            options={{
                                                drawerLabel: "DSA form",
                                                title: "DSA form",
                                                drawerItemStyle: {
                                                    display: "none",
                                                },
                                                unmountOnBlur: true,
                                            }}
                                            initialParams={{}}
                                            component={
                                                DsaRequestScreen
                                            }
                                        />

                            </Drawer.Navigator>
                            {/* <Fab
                                renderInPortal={false}
                                shadow={2}
                                size="sm"
                                onPress={() => setIsOpen(!isOpen)}
                                placement="bottom-right"
                                marginRight={30}
                                marginBottom={30}
                                icon={
                                    <Image
                                        source={require("../../assets/chatbot.png")}
                                    />
                                }
                            >
                                <PresenceTransition
                                    visible={isOpen}
                                    initial={{
                                        opacity: 0,
                                        scale: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 250,
                                        },
                                    }}
                                >
                                    <Center
                                        w="200"
                                        h="100"
                                        mt="7"
                                        bg="teal.500"
                                        rounded="md"
                                    >
                                        ScaleFade
                                    </Center>
                                </PresenceTransition>
                            </Fab> */}
                            <View
                                style={{
                                    position: "absolute",
                                    right: 20,
                                    bottom: 60,
                                }}
                            >
                                <Pressable onPress={handleClick}>
                                    <Animated.View style={[animatedStyle]}>
                                        <Image
                                            height={100}
                                            width={100}
                                            source={require("../../assets/chatbot.png")}
                                        />
                                    </Animated.View>
                                </Pressable>
                            </View>
                            {(isOpen || showLoader) && (
                                <View
                                    style={{
                                        position: "absolute",
                                        right: "2%",
                                        bottom: "21%",
                                    }}
                                >
                                    <PresenceTransition
                                        visible={isOpen || showLoader}
                                        initial={{
                                            opacity: 0,
                                            scale: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            transition: {
                                                duration: 250,
                                            },
                                        }}
                                    >
                                        <View>
                                            {Platform.OS === "web" ? (
                                                <View>
                                                    <Pressable
                                                        onPress={() => {
                                                            setIsOpen(false);
                                                            setShowLoader(
                                                                false
                                                            );
                                                        }}
                                                        className="flex flex-row items-center"
                                                    >
                                                        <Text>Close</Text>
                                                        <IonIcon
                                                            name="close-outline"
                                                            size={20}
                                                            color="black"
                                                        />
                                                    </Pressable>
                                                    <iframe
                                                        src={CoRoverURL}
                                                        style={{
                                                            width: width * 0.23,
                                                            height: ViewHeight,
                                                        }}
                                                        title="Embedded Web Content"
                                                    />
                                                </View>
                                            ) : (
                                                <Center
                                                    style={{
                                                        backgroundColor:
                                                            "white",
                                                        width: width * 0.23,
                                                        height: ViewHeight,
                                                    }}
                                                >
                                                    <Spinner
                                                        color={"blue"}
                                                        accessibilityLabel="Loading.."
                                                    />
                                                </Center>
                                            )}
                                        </View>
                                    </PresenceTransition>
                                </View>
                            )}
                        </Suspense>
                    </UserRoleProvider>
                </PaperProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
