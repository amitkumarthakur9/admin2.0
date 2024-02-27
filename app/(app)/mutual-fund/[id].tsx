import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
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
    Image,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";

import RemoteApi from "../../../src/services/RemoteApi";
import {
    ClientDetailItem,
    ClientDetailResponse,
} from "../../../src/interfaces/ClientDetailInterface";
import {
    SIPDetailResponseInterface,
    SIPReportDetail,
} from "../../../src/interfaces/SIPDetailInterface";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../src/helper/helper";
import CardWithTabs from "../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../src/components/Accordion/Accordion";
import DataTable from "../../../src/components/DataTable/DataTable";
import { Title } from "react-native-paper";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text
                    className="text-bold font-medium text-gray-500"
                    selectable
                >
                    {title ? title : "-"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text selectable className="font-medium text-start text-black">
                    {value ? value : "-"}
                </Text>
            </View>
        </View>
    );
};

export default function MutualFundDetail() {
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
                                    Mutual Fund Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded h-auto p-4"
                                style={{ ...BreadcrumbShadow }}
                            >
                                <View className="flex flex-col gap-2 w-full">
                                    <View className="flex flex-row py-2 items-center w-full flex-wrap ">
                                        <View
                                            className={
                                                "flex flex-row items-center justify-start w-8/12"
                                            }
                                        >
                                            {/* <Image
                                                alt="fundHouse"
                                                className="mr-2"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: "contain",
                                                }}
                                                source={{
                                                    uri: 'https://mfapi.kotaksecurities.online/bank/74/logo',
                                                }}
                                            /> */}
                                            <View className="w-8 h-8 rounded bg-gray-500 mx-2" />
                                            <View
                                                className={
                                                    "flex flex-col justify-end items-start"
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                >
                                                    Axis Mid Cap Fund
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        Axis Mid Cap Fund
                                                    </Text>
                                                    <View className="mx-2">
                                                        <Icon
                                                            name="circle"
                                                            style={{
                                                                fontWeight:
                                                                    "100",
                                                            }}
                                                            size={8}
                                                            color="grey"
                                                        />
                                                    </View>
                                                    <Text
                                                        selectable
                                                        className="text-black text-xs"
                                                    >
                                                        Equity
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View
                                        className="my-2"
                                        style={{
                                            borderColor: "#e4e4e4",
                                            borderBottomWidth:
                                                StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="NAV"
                                                title="NAV:"
                                                value={RupeeSymbol + 2500}
                                            />
                                            <DataValue
                                                key="1YearReturn"
                                                title="1 Year Return:"
                                                value="16%"
                                            />
                                            <DataValue
                                                key="MinSIPAmount"
                                                title="Min. SIP Amount:"
                                                value={RupeeSymbol + "2500"}
                                            />
                                            <DataValue
                                                key="FundHouseName"
                                                title="Fund House Name:"
                                                value="Axis Mutual Fund"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="YourTotalAUM"
                                                title="Your Total AUM:"
                                                value={RupeeSymbol + "16%"}
                                            />
                                            <DataValue
                                                key="3YearsReturn"
                                                title="3 Years Return:"
                                                value={RupeeSymbol + "2500"}
                                            />
                                            <DataValue
                                                key="MinInvestmentAmount"
                                                title="Min. Investment Amount:"
                                                value={
                                                    RupeeSymbol + "250,000,000"
                                                }
                                            />
                                            <DataValue
                                                key="TotalAUM"
                                                title="Total AUM:"
                                                value="Sunil Mehra(Client)"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="SIPCount"
                                                title="SIP Count"
                                                value={"3"}
                                            />
                                            <DataValue
                                                key="5YearsReturn"
                                                title="5 Years Return"
                                                value="16%"
                                            />
                                            <DataValue
                                                key="MinaddlInvestmentAmount"
                                                title="Min. addl. InvestmentAmount:"
                                                value="16%"
                                            />
                                            <DataValue
                                                key="ExpenseRatio"
                                                title="Expense Ratio:"
                                                value="16%"
                                            />
                                        </View>
                                    </View>
                                    <View
                                        className="my-2"
                                        style={{
                                            borderColor: "#e4e4e4",
                                            borderBottomWidth:
                                                StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <View className="w-4/12 pl-0">
                                        <DataValue
                                            key="FundHouseManagers"
                                            title="Fund House Managers"
                                            value="Nishant Arora"
                                        />
                                    </View>

                                    <Text>
                                        erspiciatis unde omnis iste natus error
                                        sit voluptatem accusantium doloremque
                                        laudantium, totam rem aperiam, eaque
                                        ipsa quae ab illo inventore veritatis et
                                        quasi architecto beatae vitae dicta sunt
                                        explicabo. Nemo enim ipsam voluptatem
                                        quia voluptas sit aspernatur aut odit
                                        aut fugit
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-full h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard data={data} />
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

    // const transactionRow = data?.transactions?.map((item) => {
    //     return [
    //         {
    //             key: "clientname",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             Ravi Teja
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "clientcode",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             765XVJ
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "pan",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             CXN765XVJ
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "amount",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             {RupeeSymbol + item?.amount}
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "date",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             23/09/2024
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "status",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                             {item.transactionStatus.name}
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //         {
    //             key: "type",
    //             content: (
    //                 <View className="flex flex-row items-center gap-2">
    //                     <View className="w-8 h-8 rounded bg-gray-500" />
    //                     <View>
    //                         <Text className="text-xs">
    //                         {item.transactionType.name}
    //                         </Text>
    //                     </View>
    //                 </View>

    //             )
    //         },
    //     ]
    // })

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    const tabContent = [
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
                        key="transaction"
                        headers={[
                            "Client Name",
                            "Client Code",
                            "PAN",
                            "Amount",
                            "Date",
                            "Status",
                            "Transaction Type",
                        ]}
                        cellSize={[1, 1, 1, 1, 1, 1, 1]}
                        rows={[
                            [
                                {
                                    key: "clientname",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View className="w-8 h-8 rounded bg-gray-500" />
                                            <View>
                                                <Text className="text-xs">
                                                    Ravi Teja
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "clientcode",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    765XVJ
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "pan",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    CXN765XVJ
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    {RupeeSymbol + "2500"}
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    23/09/2024
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    Success
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "type",
                                    content: (
                                        <View className="flex flex-row items-center gap-2">
                                            <View>
                                                <Text className="text-xs">
                                                    NA
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                            ],
                        ]}
                        // rows={[transactionRow]}
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
                tabsCount={2}
            />
        </View>
    );
};
