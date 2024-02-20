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

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text className="text-bold font-medium text-black" selectable>
                    {title ? title : "-"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text
                    selectable
                    className="font-medium text-start text-gray-500"
                >
                    {value ? value : "-"}
                </Text>
            </View>
        </View>
    );
};

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
                    />
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
            />
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
