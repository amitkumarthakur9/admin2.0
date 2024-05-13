import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
    MutualFundDetailResponse,
    FundInfo,
} from "src/interfaces/MutualFundDetailInterface";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../src/helper/helper";
import CardWithTabs from "../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../src/components/Accordion/Accordion";
import DataTable from "../../../src/components/DataTable/DataTable";
import { Title } from "react-native-paper";
import DataText from "src/components/DataValue/DataText";
import { dateFormat, dateTimeFormat } from "../../../src/helper/DateUtils";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text
                    className="text-bold font-medium text-gray-500"
                    selectable
                >
                    {title ? title : "NA"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text selectable className="font-medium text-start text-black">
                    {value ? value : "NA"}
                </Text>
            </View>
        </View>
    );
};

export default function MutualFundDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<FundInfo>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: MutualFundDetailResponse = await RemoteApi.get(
                `mutualfund/${id}`
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
                                            {/* <View className="w-8 h-8 rounded bg-gray-500 mx-2" /> */}
                                            <View
                                                className={
                                                    "flex flex-col justify-end items-start"
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                >
                                                    {data?.name
                                                        ? data?.name
                                                        : "NA"}
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        {data?.category
                                                            ? data?.category
                                                            : "NA"}
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
                                                        {data?.mutualfundSubcategory
                                                            ? data?.mutualfundSubcategory
                                                            : "NA"}
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
                                                key="nav"
                                                title="NAV:"
                                                value={
                                                    data?.nav
                                                        ? RupeeSymbol +
                                                          data?.nav.toFixed(2)
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="1YearReturn"
                                                title="1 Year Return:"
                                                value={
                                                    data?.annualReturns
                                                        ? data?.annualReturns.toFixed(
                                                              2
                                                          ) + "%"
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="minSIPAmount"
                                                title="Min. SIP Amount:"
                                                value={
                                                    data?.minSIPAmount
                                                        ? RupeeSymbol +
                                                          data?.minSIPAmount
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="fundHouseName"
                                                title="Fund House Name:"
                                                value={
                                                    data?.fundhouse?.name
                                                        ? data?.fundhouse?.name
                                                        : "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="yourTotalAUM"
                                                title="Your Total AUM:"
                                                value={
                                                    data?.aum
                                                        ? RupeeSymbol +
                                                          data?.aum.toFixed(2)
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="3YearsReturn"
                                                title="3 Years Return:"
                                                value={
                                                    data?.threeYearAnnualReturns
                                                        ? data?.threeYearAnnualReturns.toFixed(
                                                              2
                                                          ) + "%"
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="minInvestmentAmount"
                                                title="Min. Investment Amount:"
                                                value={
                                                    data?.minInvestment
                                                        ? RupeeSymbol +
                                                          data?.minInvestment
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="totalAUM"
                                                title="Total AUM:"
                                                value={
                                                    data?.fundhouse?.aum
                                                        ? RupeeSymbol +
                                                          data?.fundhouse?.aum.toFixed(
                                                              2
                                                          )
                                                        : "NA"
                                                }
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
                                                value={
                                                    data?.fiveYearAnnualReturns
                                                        ? data?.fiveYearAnnualReturns.toFixed(
                                                              2
                                                          ) + "%"
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="MinaddlInvestmentAmount"
                                                title="Min. addl. InvestmentAmount:"
                                                value={
                                                    data?.minAdditionalInvestment
                                                        ? RupeeSymbol +
                                                          data?.minAdditionalInvestment
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="ExpenseRatio"
                                                title="Expense Ratio:"
                                                value={
                                                    data?.expenseRatio
                                                        ? data?.expenseRatio
                                                        : "NA"
                                                }
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

    const transactionData = data?.transactions?.map((item) => {
        return [
            {
                key: "clientname",
                content: (
                    <View className="flex flex-row items-center gap-2">
                        <View>
                            <Pressable
                                onPress={() =>
                                    router.push(`clients/${item?.account?.id}`)
                                }
                            >
                                <Text className="text-xs">
                                    {item?.account?.name
                                        ? item?.account?.name
                                        : "NA"}
                                </Text>
                            </Pressable>
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
                                {item?.account?.clientId
                                    ? item?.account?.clientId
                                    : "NA"}
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
                                {item?.account?.panNumber
                                    ? item?.account?.panNumber
                                    : "NA"}
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
                                {item?.account?.amount
                                    ? RupeeSymbol + item?.account?.amount
                                    : "NA"}
                            </Text>
                        </View>
                    </View>
                ),
            },
            {
                key: "createdDate",
                content: (
                    <View className="flex flex-row items-center gap-2">
                        <View>
                            <Text className="text-xs">
                                {item?.createdAt
                                    ? dateTimeFormat(item?.createdAt)
                                    : "NA"}
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
                                {item?.transactionStatus?.name
                                    ? item?.transactionStatus?.name
                                    : "NA"}
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
                                {item?.transactionStatus?.name
                                    ? item?.transactionStatus?.name
                                    : "NA"}
                            </Text>
                        </View>
                    </View>
                ),
            },
        ];
    });

    const sipData = data?.sip?.map((item) => {
        return [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center gap-2">
                        <View>
                            <Pressable
                                onPress={() =>
                                    router.push(`clients/${item?.account?.id}`)
                                }
                            >
                                <Text className="text-xs">
                                    {item?.account?.name
                                        ? item?.account?.name
                                        : "NA"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ),
            },
            {
                key: "clientCode",
                content: (
                    <View>
                        <Text selectable className="text-xs text-black">
                            {item?.account?.clientId
                                ? item?.account?.clientId
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "pan",
                content: (
                    <View>
                        <Text selectable className="text-xs text-gray-500">
                            {item?.account?.panNumber
                                ? item?.account?.panNumber
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "amount",
                content: (
                    <View>
                        <Text selectable className="text-xs text-gray-500">
                            {item?.amount
                                ? RupeeSymbol + item?.amount.toFixed(2)
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "startDate",
                content: (
                    <View>
                        <Text selectable className="text-xs text-gray-500">
                            {item?.startDate
                                ? dateFormat(item?.startDate)
                                : "NA"}
                        </Text>
                    </View>
                ),
            },
            {
                key: "detail",
                content: (
                    <View>
                        <Text
                            selectable
                            className="text-xs text-gray-500 underline"
                        >
                            <Pressable
                                onPress={() =>
                                    router.push(`sip-reports/${item?.id}`)
                                }
                            >
                                <Text
                                    selectable
                                    className="flex flex-row text-black font-semibold break-all"
                                >
                                    View Details
                                </Text>
                            </Pressable>
                        </Text>
                    </View>
                ),
            },
        ];
    });

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    const tabContent = [
        {
            key: "sips",
            name: "SIPs",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <DataTable
                        key="sips"
                        headers={[
                            "Client Name",
                            "Client Code",
                            "PAN",
                            "Amount",
                            "Start Date",
                            "",
                        ]}
                        cellSize={[1, 1, 1, 1, 1, 1]}
                        rows={sipData}
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
                        rows={transactionData}
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
