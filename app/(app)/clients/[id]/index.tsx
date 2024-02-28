import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
    Button,
    Center,
    CheckCircleIcon,
    HStack,
    Heading,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    WarningIcon,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";

import RemoteApi from "../../../../src/services/RemoteApi";
import {
    ClientDetailItem,
    ClientDetailResponse,
} from "../../../../src/interfaces/ClientDetailInterface";
import { BreadcrumbShadow } from "../../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../../src/helper/helper";
import CardWithTabs from "../../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../../src/components/Accordion/Accordion";
import DataTable from "../../../../src/components/DataTable/DataTable";
import Modal from "../../../../src/components/Modal/Modal";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DropdownComponent from "../../../../src/components/Dropdowns/DropDown";
import RadioButton from "../../../../src/components/Radio/Radio";
import DataValue from "../../../../src/components/DataValue/DataValue";

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailItem>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: ClientDetailResponse = await RemoteApi.get(
                `client/${id}`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            }
        }

        if (id) {
            getDetails();
        }
    }, [id]);

    return (
        <>
            {isLoading ? (
                <Center>
                    <HStack
                        space={2}
                        marginTop={20}
                        marginBottom={20}
                        justifyContent="center"
                    >
                        <Spinner
                            color={"black"}
                            accessibilityLabel="Loading order"
                        />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            ) : (
                <ScrollView
                    className={`bg-white`}
                    showsVerticalScrollIndicator={true}
                >
                    <View className="bg-white">
                        <View className="flex flex-col p-4 gap-4">
                            <View className="flex flex-row items-center">
                                <Pressable
                                    className="mr-3"
                                    onPress={() =>
                                        console.log("This will go back ")
                                    }
                                >
                                    <Icon
                                        name="angle-left"
                                        size={18}
                                        color={"black"}
                                    />
                                </Pressable>
                                <Text
                                    selectable
                                    className="text-base flex flex-row text-center font-bold"
                                >
                                    Clients Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded bg-[#eaf3fe] h-auto p-4"
                                style={{ ...BreadcrumbShadow }}
                            >
                                <View className="flex flex-col gap-6 w-full">
                                    <View className="flex flex-row w-full justify-between items-center">
                                        <View className="flex flex-row gap-2 items-center">
                                            <Text
                                                selectable
                                                className="text-lg flex flex-row text-center font-semibold"
                                            >
                                                {data?.name}
                                            </Text>
                                            {data?.isActive ? (
                                                <CheckCircleIcon
                                                    color="emerald.500"
                                                    size="md"
                                                />
                                            ) : (
                                                <WarningIcon
                                                    size="md"
                                                    color="orange.500"
                                                />
                                            )}
                                        </View>
                                        <View>
                                            <Button
                                                width="48"
                                                bgColor={"#013974"}
                                                onPress={() =>
                                                    console.log("Press Invest")
                                                }
                                            >
                                                Invest
                                            </Button>
                                        </View>
                                    </View>
                                    <View className="flex flex-row justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="pan"
                                                title="Pan No."
                                                value={
                                                    data?.users[0]?.panNumber
                                                }
                                            />
                                            <DataValue
                                                key="clientCode"
                                                title="Client Code"
                                                value={data?.clientId}
                                            />
                                            <DataValue
                                                key="dob"
                                                title="DOB"
                                                value={"Jul 26, 2023"}
                                            />
                                            <DataValue
                                                key="doi"
                                                title="DOI"
                                                value={"Jul 26, 2023"}
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="totalInvestment"
                                                title="Total Investment"
                                                value={"57,000"}
                                            />
                                            <DataValue
                                                key="runningSip"
                                                title="Running SIPs"
                                                value={"2"}
                                            />
                                            <DataValue
                                                key="lastInvestment"
                                                title="Last Investment"
                                                value="Lumpsum: 6,700"
                                            />
                                            <DataValue
                                                key="lastInvestmentDate"
                                                title="Last Investment Date"
                                                value="Jul 26, 2023, 1:38 PM"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="autopay"
                                                title="Autopay"
                                                value={
                                                    data?.isActive
                                                        ? "Active"
                                                        : "Not Active"
                                                }
                                            />
                                            <DataValue
                                                key="kycStatus"
                                                title="KYC Status"
                                                value={
                                                    data?.users[0]?.kycStatus
                                                        ?.name
                                                }
                                            />
                                            <DataValue
                                                key="riskProfile"
                                                title="Risk Profile"
                                                value={"-"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-[60%] h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard data={data} />
                                </View>
                                <View
                                    className="w-[39%] h-128 rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <AccountDetailsCard data={data} />
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-[60%] h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <MutualFundCard data={data} />
                                </View>
                                <View
                                    className="w-[39%] h-128 rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <TopAMCCard data={data} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const PortfolioCard = ({ data }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const assetBifurcation = [
        { label: "Equity", value: 20 },
        { label: "Hybrid", value: 20 },
        { label: "Debt", value: 20 },
        { label: "Others", value: 40 },
    ];

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    const [visible, setVisible] = useState(false);
    const [modalKey, setModalKey] = useState("invest");

    const closeModal = () => {
        setVisible(false);
        setModalKey("");
    };

    const modalValues = {
        invest: <InvestModalCard hideDialog={closeModal} />,
        redeem: <RedeemModalCard hideDialog={closeModal} />,
    };

    const showModal = (key: string) => () => {
        setModalKey(key);
        setVisible(true);
    };

    const tabContent = [
        {
            key: "holdings",
            name: "Holdings",
            content: (
                <View className="p-2 overflow-auto">
                    <View className="flex flex-col bg-gray-100 rounded p-2 mb-2">
                        <View className="flex flex-row justify-between items-center p-2">
                            <DataGrid
                                key="current"
                                title="Current Holdings"
                                value={
                                    <Text className="text-blue-700">
                                        {RupeeSymbol} 37,000
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="invested"
                                title="Invested"
                                value={
                                    <Text className="text-blue-700">
                                        {RupeeSymbol} 24,67,000
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="xirr"
                                title="XIRR"
                                value={<Text className="">21.66 %</Text>}
                                reverse
                            />
                            <DataGrid
                                key="totalReturns"
                                title="Total Returns"
                                value={
                                    <Text className="text-green-700">
                                        34.22 %
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="p-2">
                            <HorizontalStackedBarChart
                                data={assetBifurcation}
                                colors={assetBifurcationColors}
                            />
                        </View>
                    </View>
                    <DataTable
                        key="sips"
                        headers={["Scheme", "Current", "Invested", "XIRR"]}
                        cellSize={[5, 3, 2, 2]}
                        rows={[
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                25.7% (24.8%)
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                25.7% (24.8%)
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                25.7% (24.8%)
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                        ]}
                        hasActions
                        options={[
                            {
                                key: "invest",
                                name: "Invest",
                                onClick: showModal("invest"),
                            },
                            {
                                key: "redeem",
                                name: "Redeem",
                                onClick: showModal("redeem"),
                            },
                        ]}
                    />
                    <Modal visible={visible} hideDialog={closeModal}>
                        {modalValues[modalKey]}
                    </Modal>
                </View>
            ),
        },
        {
            key: "sips",
            name: "SIPs",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <View className="w-full px-4 py-4 mb-2 bg-[#eaf3fe] flex flex-row items-center justify-between rounded">
                        <Text className="font-bold">Total SIP Amount</Text>
                        <Text className="font-bold">{RupeeSymbol} 57,000</Text>
                    </View>
                    <DataTable
                        key="sips"
                        headers={["Schemes", "SIP Amount", "Next Due"]}
                        cellSize={[6, 3, 3]}
                        rows={[
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "sip",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "nextDue",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Mar 4, 2024
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "sip",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "nextDue",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Mar 4, 2024
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "sip",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "nextDue",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Mar 4, 2024
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                        ]}
                    />
                </View>
            ),
        },
        {
            key: "transactions",
            name: "Transactions",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <DataTable
                        key="sips"
                        headers={["Schemes", "Amount", "Date", "Status"]}
                        cellSize={[5, 3, 2, 2]}
                        rows={[
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                23/09/2024
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Success
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                23/09/2024
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Success
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                            [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Kotak Bank Mid Cap Fund
                                                    Direct Growth
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    Equity | Multi Cap
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} 7,388
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                23/09/2024
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                Success
                                            </Text>
                                        </View>
                                    ),
                                },
                            ],
                        ]}
                    />
                </View>
            ),
        },
    ];

    return (
        <View className="overflow-auto">
            <CardWithTabs
                key="portfolio"
                selectedTab={selectedTab}
                handleTabPress={handleTabPress}
                tabContent={tabContent}
                tabsCount={3}
            />
        </View>
    );
};

const InvestModalCard = ({ hideDialog }) => {
    const [cardNumber, setCardNumber] = useState(1);
    const [selectedFund, setSelectedFund] = useState(); // This is to save fund context to render in the next modal info

    const selectFund = (data: any) => {
        setSelectedFund(data);
        setCardNumber(2);
    };

    const deselectFund = () => {
        setSelectedFund(null);
        setCardNumber(1);
    };

    const tabContentForInvest = [
        {
            key: "lumpsum",
            name: "Lumpsum",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number*
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={[
                                { label: "1", value: "1" },
                                { label: "2", value: "2" },
                                { label: "3", value: "3" },
                                { label: "4", value: "4" },
                                { label: "5", value: "5" },
                                { label: "6", value: "6" },
                                { label: "7", value: "7" },
                                { label: "8", value: "8" },
                                { label: "9", value: "9" },
                                { label: "10", value: "10" },
                                { label: "11", value: "11" },
                                { label: "12", value: "12" },
                                { label: "13", value: "13" },
                                { label: "14", value: "14" },
                                { label: "15", value: "15" },
                                { label: "16", value: "16" },
                                { label: "17", value: "17" },
                                { label: "18", value: "18" },
                                { label: "19", value: "19" },
                                { label: "20", value: "20" },
                                { label: "21", value: "21" },
                                { label: "22", value: "22" },
                                { label: "23", value: "23" },
                                { label: "24", value: "24" },
                                { label: "25", value: "25" },
                                { label: "26", value: "26" },
                                { label: "27", value: "27" },
                                { label: "28", value: "28" },
                            ]}
                            containerStyle={{ width: "100%" }}
                            noIcon
                        />
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Investment Amount*
                        </Text>
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            keyboardType="number-pad"
                            placeholder="Investment Amount"
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                            In multiples of {RupeeSymbol}1000
                        </Text>
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
        {
            key: "SIP",
            name: "SIP",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number*
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={[
                                { label: "1", value: "1" },
                                { label: "2", value: "2" },
                                { label: "3", value: "3" },
                                { label: "4", value: "4" },
                                { label: "5", value: "5" },
                                { label: "6", value: "6" },
                                { label: "7", value: "7" },
                                { label: "8", value: "8" },
                                { label: "9", value: "9" },
                                { label: "10", value: "10" },
                                { label: "11", value: "11" },
                                { label: "12", value: "12" },
                                { label: "13", value: "13" },
                                { label: "14", value: "14" },
                                { label: "15", value: "15" },
                                { label: "16", value: "16" },
                                { label: "17", value: "17" },
                                { label: "18", value: "18" },
                                { label: "19", value: "19" },
                                { label: "20", value: "20" },
                                { label: "21", value: "21" },
                                { label: "22", value: "22" },
                                { label: "23", value: "23" },
                                { label: "24", value: "24" },
                                { label: "25", value: "25" },
                                { label: "26", value: "26" },
                                { label: "27", value: "27" },
                                { label: "28", value: "28" },
                            ]}
                            containerStyle={{ width: "100%" }}
                            noIcon
                        />
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Investment Amount*
                        </Text>
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            keyboardType="number-pad"
                            placeholder="Investment Amount"
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                            In multiples of {RupeeSymbol}1000
                        </Text>
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <View className="w-full flex flex-row items-center justify-start gap-x-2">
                            <Text className="text-xs mr-2">SIP Date</Text>
                            <DropdownComponent
                                label="Date"
                                data={[
                                    { label: "1", value: "1" },
                                    { label: "2", value: "2" },
                                    { label: "3", value: "3" },
                                    { label: "4", value: "4" },
                                    { label: "5", value: "5" },
                                    { label: "6", value: "6" },
                                    { label: "7", value: "7" },
                                    { label: "8", value: "8" },
                                    { label: "9", value: "9" },
                                    { label: "10", value: "10" },
                                    { label: "11", value: "11" },
                                    { label: "12", value: "12" },
                                    { label: "13", value: "13" },
                                    { label: "14", value: "14" },
                                    { label: "15", value: "15" },
                                    { label: "16", value: "16" },
                                    { label: "17", value: "17" },
                                    { label: "18", value: "18" },
                                    { label: "19", value: "19" },
                                    { label: "20", value: "20" },
                                    { label: "21", value: "21" },
                                    { label: "22", value: "22" },
                                    { label: "23", value: "23" },
                                    { label: "24", value: "24" },
                                    { label: "25", value: "25" },
                                    { label: "26", value: "26" },
                                    { label: "27", value: "27" },
                                    { label: "28", value: "28" },
                                ]}
                                noIcon
                            />
                            <Text className="text-xs ml-2">of every month</Text>
                        </View>
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
    ];

    const renderInfo = {
        1: {
            title: "Please Select Mutual Fund",
            content: <InvestModalSearch selectFund={selectFund} />,
        },
        2: {
            title: "Investing In",
            content: (
                <InvestModalAction
                    deselectFund={deselectFund}
                    tabContent={tabContentForInvest}
                />
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {cardNumber > 1 && (
                        <IonIcon
                            name="chevron-back-outline"
                            size={24}
                            onPress={deselectFund}
                        />
                    )}
                    <Text className="text-xl font-medium center">
                        {renderInfo[cardNumber].title}
                    </Text>
                </View>
                <IonIcon name="close-outline" size={24} onPress={hideDialog} />
            </View>
            {renderInfo[cardNumber].content}
        </View>
    );
};

const InvestModalSearch = ({ selectFund }) => {
    return (
        <View className="p-2 px-8">
            <Pressable
                onPress={() => console.log("first")}
                className="flex flex-row justify-start items-center w-full p-4 bg-[#E8F1FF] rounded-full"
            >
                <TextInput
                    className="outline-none w-[100%]"
                    placeholder="Search for Mutual Funds"
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"rgb(100, 116, 139)"}
                    cursorColor={"transparent"}
                    style={{ outline: "none" }}
                />
            </Pressable>
            <View className="">
                <DataTable
                    key="searchMutualFund"
                    headers={[]}
                    cellSize={[10, 2]}
                    rows={[
                        [
                            {
                                key: "name",
                                content: (
                                    <View className="flex flex-row items-center gap-2">
                                        <View className="w-8 h-8 rounded bg-gray-500" />
                                        <View>
                                            <Text className="text-xs">
                                                Kotak Bank Mid Cap Fund Direct
                                                Growth
                                            </Text>
                                            <Text className="text-xs text-gray-400">
                                                Equity Multi Cap
                                            </Text>
                                        </View>
                                    </View>
                                ),
                            },
                            {
                                key: "return",
                                content: (
                                    <View className="flex flex-col w-full items-center py-2 rounded-full">
                                        <Button
                                            width="100%"
                                            bgColor={"#013974"}
                                            onPress={() => selectFund("any")}
                                            className="rounded-full"
                                        >
                                            Invest
                                        </Button>
                                    </View>
                                ),
                            },
                        ],
                        [
                            {
                                key: "name",
                                content: (
                                    <View className="flex flex-row items-center gap-2">
                                        <View className="w-8 h-8 rounded bg-gray-500" />
                                        <View>
                                            <Text className="text-xs">
                                                Kotak Bank Mid Cap Fund Regular
                                            </Text>
                                            <Text className="text-xs text-gray-400">
                                                Equity Multi Cap
                                            </Text>
                                        </View>
                                    </View>
                                ),
                            },
                            {
                                key: "return",
                                content: (
                                    <View className="flex flex-col w-full items-center py-2 rounded-full">
                                        <Button
                                            width="100%"
                                            bgColor={"#013974"}
                                            onPress={() => selectFund("any")}
                                            className="rounded-full"
                                        >
                                            Invest
                                        </Button>
                                    </View>
                                ),
                            },
                        ],
                        [
                            {
                                key: "name",
                                content: (
                                    <View className="flex flex-row items-center gap-2">
                                        <View className="w-8 h-8 rounded bg-gray-500" />
                                        <View>
                                            <Text className="text-xs">
                                                Kotak Bank Mid Cap Fund Direct
                                                Growth
                                            </Text>
                                            <Text className="text-xs text-gray-400">
                                                Equity Multi Cap
                                            </Text>
                                        </View>
                                    </View>
                                ),
                            },
                            {
                                key: "return",
                                content: (
                                    <View className="flex flex-col w-full items-center py-2 rounded-full">
                                        <Button
                                            width="100%"
                                            bgColor={"#013974"}
                                            onPress={() => selectFund("any")}
                                            className="rounded-full"
                                        >
                                            Invest
                                        </Button>
                                    </View>
                                ),
                            },
                        ],
                    ]}
                />
            </View>
        </View>
    );
};

const InvestModalAction = ({ deselectFund, tabContent }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <View className="flex flex-col">
            <View className="flex flex-row items-center justify-between py-4 px-12">
                <View className="flex flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded bg-gray-500" />
                    <View>
                        <Text className="text-xs">
                            Kotak Bank Mid Cap Fund Direct Growth
                        </Text>
                        <Text className="text-xs text-gray-400">
                            Equity Multi Cap
                        </Text>
                    </View>
                </View>
                <Button
                    width="10%"
                    bgColor="gray.400"
                    onPress={deselectFund}
                    className="rounded-full"
                >
                    Change
                </Button>
            </View>
            <View className="flex-1 w-full bg-white rounded h-full overflow-auto">
                <View className="py-4">
                    <View className="w-full flex flex-row mb-2 border-b border-gray-400">
                        {tabContent?.map((tab, index) => {
                            return (
                                <View
                                    className={`w-1/${
                                        tabContent && tabContent.length
                                    } border-b-2 ${
                                        selectedTab === index + 1 &&
                                        tabContent &&
                                        tabContent.length > 1
                                            ? "border-black"
                                            : "border-transparent"
                                    }`}
                                >
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() =>
                                            handleTabPress(index + 1)
                                        }
                                        className={`w-full flex flex-row justify-center items-center p-2`}
                                    >
                                        <Text
                                            className={`font-bold ${
                                                selectedTab === index + 1
                                                    ? "text-gray-800"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {tab?.name}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                    {tabContent && tabContent[selectedTab - 1]?.content}
                </View>
            </View>
        </View>
    );
};

const RedeemModalCard = ({ hideDialog }) => {
    const [cardNumber, setCardNumber] = useState(1);
    const [selectedFund, setSelectedFund] = useState(); // This is to save fund context to render in the next modal info
    const [methodSelect, setMethodSelect] = useState("Enter Amount");

    const selectFund = (data: any) => {
        setSelectedFund(data);
        setCardNumber(2);
    };

    const deselectFund = () => {
        setSelectedFund(null);
        setCardNumber(1);
    };

    const tabContentForRedeem = [
        {
            key: "redeem",
            name: "",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-2/3 flex flex-col items-center gap-y-2">
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="totalAmount"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Amount
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        {RupeeSymbol} 50,000.00
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="redeemableAmount"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Redeemable Amount
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        {RupeeSymbol}23,000.50
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="totalUnits"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Units
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        46
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="totalRedeemableUnits"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Redeemable Units
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        21
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="applicableNavDate"
                                title={
                                    <Text selectable className="text-xs">
                                        Applicable NAV Date
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        Feb 26, 2024
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="expectedCompletionDate"
                                title={
                                    <Text selectable className="text-xs">
                                        Expected Completion Date
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        Nov 26, 2030
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Redeem through
                        </Text>
                        <RadioButton
                            name="Redeem Through"
                            value={methodSelect}
                            setValue={setMethodSelect}
                            options={[
                                {
                                    label: "Enter Amount",
                                    value: "Enter Amount",
                                },
                                { label: "Enter Units", value: "Enter Units" },
                            ]}
                        />
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            keyboardType="number-pad"
                            placeholder={methodSelect}
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
    ];

    const renderInfo = {
        1: {
            title: "Please Select Mutual Fund",
            content: <InvestModalSearch selectFund={selectFund} />,
        },
        2: {
            title: "Redeem in",
            content: (
                <InvestModalAction
                    deselectFund={deselectFund}
                    tabContent={tabContentForRedeem}
                />
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {cardNumber > 1 && (
                        <IonIcon
                            name="chevron-back-outline"
                            size={24}
                            onPress={deselectFund}
                        />
                    )}
                    <Text className="text-xl font-medium center">
                        {renderInfo[cardNumber].title}
                    </Text>
                </View>
                <IonIcon name="close-outline" size={24} onPress={hideDialog} />
            </View>
            {renderInfo[cardNumber].content}
        </View>
    );
};

const AccountDetailsCard = ({ data }: { data: ClientDetailItem }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const accordionData = [
        {
            title: "Kotak Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                    <Text className="text-xs text-purple-700">Primary</Text>
                </View>
            ),
            content: (
                <View className="w-full p-4">
                    <DataValue
                        key="branchName"
                        title="Branch Name"
                        value="Mahatama Gandhi Road, Bengaluru"
                    />
                    <DataValue
                        key="ifsc"
                        title="IFSC Code"
                        value="KMB0003838"
                    />
                    <DataValue
                        key="accountType"
                        title="Account Type"
                        value="Savings"
                    />
                    <DataValue key="autopay" title="Autopay" value="Enabled" />
                    <View className="p-2">
                        <Text className="text-md font-semibold py-4">
                            Autopay Details
                        </Text>
                        <View className="flex flex-row justify-between">
                            <DataGrid
                                key="autopay"
                                reverse
                                title="Autopay ID"
                                value={
                                    <View className="flex flex-row items-center gap-2">
                                        <Text className="text-sm">
                                            73478236874789
                                        </Text>
                                        <Icon
                                            name="copy"
                                            style={{ fontWeight: "100" }}
                                            size={12}
                                            color="grey"
                                        />
                                    </View>
                                }
                            />
                            <DataGrid
                                key="status"
                                reverse
                                title="Status"
                                value={
                                    <Text className="text-green-500 text-sm">
                                        Approved
                                    </Text>
                                }
                            />
                        </View>
                        <View className="flex flex-row justify-between">
                            <DataGrid
                                key="requestedOn"
                                reverse
                                title="Requested on"
                                value={
                                    <Text className="text-sm">
                                        Jan 22, 2024
                                    </Text>
                                }
                            />
                            <DataGrid
                                key="autopayAmount"
                                reverse
                                title="Autopay Amount"
                                value={
                                    <Text className="text-sm">
                                        {RupeeSymbol} 2,00,000
                                    </Text>
                                }
                            />
                        </View>
                        <Button
                            width="48"
                            bgColor={"#013974"}
                            onPress={() => console.log("Press Invest")}
                        >
                            Set Autopay
                        </Button>
                    </View>
                </View>
            ),
        },
        {
            title: "HDFC Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                </View>
            ),
            content: "HDFC Bank Details",
        },
        {
            title: "Canara Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                </View>
            ),
            content: "Canara Bank Details",
        },
    ];

    const renderItem = (item) => (
        <View style={{ padding: 10 }}>
            <Text>{item.content}</Text>
        </View>
    );
    const tabContent = [
        {
            key: "bankAccounts",
            name: "Bank Accounts",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    <Accordion
                        accordionData={accordionData}
                        renderItem={renderItem}
                    />
                </View>
            ),
        },
        {
            key: "contactDetails",
            name: "Contact Details",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    <DataValue
                        key="email"
                        title="Email"
                        value={data?.users[0]?.credentials[0].email}
                    />
                    <DataValue
                        key="mobile"
                        title="Mobile Number"
                        value={data?.users[0]?.credentials[0].mobileNumber}
                    />
                    <DataValue
                        key="address"
                        title="Address"
                        value="21 Yemen Road, 765432, Yemen State, Yemen"
                    />
                </View>
            ),
        },
        {
            key: "nomineeDetails",
            name: "Nominee Details",
            content: (
                <View>
                    <Text>Nominee</Text>
                </View>
            ),
        },
    ];
    return (
        <CardWithTabs
            key="account"
            selectedTab={selectedTab}
            handleTabPress={handleTabPress}
            tabContent={tabContent}
        />
    );
};

const MutualFundCard = ({ data }) => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <DataTable
                key="topMutualFund"
                headers={["Top Mutual Funds"]}
                cellSize={[8, 4]}
                rows={[
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={12}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={8}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={8}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                ]}
            />
        </View>
    );
};

const TopAMCCard = ({ data }) => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <DataTable
                key="topAMCs"
                headers={["Top AMCs"]}
                cellSize={[12]}
                rows={[
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                ]}
            />
        </View>
    );
};
