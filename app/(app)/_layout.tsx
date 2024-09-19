import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, Redirect, Stack } from "expo-router";
import {
    Animated,
    Dimensions,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
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
import {
    UserRoleProvider,
    useUserRole,
} from "../../src/context/useRoleContext";
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
// const AddIfaRm = lazy(() => import("./add-ifa-rm"));
// const AddRm = lazy(() => import("./add-rm"));
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
import TrainingArnExamScreen from "./dsa-form/training-arn-exam";
import DsaRequestScreen from "./dsa-form/request";
import SipCancelUpload from "./operations/sip-cancel-upload";
import AddManagementUserForm from "./add-user/management";
import AddDistributorUserForm from "./add-user/distributor";
import { UserMeData } from "src/interfaces/DsaFormApproveInterface";
import RemoteApi from "src/services/RemoteApi";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
    <Center>
        <HStack space={2} justifyContent="center">
            <Spinner color={"black"} accessibilityLabel="Loading" />
            <Heading color="black" fontSize="md">
                Loading
            </Heading>
        </HStack>
    </Center>
);

const getUserDetail = async () => {
    try {
        const response: UserMeData = await RemoteApi.get("user/me");
        console.log("useEffectlayouttoken" + "userme");
        // const response = {
        //     code: 200,
        //     message: "Success",
        //     data: {
        //         name: "Saffiulla",
        //         email: "sm@gmail.com",
        //         mobileNumber: "9778686786",
        //         isOnBoarded: false,
        //         dsaCode: "null",
        //         arn: "ARN",
        //     },
        // };

        if (response.code === 200) {
            const userData = response.data;
            return userData;
        } else {
            alert("Failed to fetch user details");
        }
    } catch (error) {
        alert("An error occurred while fetching the user details");
    }
    return null;
};

export default function AppLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [[isLoading, token], setToken] = useStorageState("token");
    const { height, width } = useWindowDimensions();
    // const [roleId, setRoleId] = useState(null);
    const [inviteDisplay, setinviteDisplay] = useState("");
    const CoRoverURL =
        "https://builder.corover.ai/params/?appid=f525521d-c54f-4723-8d41-592f5497b460&partnerKey=c65ed7c2-a07f-4a46-a161-3ed104d7ab57&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5FUCIsImNvbXBhbnlOYW1lIjoiQ29Sb3ZlciIsImVtYWlsSWQiOiJuZXAuc3VwcG9ydEBjb3JvdmVyLmFpIiwiaWF0IjoxNzE1MTcwMDcyLCJleHAiOjE3MTUyNTY0NzJ9.KSBawWk-TC0ykqBMZOY4mIuQjm-xHeSGmkLfnd5cYnE#/";
    const ViewHeight = height * 0.6;
    // const [renderDsaForm, setRenderDsaForm] = useState(false);
    // const [userDetails, setUserDetails] = useState(null);
    const [dsaForm, setDsaForm] = useState({
        userDetails: null,
        renderDsaForm: false,
    });

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

    useEffect(() => {
        const fetchUserDetail = async () => {
            const decoded: any = jwtDecode(token);
            console.log(decoded.roleId);

            const roleId = decoded.roleId;
            if (roleId == 2) {
                const userData = await getUserDetail();
                console.log("userData" + JSON.stringify(userData));
                if (userData != null) {
                    setDsaForm((prevState) => ({
                        ...prevState,
                        userDetails: userData,
                        renderDsaForm: true,
                    }));

                    console.log(dsaForm.renderDsaForm + dsaForm.userDetails);
                }
            }
        };

        if (token) {
            console.log("useEffectlayouttoken" + token);
            fetchUserDetail();
        }
    }, [token]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!token) {
        return <Redirect href="/sign-in" />;
    }

    const getRoleID = () => {
        const decoded: any = jwtDecode(token);
        console.log(decoded.roleId);
        return decoded.roleId;
    };

    const roleId = getRoleID();

    const Drawer = createDrawerNavigator();
    const drawerStructure = [];
    console.log(token);
    console.log(roleId);
    console.log(drawerStructure);

    // RoldeID == 2, is for Distributor.
    if (roleId == 2) {
        drawerStructure.push({
            key: "DsaOnboarding",
            content: (
                <Drawer.Screen
                    name="dsa-form/index"
                    options={{
                        drawerLabel: "DSA Onboarding",
                        title: "DSA Onboarding",
                        // drawerItemStyle: {
                        //     display: "none",
                        // },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={DsaFormScreen}
                />
            ),
        });
        // drawerStructure.push({
        //     key: "marketing",
        //     content: (
        //         <Drawer.Screen
        //             name="marketing/index"
        //             options={{
        //                 drawerLabel: "Marketing",
        //                 title: "Marketing",
        //                 unmountOnBlur: true,
        //             }}
        //             initialParams={{}}
        //             component={MarketingScreen}
        //         />
        //     ),
        // });
        drawerStructure.push({
            key: "invite-contact",
            content: (
                <Drawer.Screen
                    name="invite-contact"
                    options={{
                        drawerLabel: "Invite Client",
                        title: "Invite Client",
                        drawerItemStyle: {
                            display: inviteDisplay,
                        },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={SendInvite}
                />
            ),
        });
        drawerStructure.push({
            key: "ModuleLearningCenter",
            content: (
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
            ),
        });

        drawerStructure.push({
            key: "ChapterLearningCenter",
            content: (
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
            ),
        });
    }

    // RoldeID == 3, is for junior manager.
    // RoldeID == 4, is for Senior manager.
    if (roleId >= 2 && roleId <= 4) {
        drawerStructure.push({
            key: "Dashboard",
            content: (
                <Drawer.Screen
                    name="dashboard/index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: "Dashboard",
                        title: "Dashboard",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={DashboardIFA}
                />
            ),
        });
        drawerStructure.push({
            key: "IFADashboard",
            content: (
                <Drawer.Screen
                    name="dashboard/[id]"
                    options={{
                        drawerLabel: "IFA Dashboard",
                        title: "IFA Dashboard",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={DistributorDashboardScreen}
                />
            ),
        });

        drawerStructure.push({
            key: "clientName",
            content: (
                <Drawer.Screen
                    name="clients/index"
                    options={{
                        drawerLabel: "Clients",
                        title: "Clients",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={ClientsScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "AUM",
            content: (
                <Drawer.Screen
                    name="aum-reports/index"
                    options={{
                        drawerLabel: "AUM",
                        title: "AUM",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={AUMTabScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "sipReports",
            content: (
                <Drawer.Screen
                    name="sip-reports/index"
                    options={{
                        drawerLabel: "SIP Reports",
                        title: "SIP Reports",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={SIPReportsScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "mandatesReports",
            content: (
                <Drawer.Screen
                    name="mandates/index"
                    options={{
                        drawerLabel: "Mandates",
                        title: "Mandates",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={MandatesScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "TransactionsReports",
            content: (
                <Drawer.Screen
                    name="rta-reconciliation/index"
                    options={{
                        drawerLabel: "Transactions",
                        title: "Transactions",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={RTAReconciliationScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "MandateDetail",
            content: (
                <Drawer.Screen
                    name="mandates/[id]"
                    options={{
                        drawerLabel: "MandateDetail",
                        title: "MandateDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={MandateDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "OrderDetail",
            content: (
                <Drawer.Screen
                    name="orders/[id]"
                    options={{
                        drawerLabel: "OrderDetail",
                        title: "OrderDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={OrderDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "HoldingDetail",
            content: (
                <Drawer.Screen
                    name="clients/[id]/holdings/[holdingId]"
                    options={{
                        drawerLabel: "HoldingDetail",
                        title: "HoldingDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={HoldingDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "ClientDetail",
            content: (
                <Drawer.Screen
                    name="clients/[id]/index"
                    options={{
                        drawerLabel: "ClientDetail",
                        title: "ClientDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={ClientDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "SipReportsDetail",
            content: (
                <Drawer.Screen
                    name="sip-reports/[id]"
                    options={{
                        drawerLabel: "SipReportsDetail",
                        title: "SipReportsDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={SIPReportsDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "FolioDetail",
            content: (
                <Drawer.Screen
                    name="folio/[id]"
                    options={{
                        drawerLabel: "FolioDetail",
                        title: "FolioDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={AUMDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "RTAReconciliationDetail",
            content: (
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
            ),
        });
        drawerStructure.push({
            key: "Brokerage",
            content: (
                <Drawer.Screen
                    name="brokerage/index"
                    options={{
                        drawerLabel: "Brokerage",
                        title: "Brokerage",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={BrokerageScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "mutualfunddetail",
            content: (
                <Drawer.Screen
                    name="mutual-fund/[id]"
                    options={{
                        drawerLabel: "mutualfunddetail",
                        title: "mutualfunddetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={MutualFundDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "Calculators",
            content: (
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
            ),
        });
        drawerStructure.push({
            key: "calculators-sip",
            content: (
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
            ),
        });
        drawerStructure.push({
            key: "calculators-sip-delay",
            content: (
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
            ),
        });
        drawerStructure.push({
            key: "calculators-risk-profile",
            content: (
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
            ),
        });
        drawerStructure.push({
            key: "ClientArnDetail",
            content: (
                <Drawer.Screen
                    name="arn-transfer/[id]/index"
                    options={{
                        drawerLabel: "ClientArnDetail",
                        title: "ClientArnDetail",
                        drawerItemStyle: { display: "none" },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={ClientARNDetail}
                />
            ),
        });
        drawerStructure.push({
            key: "ClientArnDetail",
            content: (
                <Drawer.Screen
                    name="ifa/[id]"
                    options={{
                        drawerLabel: "IFADetail",
                        title: "IFADetail",
                        drawerItemStyle: {
                            display: "none",
                        },
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={DistributorDashboardScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "learning-center-index",
            content: (
                <Drawer.Screen
                    name="learning-center/index"
                    options={{
                        drawerLabel: "Learning Center",
                        title: "Learning Center",
                        unmountOnBlur: true,
                        drawerItemStyle: {
                            display: "none",
                        },
                    }}
                    initialParams={{}}
                    component={LearningManagement}
                />
            ),
        });
        drawerStructure.push({
            key: "arn-transfer-index",
            content: (
                <Drawer.Screen
                    name="arn-transfer/index"
                    options={{
                        drawerLabel: "Requests",
                        title: "Requests",
                        // unmountOnBlur: true,
                        drawerItemStyle: {
                            display: "none",
                        },
                    }}
                    initialParams={{}}
                    component={ARNTabScreen}
                />
            ),
        });
        drawerStructure.push({
            key: "ai-assitant-index",
            content: (
                <Drawer.Screen
                    name="ai-assitant/index"
                    options={{
                        drawerLabel: "AI Assitant",
                        title: "AI Assitant",
                        // unmountOnBlur: true,
                        drawerItemStyle: {
                            display: "none",
                        },
                    }}
                    initialParams={{}}
                    component={AssitantScreen}
                />
            ),
        });
    }
    if (roleId == 3 || roleId == 4) {
        drawerStructure.push({
            key: "AddDistributorUserForm",
            content: (
                <>
                    <Drawer.Screen
                        name="add-user/distributor/index"
                        options={{
                            drawerLabel: "Add Distributor",
                            title: "AddDistributorUserForm",
                            // unmountOnBlur: true,
                            // drawerItemStyle: { display: "none" },
                        }}
                        initialParams={{}}
                        component={AddDistributorUserForm}
                    />
                </>
            ),
        });
    }

    if (roleId == 4) {
        drawerStructure.splice(1, 0, {
            key: "distributor",
            content: (
                <Drawer.Screen
                    name="ifa/index"
                    options={{
                        drawerLabel: "Distributor",
                        title: "Distributor",
                        // unmountOnBlur: true,
                    }}
                    initialParams={{}}
                    component={IFAReportsScreen}
                />
            ),
        });

        drawerStructure.push({
            key: "Analytics",
            content: (
                <>
                    <Drawer.Screen
                        name="analytics/index"
                        options={{
                            drawerLabel: "Analytics",
                            title: "Analytics",
                            // drawerItemStyle: {
                            //     display: "none",
                            // },
                            // unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={AnalyticsScreen}
                    />
                </>
            ),
        });
        drawerStructure.push({
            key: "addManagementUser",
            content: (
                <>
                    <Drawer.Screen
                        name="add-user/management/index"
                        options={{
                            drawerLabel: "Add Management User",
                            title: "addManagementUser",
                            // unmountOnBlur: true,
                            // drawerItemStyle: { display: "none" },
                        }}
                        initialParams={{}}
                        component={AddManagementUserForm}
                    />
                </>
            ),
        });
    }

    // RoldeID == 5, is for operaton
    if (roleId == 5) {
        drawerStructure.push({
            key: "AddDistributorUserForm",
            content: (
                <>
                    <Drawer.Screen
                        name="dsa-form/request/index"
                        options={{
                            drawerLabel: "DSA Onboard Request",
                            title: "DSA Onboard Request",
                            // drawerItemStyle: {
                            //     display: "none",
                            // },
                            // unmountOnBlur: true,
                        }}
                        initialParams={{}}
                        component={DsaRequestScreen}
                    />
                </>
            ),
        });

        drawerStructure.push({
            key: "rta-sync",
            content: (
                <Drawer.Screen
                    name="rta-sync"
                    options={{
                        drawerLabel: "RTA Sync",
                        title: "RTA Sync",
                        // unmountOnBlur: true,
                        // drawerItemStyle: {
                        //     display: "none",
                        // },
                    }}
                    initialParams={{}}
                    component={RTASync}
                />
            ),
        });
        drawerStructure.push({
            key: "aum-reconcile",
            content: (
                <Drawer.Screen
                    name="aum-reconcile"
                    component={AumReconcile}
                    options={{
                        drawerLabel: "AUM Reconcile",
                        title: "AUM Reconcile",
                        // unmountOnBlur: true,
                        // drawerItemStyle: {
                        //     display: "none",
                        // },
                    }}
                    initialParams={{}}
                />
            ),
        });
        drawerStructure.push({
            key: "sipCancelUpload",
            content: (
                <>
                    <Drawer.Screen
                        name="operations/sip-cancel-upload/index"
                        options={{
                            drawerLabel: "Cancelled SIP Upload",
                            title: "sipCancelUpload",
                            // unmountOnBlur: true,
                            // drawerItemStyle: { display: "none" },
                        }}
                        initialParams={{}}
                        component={SipCancelUpload}
                    />
                </>
            ),
        });
    }

    console.log("renderDsaForm" + dsaForm.renderDsaForm);
    console.log("userDetails" + JSON.stringify(dsaForm.userDetails));
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
                            {roleId === 2 &&
                            (!dsaForm?.userDetails?.arn ||
                                !dsaForm?.userDetails?.isOnBoarded) ? (
                                !dsaForm?.userDetails?.isOnBoarded ? (
                                    <>
                                        <TopHeader
                                            navigation={""}
                                            logo={true}
                                        />
                                        <DsaFormScreen />
                                    </>
                                ) : (
                                    <>
                                        <TopHeader
                                            navigation={""}
                                            logo={true}
                                        />
                                        <TrainingArnExamScreen />
                                    </>
                                )
                            ) : (
                                <Drawer.Navigator
                                    screenOptions={({ navigation }) => ({
                                        drawerActiveTintColor: "#000000",
                                        drawerStyle: {
                                            width: width < 830 ? "60%" : "15%",
                                        },
                                        drawerType:
                                            width <= 768 ? "back" : "permanent",
                                        header: (props) => (
                                            <TopHeader
                                                navigation={navigation}
                                            />
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
                                    {drawerStructure.map(
                                        (item) => item.content
                                    )}
                                </Drawer.Navigator>
                            )}
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
                            {/* {CoRover Code Starts Here} */}
                            {/* <View
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
                            </View> */}
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
